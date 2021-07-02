# Style dictionary

[Style dictionary](https://amzn.github.io/style-dictionary) is used to transform our tokens from their raw form into multiple outputs.
You can find the tokens under the [../../src/tokens](../../src/tokens) folder.

Each folder is considered to be a "theme" and will be automatically picked up.

## Creating a new theme

All themes need to flow through the Design System Team,
ping !disturbed on [#help-design-system](https://atlassian.slack.com/archives/CFJ9DU39U) to start the conversation.

1. Create a new folder, it should be in the format of `brand-theme`, e.g. `trello-light`
1. Ensure the theme has the same shape as other themes, see [atlassian-dark](../../src/tokens/atlassian-dark) for an example
1. Using the same typing used in other themes set your theme using values from the palette
1. Run and fix tests `yarn test tokens --watch`
