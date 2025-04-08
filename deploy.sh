#!/bin/bash
SOURCE_DIR=~/repos/music-player
DEPLOY_DIR=/home/reinir/Public/music-player

echo "Deploying music player..."

# Copy only the public-facing files
scp -r "$SOURCE_DIR"/public/* server1:"$DEPLOY_DIR"

echo "Deployment complete"
