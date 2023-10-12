# Style dictionary

[Style dictionary](https://amzn.github.io/style-dictionary) is used to transform our tokens from their raw form into multiple outputs.
You can find the tokens schema under the [../../schema/tokens](../../schema/tokens) folder, with the metadata for each token.

Themes can be found in the [../../schema/themes](../../schema/themes) folder. Each folder is considered to be a "theme" and will be automatically picked up.

## Creating a new theme

All themes need to flow through the Design System Team,
ping !disturbed on [#help-design-system](https://atlassian.slack.com/archives/CFJ9DU39U) to start the conversation.

1. Create a new folder, it should be in the format of `brand-theme`, e.g. `trello-light`
1. Ensure the theme has the same shape as other themes, see [atlassian-dark](../../schema/themes/atlassian-dark) for an example
1. Using the same typing used in other themes set your theme using values from the palette
1. Run and fix tests `yarn test tokens --watch`

## Adding new token to existing set

1. Add a new property to the respective theme file, for example: `packages/design-system/tokens/schema/themes/atlassian-shape`
1. Update the types for the respective `*TokenSchema`
1. Add a token with meta data to where it lives in the default theme (your types will be complaining from the previous step)
1. run `yarn build tokens`
1. Profit 💰
