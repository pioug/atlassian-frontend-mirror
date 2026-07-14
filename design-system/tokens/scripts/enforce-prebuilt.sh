#! /bin/bash

set -uxo pipefail

# Build the package and retain its exit code so codegen failures are not hidden by the diff check.
BUILD_EXIT_CODE=0
yarn build @atlaskit/tokens --skip-cache || BUILD_EXIT_CODE=$?

# Check every generated artifact written by the tokens postbuild.
GENERATED_PATHS=(
    packages/design-system/tokens
    packages/design-system/primitives/src/xcss/style-maps.partial.tsx
    packages/design-system/css/codemods/0.5.2-primitives-emotion-to-compiled/style-maps.partial.tsx
    packages/design-system/ds-explorations/src/components/interaction-surface.partial.tsx
    packages/design-system/ds-explorations/src/internal/color-map.tsx
    packages/forge/forge-ui/src/components/UIKit/tokens.partial.tsx
)

DIFF_EXIT_CODE=0
git diff --name-only --exit-code -- "${GENERATED_PATHS[@]}" || DIFF_EXIT_CODE=$?

if [ "$BUILD_EXIT_CODE" != "0" ] || [ "$DIFF_EXIT_CODE" != "0" ]; then
    echo "ADS token codegen is out of date or failed. Run 'yarn build @atlaskit/tokens' and commit the generated changes."
fi

if [ "$BUILD_EXIT_CODE" != "0" ]; then
    exit "$BUILD_EXIT_CODE"
fi

exit "$DIFF_EXIT_CODE"
