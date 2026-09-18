# TownsquareEmojiProvider

Townsquare emoji provider

## Usage

`import { getEmojiProviderForCloudId } from '@atlaskit/townsquare-emoji-provider/for-cloud-id';`

The package barrel (`@atlaskit/townsquare-emoji-provider`) also exports `emojiResource` and
`emojiProvider` for the standard emoji set. Those are created, and the standard set fetched, as soon
as the barrel is imported. If you only need per-site providers, import from the `for-cloud-id`
entry point instead so nothing runs at import time. Both share the same per-cloudId resource cache.

Detailed docs and example usage can be found
[here](https://atlaskit.atlassian.com/packages/townsquare/townsquare-emoji-provider).
