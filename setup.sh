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

loading_bar() {
  local duration=$1
  local completed=0
  local bar_length=20
  local interval=$(echo "$duration/$bar_length" | bc -l)

  echo -n "["
  while ((completed < bar_length)); do
    sleep "$interval"
    echo -n "#"
    ((completed++))
  done
  echo "] Done!"
}

clear

separator
info "Starting the setup process..."
separator

info "Step 1: Updating package lists..."
START_TIME=$(date +%s)
sudo apt update -y > /dev/null 2>&1
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
loading_bar "$DURATION"
separator

info "Step 2: Installing Node.js, npm, and Certbot..."
START_TIME=$(date +%s)
sudo apt install -y nodejs npm certbot python3-certbot-nginx > /dev/null 2>&1
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
loading_bar "$DURATION"
separator

info "Step 3: Installing Express..."
START_TIME=$(date +%s)
npm install express > /dev/null 2>&1
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
loading_bar "$DURATION"
separator

info "Step 4: Please enter your subdomain (e.g., subdomain.example.com):"
read -p "Subdomain: " SUBDOMAIN

if [ -z "$SUBDOMAIN" ]; then
  error "No subdomain entered. Exiting."
  separator
  exit 1
fi

info "Step 5: Requesting SSL certificate for $SUBDOMAIN..."
sudo certbot --nginx -d "$SUBDOMAIN"
separator

success "SSL configuration complete for $SUBDOMAIN!"
separator

info "Step 6: Running conf.sh..."
START_TIME=$(date +%s)
sudo bash /var/www/oav/conf.sh
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
loading_bar "$DURATION"
separator

info "Step 7: Installing PM2..."
START_TIME=$(date +%s)
sudo npm install pm2 -g > /dev/null 2>&1
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
loading_bar "$DURATION"
separator

info "Step 8: Starting the server with PM2..."
pm2 start /var/www/oav/index.mjs
separator

info "Step 9: Saving PM2 process list..."
START_TIME=$(date +%s)
pm2 save > /dev/null 2>&1
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
loading_bar "$DURATION"
separator

info "Step 10: Configuring PM2 to start on boot..."
START_TIME=$(date +%s)
pm2 startup > /dev/null 2>&1
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
loading_bar "$DURATION"
separator

info "Step 11: Running updates.sh..."
START_TIME=$(date +%s)
sudo nohup bash /var/www/oav/updates.sh &> /var/www/oav/updates.log &
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
loading_bar "$DURATION"
separator

success "🎉 Congratulations! Your setup is complete, and your domain is now live with Ulrua! 🎉 You can now safely close this terminal."
separator