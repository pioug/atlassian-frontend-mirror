/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * This file is intended to help automate renaming of tokens.
 *
 * 1. Mark the old token's 'state' as deprecated
 * 2. Add a 'rename' attribute to the token with the value 'my.new.token'
 * 3. Create a new token matching the token above: 'my.new.token'
 * 4. Run 'yarn build tokens' to have you changes reflected in this map
 * 5. ESLint and other tools will now use this to automate replacing tokens
 *
 * These changes will then be picked up by our tooling which will attempt to
 * migrate as many of these renames as possible.
 *
 * @codegen <<SignedSource::3b33fd6cb94d4a40b7b5790bebd50f60>>
 * @codegenCommand yarn build tokens
 */
import tokens from './token-names';

type Token = keyof typeof tokens | string;
type RenameMap = {
  path: string;
  state: 'deprecated' | 'deleted';
  replacement: Token;
}

const renameMapper: RenameMap[] = [
  {
    "path": "color.text.highEmphasis",
    "state": "deleted",
    "replacement": "color.text.[default]"
  },
  {
    "path": "color.text.link.pressed",
    "state": "deleted",
    "replacement": "color.link.pressed"
  },
  {
    "path": "color.text.link.resting",
    "state": "deleted",
    "replacement": "color.link.[default]"
  },
  {
    "path": "color.text.lowEmphasis",
    "state": "deleted",
    "replacement": "color.text.subtlest"
  },
  {
    "path": "color.text.mediumEmphasis",
    "state": "deleted",
    "replacement": "color.text.subtle"
  },
  {
    "path": "color.text.onBold",
    "state": "deleted",
    "replacement": "color.text.inverse"
  },
  {
    "path": "color.text.onBoldWarning",
    "state": "deleted",
    "replacement": "color.text.warning.inverse"
  },
  {
    "path": "color.border.focus",
    "state": "deleted",
    "replacement": "color.border.focused"
  },
  {
    "path": "color.border.neutral",
    "state": "deleted",
    "replacement": "color.border.[default]"
  },
  {
    "path": "color.background.accent.blue.[default]",
    "state": "deleted",
    "replacement": "color.background.accent.blue.subtler"
  },
  {
    "path": "color.background.accent.blue.bold",
    "state": "deleted",
    "replacement": "color.background.accent.blue.subtle"
  },
  {
    "path": "color.background.accent.red.[default]",
    "state": "deleted",
    "replacement": "color.background.accent.red.subtler"
  },
  {
    "path": "color.background.accent.red.bold",
    "state": "deleted",
    "replacement": "color.background.accent.red.subtle"
  },
  {
    "path": "color.background.accent.orange.[default]",
    "state": "deleted",
    "replacement": "color.background.accent.orange.subtler"
  },
  {
    "path": "color.background.accent.orange.bold",
    "state": "deleted",
    "replacement": "color.background.accent.orange.subtle"
  },
  {
    "path": "color.background.accent.yellow.[default]",
    "state": "deleted",
    "replacement": "color.background.accent.yellow.subtler"
  },
  {
    "path": "color.background.accent.yellow.bold",
    "state": "deleted",
    "replacement": "color.background.accent.yellow.subtle"
  },
  {
    "path": "color.background.accent.green.[default]",
    "state": "deleted",
    "replacement": "color.background.accent.green.subtler"
  },
  {
    "path": "color.background.accent.green.bold",
    "state": "deleted",
    "replacement": "color.background.accent.green.subtle"
  },
  {
    "path": "color.background.accent.teal.[default]",
    "state": "deleted",
    "replacement": "color.background.accent.teal.subtler"
  },
  {
    "path": "color.background.accent.teal.bold",
    "state": "deleted",
    "replacement": "color.background.accent.teal.subtle"
  },
  {
    "path": "color.background.accent.purple.[default]",
    "state": "deleted",
    "replacement": "color.background.accent.purple.subtler"
  },
  {
    "path": "color.background.accent.purple.bold",
    "state": "deleted",
    "replacement": "color.background.accent.purple.subtle"
  },
  {
    "path": "color.background.accent.magenta.[default]",
    "state": "deleted",
    "replacement": "color.background.accent.magenta.subtler"
  },
  {
    "path": "color.background.accent.magenta.bold",
    "state": "deleted",
    "replacement": "color.background.accent.magenta.subtle"
  },
  {
    "path": "color.background.inverse.[default]",
    "state": "deleted",
    "replacement": "color.background.inverse.subtle.[default]"
  },
  {
    "path": "color.background.brand.[default].[default]",
    "state": "deleted",
    "replacement": "color.background.selected.[default].[default]"
  },
  {
    "path": "color.background.brand.[default].hovered",
    "state": "deleted",
    "replacement": "color.background.selected.[default].hovered"
  },
  {
    "path": "color.background.brand.[default].pressed",
    "state": "deleted",
    "replacement": "color.background.selected.[default].pressed"
  },
  {
    "path": "color.background.selected.resting",
    "state": "deleted",
    "replacement": "color.background.selected.[default].[default]"
  },
  {
    "path": "color.background.selected.hover",
    "state": "deleted",
    "replacement": "color.background.selected.[default].hovered"
  },
  {
    "path": "color.background.blanket",
    "state": "deleted",
    "replacement": "color.blanket.[default]"
  },
  {
    "path": "color.background.boldBrand.hover",
    "state": "deleted",
    "replacement": "color.background.brand.bold.hovered"
  },
  {
    "path": "color.background.boldBrand.pressed",
    "state": "deleted",
    "replacement": "color.background.brand.bold.pressed"
  },
  {
    "path": "color.background.boldBrand.resting",
    "state": "deleted",
    "replacement": "color.background.brand.bold.[default]"
  },
  {
    "path": "color.background.boldDanger.hover",
    "state": "deleted",
    "replacement": "color.background.danger.bold.hovered"
  },
  {
    "path": "color.background.boldDanger.pressed",
    "state": "deleted",
    "replacement": "color.background.danger.bold.pressed"
  },
  {
    "path": "color.background.boldDanger.resting",
    "state": "deleted",
    "replacement": "color.background.danger.bold.[default]"
  },
  {
    "path": "color.background.boldDiscovery.hover",
    "state": "deleted",
    "replacement": "color.background.discovery.bold.hovered"
  },
  {
    "path": "color.background.boldDiscovery.pressed",
    "state": "deleted",
    "replacement": "color.background.discovery.bold.pressed"
  },
  {
    "path": "color.background.boldDiscovery.resting",
    "state": "deleted",
    "replacement": "color.background.discovery.bold.[default]"
  },
  {
    "path": "color.background.boldNeutral.hover",
    "state": "deleted",
    "replacement": "color.background.neutral.bold.hovered"
  },
  {
    "path": "color.background.boldNeutral.pressed",
    "state": "deleted",
    "replacement": "color.background.neutral.bold.pressed"
  },
  {
    "path": "color.background.boldNeutral.resting",
    "state": "deleted",
    "replacement": "color.background.neutral.bold.[default]"
  },
  {
    "path": "color.background.boldSuccess.hover",
    "state": "deleted",
    "replacement": "color.background.success.bold.hovered"
  },
  {
    "path": "color.background.boldSuccess.pressed",
    "state": "deleted",
    "replacement": "color.background.success.bold.pressed"
  },
  {
    "path": "color.background.boldSuccess.resting",
    "state": "deleted",
    "replacement": "color.background.success.bold.[default]"
  },
  {
    "path": "color.background.boldWarning.hover",
    "state": "deleted",
    "replacement": "color.background.warning.bold.hovered"
  },
  {
    "path": "color.background.boldWarning.pressed",
    "state": "deleted",
    "replacement": "color.background.warning.bold.pressed"
  },
  {
    "path": "color.background.boldWarning.resting",
    "state": "deleted",
    "replacement": "color.background.warning.bold.[default]"
  },
  {
    "path": "color.background.card",
    "state": "deleted",
    "replacement": "elevation.surface.raised"
  },
  {
    "path": "color.background.default",
    "state": "deleted",
    "replacement": "elevation.surface.[default]"
  },
  {
    "path": "color.background.overlay",
    "state": "deleted",
    "replacement": "elevation.surface.overlay"
  },
  {
    "path": "color.background.subtleBorderedNeutral.pressed",
    "state": "deleted",
    "replacement": "color.background.input.pressed"
  },
  {
    "path": "color.background.subtleBorderedNeutral.resting",
    "state": "deleted",
    "replacement": "color.background.input.[default]"
  },
  {
    "path": "color.background.subtleBrand.hover",
    "state": "deleted",
    "replacement": "color.background.selected.[default].hovered"
  },
  {
    "path": "color.background.subtleBrand.pressed",
    "state": "deleted",
    "replacement": "color.background.selected.[default].pressed"
  },
  {
    "path": "color.background.subtleBrand.resting",
    "state": "deleted",
    "replacement": "color.background.selected.[default].[default]"
  },
  {
    "path": "color.background.subtleDanger.hover",
    "state": "deleted",
    "replacement": "color.background.danger.[default].hovered"
  },
  {
    "path": "color.background.subtleDanger.pressed",
    "state": "deleted",
    "replacement": "color.background.danger.[default].pressed"
  },
  {
    "path": "color.background.subtleDanger.resting",
    "state": "deleted",
    "replacement": "color.background.danger.[default].[default]"
  },
  {
    "path": "color.background.subtleDiscovery.hover",
    "state": "deleted",
    "replacement": "color.background.discovery.[default].hovered"
  },
  {
    "path": "color.background.subtleDiscovery.pressed",
    "state": "deleted",
    "replacement": "color.background.discovery.[default].pressed"
  },
  {
    "path": "color.background.subtleDiscovery.resting",
    "state": "deleted",
    "replacement": "color.background.discovery.[default].[default]"
  },
  {
    "path": "color.background.subtleNeutral.hover",
    "state": "deleted",
    "replacement": "color.background.neutral.[default].hovered"
  },
  {
    "path": "color.background.subtleNeutral.pressed",
    "state": "deleted",
    "replacement": "color.background.neutral.[default].pressed"
  },
  {
    "path": "color.background.subtleNeutral.resting",
    "state": "deleted",
    "replacement": "color.background.neutral.[default].[default]"
  },
  {
    "path": "color.background.subtleSuccess.hover",
    "state": "deleted",
    "replacement": "color.background.success.[default].hovered"
  },
  {
    "path": "color.background.subtleSuccess.pressed",
    "state": "deleted",
    "replacement": "color.background.success.[default].pressed"
  },
  {
    "path": "color.background.subtleSuccess.resting",
    "state": "deleted",
    "replacement": "color.background.success.[default].[default]"
  },
  {
    "path": "color.background.subtleWarning.hover",
    "state": "deleted",
    "replacement": "color.background.warning.[default].hovered"
  },
  {
    "path": "color.background.subtleWarning.pressed",
    "state": "deleted",
    "replacement": "color.background.warning.[default].pressed"
  },
  {
    "path": "color.background.subtleWarning.resting",
    "state": "deleted",
    "replacement": "color.background.warning.[default].[default]"
  },
  {
    "path": "color.background.sunken",
    "state": "deleted",
    "replacement": "elevation.surface.sunken"
  },
  {
    "path": "color.background.transparentNeutral.hover",
    "state": "deleted",
    "replacement": "color.background.neutral.subtle.hovered"
  },
  {
    "path": "color.background.transparentNeutral.pressed",
    "state": "deleted",
    "replacement": "color.background.neutral.subtle.pressed"
  },
  {
    "path": "color.interaction.inverse.hovered",
    "state": "deprecated",
    "replacement": "color.background.inverse.subtle.hovered"
  },
  {
    "path": "color.interaction.inverse.pressed",
    "state": "deprecated",
    "replacement": "color.background.inverse.subtle.pressed"
  },
  {
    "path": "color.accent.boldBlue",
    "state": "deleted",
    "replacement": "color.background.accent.blue.bolder"
  },
  {
    "path": "color.accent.boldGreen",
    "state": "deleted",
    "replacement": "color.background.accent.green.bolder"
  },
  {
    "path": "color.accent.boldOrange",
    "state": "deleted",
    "replacement": "color.background.accent.orange.bolder"
  },
  {
    "path": "color.accent.boldPurple",
    "state": "deleted",
    "replacement": "color.background.accent.purple.bolder"
  },
  {
    "path": "color.accent.boldRed",
    "state": "deleted",
    "replacement": "color.background.accent.red.bolder"
  },
  {
    "path": "color.accent.boldTeal",
    "state": "deleted",
    "replacement": "color.background.accent.teal.bolder"
  },
  {
    "path": "color.accent.subtleBlue",
    "state": "deleted",
    "replacement": "color.background.accent.blue.subtler"
  },
  {
    "path": "color.accent.subtleGreen",
    "state": "deleted",
    "replacement": "color.background.accent.green.subtler"
  },
  {
    "path": "color.accent.subtleMagenta",
    "state": "deleted",
    "replacement": "color.background.accent.magenta.subtler"
  },
  {
    "path": "color.accent.subtleOrange",
    "state": "deleted",
    "replacement": "color.background.accent.orange.subtler"
  },
  {
    "path": "color.accent.subtlePurple",
    "state": "deleted",
    "replacement": "color.background.accent.purple.subtler"
  },
  {
    "path": "color.accent.subtleRed",
    "state": "deleted",
    "replacement": "color.background.accent.red.subtler"
  },
  {
    "path": "color.accent.subtleTeal",
    "state": "deleted",
    "replacement": "color.background.accent.teal.subtler"
  },
  {
    "path": "color.iconBorder.brand",
    "state": "deleted",
    "replacement": "color.icon.brand"
  },
  {
    "path": "color.iconBorder.danger",
    "state": "deleted",
    "replacement": "color.icon.danger"
  },
  {
    "path": "color.iconBorder.discovery",
    "state": "deleted",
    "replacement": "color.icon.discovery"
  },
  {
    "path": "color.iconBorder.success",
    "state": "deleted",
    "replacement": "color.icon.success"
  },
  {
    "path": "color.iconBorder.warning",
    "state": "deleted",
    "replacement": "color.icon.warning.[default]"
  },
  {
    "path": "color.overlay.hover",
    "state": "deleted",
    "replacement": "color.interaction.hovered"
  },
  {
    "path": "color.overlay.pressed",
    "state": "deleted",
    "replacement": "color.interaction.pressed"
  },
  {
    "path": "shadow.card",
    "state": "deleted",
    "replacement": "elevation.shadow.raised"
  },
  {
    "path": "shadow.overlay",
    "state": "deleted",
    "replacement": "elevation.shadow.overlay"
  }
];

export default renameMapper;
