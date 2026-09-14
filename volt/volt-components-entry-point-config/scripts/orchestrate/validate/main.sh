#!/usr/bin/env bash
set -euo pipefail

if [[ "$#" -ne 1 ]]; then
  echo "Usage: $(basename "$0") <platform-package-path>" >&2
  exit 2
fi

PACKAGE_PATH="$1"
REPO_ROOT="$(git rev-parse --show-toplevel)"
PACKAGE_JSON="$REPO_ROOT/$PACKAGE_PATH/package.json"
TMP_DIR="$REPO_ROOT/.ai/volt/tmp"
LOG_DIR="$TMP_DIR/logs"
MANIFEST_FILE="$TMP_DIR/stages.ndjson"
OUTPUT_FILE="$TMP_DIR/output.json"
VALIDATE_SCRIPTS_DIR="$REPO_ROOT/platform/packages/volt/volt-components-entry-point-config/scripts/orchestrate/validate"
REPORTER="$VALIDATE_SCRIPTS_DIR/report/index.mjs"
MERGE_BASE="$(git merge-base HEAD "${VOLT_BASE_REF:-master}")"

rm -f "$MANIFEST_FILE"
mkdir -p "$LOG_DIR"
failed=0

run_stage() {
  local id="$1"
  local stage_name="$2"
  shift 2
  local log_file="$LOG_DIR/${id}.log"
  local status=0

  "$@" >"$log_file" 2>&1 || status=$?
  node "$REPORTER" append "$MANIFEST_FILE" "$id" "$stage_name" "$status" "$log_file"
  if [[ "$status" -ne 0 ]]; then
    failed=1
  fi
}

run_stage 1 "Export-map key validity" \
  node "$VALIDATE_SCRIPTS_DIR/check-package-export-keys/index.mjs" "$PACKAGE_JSON"
run_stage 2 "Merge-base export API compatibility" \
  node "$VALIDATE_SCRIPTS_DIR/check-exported-identifiers/index.mjs" "$PACKAGE_JSON" --merge-base "$MERGE_BASE"
run_stage 3 "New implementation target shape" \
  node "$VALIDATE_SCRIPTS_DIR/check-export-target-shapes/index.mjs" "$PACKAGE_JSON" --merge-base "$MERGE_BASE"
run_stage 4 "Public target dependency resolution" \
  node "$VALIDATE_SCRIPTS_DIR/check-public-imports/index.mjs" "$PACKAGE_JSON"
run_stage 5 "Typecheck" \
  "$VALIDATE_SCRIPTS_DIR/typecheck/main.sh" "$PACKAGE_PATH"
run_stage 6 "Unit tests" \
  "$VALIDATE_SCRIPTS_DIR/unit-tests/main.sh" "$PACKAGE_PATH"
run_stage 7 "Lint" \
  "$VALIDATE_SCRIPTS_DIR/lint/main.sh" "$PACKAGE_PATH"

node "$REPORTER" write "$MANIFEST_FILE" "$OUTPUT_FILE" "$PACKAGE_PATH" "$MERGE_BASE"

if [[ "$failed" -ne 0 ]]; then
  echo "Checks failed — full report: $OUTPUT_FILE" >&2
  exit 1
fi

echo "Validation complete. Full report: $OUTPUT_FILE"
