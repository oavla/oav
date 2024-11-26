#!/bin/bash

NginxConfigFile="/etc/nginx/sites-available/default"
BackupConfigFile="/etc/nginx/sites-available/default.bak"
RevertBackupConfigFile="/etc/nginx/sites-available/default.revert.bak"
DhparamFile="/etc/ssl/certs/dhparam.pem"

echo "Backing up the original Nginx configuration..."
sudo cp $NginxConfigFile $BackupConfigFile
sudo cp $NginxConfigFile $RevertBackupConfigFile

if [ ! -f "$DhparamFile" ]; then
    echo "Diffie-Hellman parameters file not found, generating it..."
    sudo openssl dhparam -out $DhparamFile 2048
    if [ $? -eq 0 ]; then
        echo "Diffie-Hellman parameters generated successfully."
    else
        echo "Failed to generate Diffie-Hellman parameters. Please check your OpenSSL installation."
        exit 1
    fi
else
    echo "Diffie-Hellman parameters file already exists."
fi

echo "Fetching domain/subdomain from Certbot..."
DOMAIN=$(sudo certbot certificates | grep -oP '(?<=Domains: ).*' | head -n 1)

if [ -z "$DOMAIN" ]; then
    echo "No valid domain found in Certbot. Please ensure you've run Certbot and have a valid SSL certificate."
    exit 1
fi

echo "Domain/subdomain found: $DOMAIN"

echo "Writing the updated Nginx configuration..."
cat <<EOF | sudo tee $NginxConfigFile > /dev/null
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$host\$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    # Strong SSL Configuration for security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_dhparam /etc/ssl/certs/dhparam.pem;

    # HTTP Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    location / {
        # Proxy requests to the app
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Log requests
        access_log /var/log/nginx/access.log combined;
    }

    # Error handling
    error_page 403 404 500 502 503 504 /custom_50x.html;
    location = /custom_50x.html {
        root /usr/share/nginx/html;
        internal;
    }
}
EOF

echo "Testing Nginx configuration for validity..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "Nginx configuration is valid."
else
    echo "Nginx configuration test failed. Reverting to the original configuration."
    sudo cp $BackupConfigFile $NginxConfigFile
    exit 1
fi

echo "Reloading Nginx to apply the new configuration..."
sudo systemctl reload nginx

if [ $? -eq 0 ]; then
    echo "Nginx reload successful."
else
    echo "Nginx reload failed. Please check the Nginx error logs for details."
    exit 1
fi

echo "Nginx setup complete! Please check your site at https://$DOMAIN"

echo "To revert to the previous configuration, run the following command:"
echo "sudo cp $RevertBackupConfigFile $NginxConfigFile"
