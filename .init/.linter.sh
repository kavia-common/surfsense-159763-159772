#!/bin/bash
cd /home/kavia/workspace/code-generation/surfsense-159763-159772/surf_buddy_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

