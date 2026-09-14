#!/usr/bin/env bash
set -euo pipefail

if [[ "$#" -ne 1 ]]; then echo "Usage: $(basename "$0") <platform-package-path>" >&2; exit 2; fi
REPO_ROOT="$(git rev-parse --show-toplevel)"
PACKAGE_PATH="$1"
PKG_NAME="$(node -p 'require(process.argv[1]).name' "$REPO_ROOT/$PACKAGE_PATH/package.json")"
MESSAGE="${VOLT_CHANGESET_MESSAGE:-Add dedicated public entrypoint imports for ${PKG_NAME}. Root and deprecated compatibility imports remain supported for existing consumers.}"
cd "$REPO_ROOT/platform"
yarn changeset --non-interactive --isUxChange=false "$PKG_NAME" minor "$MESSAGE"
