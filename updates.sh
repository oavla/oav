#!/bin/bash

cd /var/www/ulr

branch="main"

while true; do
    git fetch origin
    LOCAL=$(git rev-parse $branch)
    REMOTE=$(git rev-parse origin/$branch)

    if [ $LOCAL != $REMOTE ]; then
        echo "Changes detected, pulling the latest updates..."
        git pull origin $branch
        sudo systemctl reload nginx
    fi

    sleep 10
done

