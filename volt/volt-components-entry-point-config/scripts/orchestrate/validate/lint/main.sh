#!/usr/bin/env bash
set -u -o pipefail

if [[ "$#" -ne 1 ]]; then
  echo "Usage: $(basename "$0") <platform-package-path>" >&2
  exit 2
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
PACKAGE_PATH="${1#platform/}"
cd "$REPO_ROOT/platform"

eslint_status=0
oxlint_status=0

afm lint eslint "$PACKAGE_PATH" || eslint_status=$?
afm lint oxlint "$PACKAGE_PATH" || oxlint_status=$?

if [[ "$eslint_status" -ne 0 || "$oxlint_status" -ne 0 ]]; then
  exit 1
fi
