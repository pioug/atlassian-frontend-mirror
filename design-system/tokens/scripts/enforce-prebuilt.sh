#! /bin/bash

set -euxo pipefail

# Build package, check for unstaged changes, fail if uncommitted changes exist
yarn build @atlaskit/tokens

# Check for changes
git diff --name-only --exit-code packages/design-system/tokens/prebuilt/*
EXIT_CODE=$?

if [ "$EXIT_CODE" == "1" ]; then
    echo "Prebuilt @atlaskit/tokens changes are missing. Run yarn 'yarn build @atlaskit/tokens' and commit the changes."
    exit 1
fi
