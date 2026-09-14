#!/usr/bin/env bash
set -euo pipefail

if [[ "$#" -ne 1 ]]; then
  echo "Usage: $(basename "$0") <platform-package-path>" >&2
  exit 2
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
PACKAGE_PATH="${1#platform/}"
cd "$REPO_ROOT/platform"
afm ts check --project "./${PACKAGE_PATH}/tsconfig.dev.json"
