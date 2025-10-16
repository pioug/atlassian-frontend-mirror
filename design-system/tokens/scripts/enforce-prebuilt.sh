#! /bin/bash

set -uxo pipefail

# Build package, check for unstaged changes, fail if uncommitted changes exist
yarn build @atlaskit/tokens

# Check for changes
git diff --name-only --exit-code packages/design-system/tokens/prebuilt/*
EXIT_CODE=$?

if [ "$EXIT_CODE" != "0" ]; then
    echo "Prebuilt @atlaskit/tokens changes returned an exit code of ${EXIT_CODE} as the precommit hook was not ran. Run yarn 'yarn build @atlaskit/tokens' and commit the changes."
fi

exit $EXIT_CODE
