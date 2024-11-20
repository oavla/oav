#!/bin/bash

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

info "Step 4: Please enter your subdomain (e.g., subdomain.example.com):"
read -p "Subdomain: " SUBDOMAIN

if [ -z "$SUBDOMAIN" ]; then
  error "No subdomain entered. Exiting."
  separator
  exit 1
fi

info "Step 5: Requesting SSL certificate for $SUBDOMAIN..."
sudo certbot --nginx -d $SUBDOMAIN
separator

info "Step 6: Running conf.sh..."
sudo bash /var/www/oav/conf.sh > /dev/null 2>&1
separator

info "Step 7: Installing PM2..."
sudo npm install pm2 -g > /dev/null 2>&1
separator

info "Step 8: Starting the application with PM2..."
pm2 start /var/www/oav/index.mjs
separator

info "Step 9: Saving PM2 process list..."
pm2 save
separator

info "Step 10: Configuring PM2 to start on boot..."
pm2 startup
separator

info "Step 11: Running updates.sh..."
sudo nohup bash /var/www/oav/updates.sh &> /var/www/oav/updates.log &
separator

info "Step 12: Installing Caddy for automated SSL..."
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https > /dev/null 2>&1
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update -y > /dev/null 2>&1
sudo apt install -y caddy > /dev/null 2>&1
separator

info "Step 13: Configuring Caddyfile for automated SSL..."
sudo bash -c "cat > /etc/caddy/Caddyfile" <<EOL
{
    auto_https disable_redirects
}

$SUBDOMAIN {
    reverse_proxy localhost:8080
}
EOL
separator

info "Step 14: Restarting Caddy to apply configuration..."
sudo systemctl restart caddy
sudo systemctl enable caddy
separator

success "🎉 Congratulations! Your setup is complete, and Caddy is now managing automated SSL for $SUBDOMAIN!"
separator