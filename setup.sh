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

start_timer() {
  START_TIME=$SECONDS
}

show_timer() {
  while :; do
    ELAPSED_TIME=$(($SECONDS - $START_TIME))
    echo -ne "\033[1;33mTimelapse: $ELAPSED_TIME seconds\033[0m\r"
    sleep 1
  done
}

clear

separator
info "Starting the setup process..."
separator

start_timer
info "Step 1: Updating package lists..."
sudo apt update -y > /dev/null 2>&1 & 
show_timer &
wait
separator

start_timer
info "Step 2: Installing Node.js, npm, and Certbot..."
sudo apt install -y nodejs npm certbot python3-certbot-nginx > /dev/null 2>&1 & 
show_timer &
wait
separator

start_timer
info "Step 3: Installing Express..."
npm install express > /dev/null 2>&1 &
show_timer &
wait
separator

info "Step 4: Please enter your subdomain (e.g., subdomain.example.com):"
read -p "Subdomain: " SUBDOMAIN

if [ -z "$SUBDOMAIN" ]; then
  error "No subdomain entered. Exiting."
  separator
  exit 1
fi

start_timer
info "Step 5: Requesting SSL certificate for $SUBDOMAIN..."
sudo certbot --nginx -d $SUBDOMAIN &
show_timer &
wait
separator

success "SSL configuration complete for $SUBDOMAIN!"
separator

start_timer
info "Step 6: Running conf.sh..."
sudo bash /var/www/oav/conf.sh > /dev/null 2>&1 &
show_timer &
wait
separator

start_timer
info "Step 7: Installing PM2..."
sudo npm install pm2 -g > /dev/null 2>&1 &
show_timer &
wait
separator

start_timer
info "Step 8: Starting the application with PM2..."
pm2 start /var/www/oav/index.mjs &
show_timer &
wait
separator

start_timer
info "Step 9: Saving PM2 process list..."
pm2 save &
show_timer &
wait
separator

start_timer
info "Step 10: Configuring PM2 to start on boot..."
pm2 startup &
show_timer &
wait
separator

start_timer
info "Step 11: Running updates.sh..."
sudo nohup bash /var/www/oav/updates.sh &> /dev/null &
show_timer &
wait
separator

success "🎉 Congratulations! Your setup is complete, and your domain is now live with Ulrua! 🎉 You can now safely close this terminal."
separator