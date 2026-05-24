#!/bin/bash
FILE="$(dirname "$0")/index.html"
if [ -d "/Applications/Google Chrome.app" ]; then
  open -a "Google Chrome" "$FILE"
else
  open "$FILE"
fi
