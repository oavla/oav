#!/bin/bash

# Functions for styled output
info() {
  echo -e "\033[1;34m$1\033[0m"
}

success() {
  echo -e "\033[1;32m$1\033[0m"
}

error() {
  echo -e "\033[1;31m$1\033[0m"
}

separator() {
  echo -e "\033[1;37m---------------------------------------------\033[0m"
}

clear

separator
info "Starting the setup process..."
separator

info "Step 1: Updating package lists..."
sudo apt update -y > /dev/null 2>&1
separator

info "Step 2: Installing Node.js, npm, and Certbot..."
sudo apt install -y nodejs npm certbot python3-certbot-nginx > /dev/null 2>&1
separator

info "Step 3: Installing Express..."
npm install express > /dev/null 2>&1
separator

info "Step 4: Running conf.sh..."
sudo bash /var/www/oav/conf.sh > /dev/null 2>&1
separator

info "Step 5: Installing PM2..."
sudo npm install pm2 -g > /dev/null 2>&1
separator

info "Step 6: Starting the application with PM2..."
pm2 start /var/www/oav/index.mjs
separator

info "Step 7: Saving PM2 process list..."
pm2 save
separator

info "Step 8: Configuring PM2 to start on boot..."
pm2 startup > /dev/null 2>&1
separator

info "Step 9: Running updates.sh..."
sudo nohup bash /var/www/oav/updates.sh &> /var/www/oav/updates.log &
separator

info "Step 10: Setting up domain tracking and automated SSL..."
cat <<'EOT' | sudo tee /usr/local/bin/track_and_certify.sh > /dev/null
#!/bin/bash

# Functions for styled output
info() {
  echo -e "\033[1;34m$1\033[0m"
}

success() {
  echo -e "\033[1;32m$1\033[0m"
}

error() {
  echo -e "\033[1;31m$1\033[0m"
}

separator() {
  echo -e "\033[1;37m---------------------------------------------\033[0m"
}

# File to store already processed domains
PROCESSED_DOMAINS="/var/log/tracked_domains.log"

# Create file if it doesn't exist
if [[ ! -f $PROCESSED_DOMAINS ]]; then
  touch $PROCESSED_DOMAINS
fi

info "Starting domain tracking and SSL provisioning..."

while true; do
  separator

  # Extract domains from access logs (adjust path to your server logs)
  DOMAINS=$(grep -Eho 'Host: [a-zA-Z0-9.-]+' /var/log/nginx/access.log | awk '{print $2}' | sort -u)

  for DOMAIN in $DOMAINS; do
    if ! grep -qx "$DOMAIN" "$PROCESSED_DOMAINS"; then
      info "New domain detected: $DOMAIN"
      
      # Attempt to get SSL certificate
      sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email your-email@example.com > /dev/null 2>&1
      if [[ $? -eq 0 ]]; then
        success "SSL successfully provisioned for $DOMAIN"
        echo "$DOMAIN" >> "$PROCESSED_DOMAINS"
      else
        error "Failed to provision SSL for $DOMAIN"
      fi
    fi
  done

  # Wait for a minute before the next check
  sleep 60
done
EOT

sudo chmod +x /usr/local/bin/track_and_certify.sh

sudo nohup /usr/local/bin/track_and_certify.sh &> /var/log/domain_tracker.log &
success "Domain tracking and automated SSL setup complete."
separator

success "🎉 Congratulations! Your setup is complete, and Certbot is now managing automated SSL for your domains!"
separator