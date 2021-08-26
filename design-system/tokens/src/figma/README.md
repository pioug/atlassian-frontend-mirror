# Figma Tooling

Here lies adhoc scripts created to support our tokens in Figma.

## Synchronize Figma tokens

This script will add/update/remove tokens into a Figma file.
There are currently a few manual steps to run before you can run the function.

1. Build `yarn build tokens`
1. Open your Figma file
1. Open dev tools console
1. Copy the code from `packages/design-system/tokens/dist/cjs/figma/synchronize-figma-tokens.js`
1. Paste the code

You are now ready to add tokens into Figma.

## Renaming tokens

In cases where you want to rename a token without having to manually relink them in the Figma UI, you can use the `rename-mapping` object found here `packages/design-system/tokens/src/tokens/rename-mapping.tsx`.
Please follow the instructions there.

The result should look something like this, with the rename map output as the second argument of `synchronizeFigmaTokens`.

```js
synchronizeFigmaTokens('AtlassianDark', {
  "Color/Blanket": {
    "value": "#03040421",
    "attributes": {
      "group": "paint"
    }
  },
},
// Rename map
{
  "Color/BackgroundBlanket": "Color/Blanket",
});
```

### Gotchas

The function has no notion of _renaming_.
If you rename a token in the schema the old token in Figma will be deleted,
and the new one will be freshly added.

The result of this means that the links in Figma will be _broken_ and you will need to fix them (point them to the new token in Figma).

### Running the function

Go into the `packages/design-system/tokens/dist/figma` folder and you will find a figma synchronizer for each theme.
Simply copy and paste into the dev console and the tokens will be synchronized.
