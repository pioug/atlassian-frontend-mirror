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
const renameMapping: RenameMapping = {
  'color.accentBlueSubtle': 'color.accent.blueSubtle',
  'color.accentGreenSubtle': 'color.accent.greenSubtle',
  'color.accentMagentaSubtle': 'color.accent.magentaSubtle',
  'color.accentOrangeSubtle': 'color.accent.orangeSubtle',
  'color.accentPurpleSubtle': 'color.accent.purpleSubtle',
  'color.accentRedSubtle': 'color.accent.redSubtle',
  'color.accentTealSubtle': 'color.accent.tealSubtle',
  'color.backgroundSunken': 'color.background.sunken',
  'color.backgroundDefault': 'color.background.default',
  'color.backgroundCard': 'color.background.card',
  'color.backgroundOverlay': 'color.background.overlay',
  'color.backgroundSelected': 'color.background.selected',
  'color.backgroundBlanket': 'color.background.blanket',
  'color.backgroundDisabled': 'color.background.disabled',
  'color.backgroundBoldBrand.resting': 'color.background.boldBrand.resting',
  'color.backgroundBoldBrand.hover': 'color.background.boldBrand.hover',
  'color.backgroundBoldBrand.pressed': 'color.background.boldBrand.pressed',
  'color.backgroundSubtleBrand.resting': 'color.background.subtleBrand.resting',
  'color.backgroundSubtleBrand.hover': 'color.background.subtleBrand.hover',
  'color.backgroundSubtleBrand.pressed': 'color.background.subtleBrand.pressed',
  'color.backgroundBoldDanger.resting': 'color.background.boldDanger.resting',
  'color.backgroundBoldDanger.hover': 'color.background.boldDanger.hover',
  'color.backgroundBoldDanger.pressed': 'color.background.boldDanger.pressed',
  'color.backgroundSubtleDanger.resting':
    'color.background.subtleDanger.resting',
  'color.backgroundSubtleDanger.hover': 'color.background.subtleDanger.hover',
  'color.backgroundSubtleDanger.pressed':
    'color.background.subtleDanger.pressed',
  'color.backgroundBoldWarning.resting': 'color.background.boldWarning.resting',
  'color.backgroundBoldWarning.hover': 'color.background.boldWarning.hover',
  'color.backgroundBoldWarning.pressed': 'color.background.boldWarning.pressed',
  'color.backgroundSubtleWarning.resting':
    'color.background.subtleWarning.resting',
  'color.backgroundSubtleWarning.hover': 'color.background.subtleWarning.hover',
  'color.backgroundSubtleWarning.pressed':
    'color.background.subtleWarning.pressed',
  'color.backgroundBoldSuccess.resting': 'color.background.boldSuccess.resting',
  'color.backgroundBoldSuccess.hover': 'color.background.boldSuccess.hover',
  'color.backgroundBoldSuccess.pressed': 'color.background.boldSuccess.pressed',
  'color.backgroundSubtleSuccess.resting':
    'color.background.subtleSuccess.resting',
  'color.backgroundSubtleSuccess.hover': 'color.background.subtleSuccess.hover',
  'color.backgroundSubtleSuccess.pressed':
    'color.background.subtleSuccess.pressed',
  'color.backgroundBoldDiscovery.resting':
    'color.background.boldDiscovery.resting',
  'color.backgroundBoldDiscovery.hover': 'color.background.boldDiscovery.hover',
  'color.backgroundBoldDiscovery.pressed':
    'color.background.boldDiscovery.pressed',
  'color.backgroundSubtleDiscovery.resting':
    'color.background.subtleDiscovery.resting',
  'color.backgroundSubtleDiscovery.hover':
    'color.background.subtleDiscovery.hover',
  'color.backgroundSubtleDiscovery.pressed':
    'color.background.subtleDiscovery.pressed',
  'color.backgroundBoldNeutral.resting': 'color.background.boldNeutral.resting',
  'color.backgroundBoldNeutral.hover': 'color.background.boldNeutral.hover',
  'color.backgroundBoldNeutral.pressed': 'color.background.boldNeutral.pressed',
  'color.backgroundTransparentNeutral.hover':
    'color.background.transparentNeutral.hover',
  'color.backgroundTransparentNeutral.pressed':
    'color.background.transparentNeutral.pressed',
  'color.backgroundSubtleNeutral.resting':
    'color.background.subtleNeutral.resting',
  'color.backgroundSubtleNeutral.hover': 'color.background.subtleNeutral.hover',
  'color.backgroundSubtleNeutral.pressed':
    'color.background.subtleNeutral.pressed',
  'color.backgroundSubtleBorderedNeutral.resting':
    'color.background.subtleBorderedNeutral.resting',
  'color.backgroundSubtleBorderedNeutral.pressed':
    'color.background.subtleBorderedNeutral.pressed',
  'color.borderFocus': 'color.border.focus',
  'color.borderTextSelected': 'color.text.selected',
  'color.borderNeutral': 'color.border.neutral',
  'color.borderDisabled': 'color.border.disabled',
  'color.borderOverlay': 'color.border.overlay',
  'color.iconBorderBrand': 'color.iconBorder.brand',
  'color.iconBorderDanger': 'color.iconBorder.danger',
  'color.iconBorderWarning': 'color.iconBorder.warning',
  'color.iconBorderSuccess': 'color.iconBorder.success',
  'color.iconBorderDiscovery': 'color.iconBorder.discovery',
  'color.textHighEmphasis': 'color.text.highEmphasis',
  'color.textMediumEmphasis': 'color.text.mediumEmphasis',
  'color.textLowEmphasis': 'color.text.lowEmphasis',
  'color.textOnBold': 'color.text.onBold',
  'color.textOnBoldWarning': 'color.text.onBoldWarning',
  'color.textLink.resting': 'color.text.link.resting',
  'color.textLink.hover': 'color.text.link.hover',
  'color.textLink.pressed': 'color.text.link.pressed',
  'color.textBrand': 'color.text.brand',
  'color.textWarning': 'color.text.warning',
  'color.textDanger': 'color.text.danger',
  'color.textSuccess': 'color.text.success',
  'color.textDiscovery': 'color.text.discovery',
  'color.textDisabled': 'color.text.disabled',
};

export default renameMapping;
