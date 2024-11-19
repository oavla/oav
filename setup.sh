#!/bin/bash

sudo apt update -y

sudo apt install -y nodejs npm

npm install express

sudo apt install -y certbot python3-certbot-nginx

read -p "Please enter your subdomain (e.g., subdomain.example.com): " SUBDOMAIN

if [ -z "$SUBDOMAIN" ]; then
  echo "No subdomain entered. Exiting."
  exit 1
fi

echo "Requesting SSL certificate for $SUBDOMAIN..."
sudo certbot --nginx -d $SUBDOMAIN

echo "SSL configuration complete for $SUBDOMAIN!"

echo "Running conf.sh..."
sudo bash /var/www/oav/conf.sh

echo "Running updates.sh..."
sudo bash /var/www/oav/updates.sh

echo "Installing PM2..."
sudo npm install pm2 -g

echo "Starting the application with PM2..."
pm2 start /var/www/oav/index.mjs

echo "Saving PM2 process list..."
pm2 save

echo "Configuring PM2 to start on boot..."
pm2 startup

echo "PM2 is set up and your application is running!"
