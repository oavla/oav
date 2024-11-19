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

separator
info "Starting the setup process..."
separator

info "Step 1: Updating package lists..."
sudo apt update -y
separator

info "Step 2: Installing Node.js, npm, and Certbot..."
sudo apt install -y nodejs npm certbot python3-certbot-nginx
separator

info "Step 3: Installing Express..."
npm install express
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

success "SSL configuration complete for $SUBDOMAIN!"
separator

info "Step 6: Running conf.sh..."
sudo bash /var/www/oav/conf.sh
separator

info "Step 7: Installing PM2..."
sudo npm install pm2 -g
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
sudo bash /var/www/oav/updates.sh
separator

success "🎉 Setup is complete! PM2 is set up, your application is running, and updates are complete! 🎉"
separator
