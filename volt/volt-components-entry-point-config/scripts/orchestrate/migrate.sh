#!/usr/bin/env bash
set -euo pipefail

if [[ "$#" -ne 1 ]]; then
  echo "Usage: $(basename "$0") <platform-package-path>" >&2
  exit 2
fi

PACKAGE_PATH="$1"
REPO_ROOT="$(git rev-parse --show-toplevel)"

cd "$REPO_ROOT"

(
  cd ./afm-tools
  cargo run -p volt-codemods --bin volt-migrate-package -- "../$PACKAGE_PATH"
)
