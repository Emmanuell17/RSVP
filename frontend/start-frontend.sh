#!/usr/bin/env bash
# Starts the CRA dev server without depending on Cursor's minimal PATH.
# Usage from the frontend folder: bash start-frontend.sh
set -e
cd "$(dirname "$0")"

export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

if [[ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]]; then
  NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  export NVM_DIR
  # shellcheck source=/dev/null
  . "$NVM_DIR/nvm.sh"
fi

if [[ -x /opt/homebrew/bin/fnm ]]; then
  eval "$(/opt/homebrew/bin/fnm env)"
elif command -v fnm >/dev/null 2>&1; then
  eval "$(fnm env)"
fi

if command -v npm >/dev/null 2>&1; then
  exec npm start
fi

for NODE in "$(command -v node 2>/dev/null)" /opt/homebrew/bin/node /usr/local/bin/node; do
  if [[ -n "$NODE" && -x "$NODE" ]] && [[ -f ./node_modules/react-scripts/scripts/start.js ]]; then
    exec "$NODE" ./node_modules/react-scripts/scripts/start.js
  fi
done

echo "Could not find npm or node. Install Node.js from https://nodejs.org" >&2
exit 1
