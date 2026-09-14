#!/usr/bin/env bash
set -euo pipefail

if [[ "$#" -ne 1 ]]; then
  echo "Usage: $(basename "$0") <platform-package-path>" >&2
  exit 2
fi

PACKAGE_PATH="$1"
REPO_ROOT="$(git rev-parse --show-toplevel)"

cd "$REPO_ROOT"

SCRIPTS_DIR="$REPO_ROOT/platform/packages/volt/volt-components-entry-point-config/scripts/orchestrate"

bash "$SCRIPTS_DIR/migrate.sh" "$PACKAGE_PATH"
bash "$SCRIPTS_DIR/validate/main.sh" "$PACKAGE_PATH"

bash "$SCRIPTS_DIR/post-validate/main.sh" "$PACKAGE_PATH"

echo "Migration and validation green. Working tree left uncommitted for human review."
echo "Check output (should be clean): $REPO_ROOT/.ai/volt/tmp/output.json"
