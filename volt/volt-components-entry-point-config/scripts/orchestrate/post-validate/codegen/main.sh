#!/usr/bin/env bash
set -euo pipefail
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT/platform"
afm workspace @atlaskit/volt-components-entry-point-config codegen
