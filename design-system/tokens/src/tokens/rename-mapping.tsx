import tokens from './token-names';

type Token = keyof typeof tokens | string;
type RenameMapping = Partial<Record<Token, Token>>;

/**
 * This file is intended to help create automation on top of renaming of tokens.
 *
 * When renaming tokens, you must first update the token at its source of truth.
 * For example: packages/design-system/tokens/src/tokens/atlassian-dark/color/accent.tsx
 *
 * That token might go from `color.accentBlueSubtle` to `color.accentBluePrimary`
 * which is totally acceptable on its own but for some platform targets, such as Figma,
 * we need to provide additional metadata to tell figma that this is a rename and not a removal/addition.
 *
 * To create a rename mapping:
 *
 * 1. Get the fully object path, separated by a '.', i.e. color.background.primary
 * 2. Create a key value pair to the renameMapping below, with key representing the old token and value representing the new token.
 * 3. Update the token at its source of truth
 * 4. run `yarn build tokens`
 * 5. The artifact containing the automation should now be available in the `/dist` folder. i.e. packages/design-system/tokens/dist/figma/atlassian-light/sync-figma-tokens.js
 * 6. After building make sure to remove the mapping from this file before checking it in
 */
const renameMapping: RenameMapping = {};

export default renameMapping;
