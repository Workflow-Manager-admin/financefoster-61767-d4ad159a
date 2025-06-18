#!/bin/bash
cd /home/kavia/workspace/code-generation/financefoster-61767-d4ad159a/financefoster
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

