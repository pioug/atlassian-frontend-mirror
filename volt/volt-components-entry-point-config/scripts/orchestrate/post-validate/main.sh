#!/usr/bin/env bash
set -euo pipefail
if [[ "$#" -ne 1 ]]; then echo "Usage: $(basename "$0") <platform-package-path>" >&2; exit 2; fi
REPO_ROOT="$(git rev-parse --show-toplevel)"
PACKAGE_PATH="$1"
POST_VALIDATE_SCRIPTS_DIR="$REPO_ROOT/platform/packages/volt/volt-components-entry-point-config/scripts/orchestrate/post-validate"
bash "$POST_VALIDATE_SCRIPTS_DIR/changeset/main.sh" "$PACKAGE_PATH"
node "$POST_VALIDATE_SCRIPTS_DIR/mark-volt-compliant/main.mjs" "$PACKAGE_PATH"
bash "$POST_VALIDATE_SCRIPTS_DIR/codegen/main.sh"
