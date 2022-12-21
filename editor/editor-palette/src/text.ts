// This import will be stripped on build
// eslint-disable-next-line import/no-extraneous-dependencies
import { token } from '@atlaskit/tokens';

/**
 * This takes an adf hex color and returns a matching text palette color.
 *
 * By providing a design token, this enables ADF content to be rendered in new themes such as dark mode.
 *
 * Example usage
 * ```tsx
 * const cssValue = hexToTextPaletteColor('#0747A6');
 * //     ^? const cssValue: string
 * <span style={{textColor: cssValue}} />
 * ```
 * The names of tokens can change over time, and the values of tokens will differ between themes.
 * The exact output of this function is an implementation detail and should only be used when rendering
 * content to the user, on a client with a matching major version of `@atlaskit/tokens`.
 * - **DO NOT**: store the output of these functions in any user-generated content or back-end.
 * - **DO**: store the ADF hex color, and use these utilities at render time to display the themed version of the color
 */

export function hexToEditorTextPaletteColor<HexColor extends string>(
  hexColor: HexColor,
): HexColor extends EditorTextPaletteKey
  ? /** If the hexColor is an template literal matching a hex color -- we know what string will be returned  */
    EditorTextPalette[HexColor]
  : string | undefined {
  // Ts ignore used to allow use of conditional return type
  // (preferencing better type on consumption over safety in implementation)
  // @ts-ignore
  return editorTextPalette[hexColor.toUpperCase()];
}
type EditorTextPalette = typeof editorTextPalette;
export type EditorTextPaletteKey = keyof EditorTextPalette;

// Colors taken from
// https://hello.atlassian.net/wiki/spaces/DST/pages/1790979421/DSTRFC-002+-+Shifting+Editor+s+color+palette+to+design+tokens
// values are asserted to improve generated type declarations
export const editorTextPalette = {
  // blue
  /** blue - light */
  ['#B3D4FF']: token(
    'color.background.accent.blue.subtler',
    '#B3D4FF',
  ) as 'var(--ds-background-accent-blue-subtler, #B3D4FF)', // source for hex code was legacy token B75
  /** blue - medium */
  ['#4C9AFF']: token(
    'color.icon.accent.blue',
    '#4C9AFF',
  ) as 'var(--ds-icon-accent-blue, #4C9AFF)', // source for hex code was legacy token B100
  /** blue - strong */
  ['#0747A6']: token(
    'color.text.accent.blue',
    '#0747A6',
  ) as 'var(--ds-text-accent-blue, #0747A6)', // source for hex code was legacy token B500

  // teal
  /** teal - light */
  ['#B3F5FF']: token(
    'color.background.accent.teal.subtler',
    '#B3F5FF',
  ) as 'var(--ds-background-accent-teal-subtler, #B3F5FF)', // source for hex code was legacy token T75
  /** teal - medium */
  ['#00B8D9']: token(
    'color.icon.accent.teal',
    '#00B8D9',
  ) as 'var(--ds-icon-accent-teal, #00B8D9)', // source for hex code was legacy token T300
  /** teal - strong */
  ['#008DA6']: token(
    'color.text.accent.teal',
    '#008DA6',
  ) as 'var(--ds-text-accent-teal, #008DA6)', // source for hex code was legacy token T500

  // green
  /** green - light */
  ['#ABF5D1']: token(
    'color.background.accent.green.subtler',
    '#ABF5D1',
  ) as 'var(--ds-background-accent-green-subtler, #ABF5D1)', // source for hex code was legacy token G75
  /** green - medium */
  ['#36B37E']: token(
    'color.icon.accent.green',
    '#36B37E',
  ) as 'var(--ds-icon-accent-green, #36B37E)', // source for hex code was legacy token G300
  /** green - strong */
  ['#006644']: token(
    'color.text.accent.green',
    '#006644',
  ) as 'var(--ds-text-accent-green, #006644)', // source for hex code was legacy token G500

  // yellowOrange
  /** yellowOrange - light */
  ['#FFF0B3']: token(
    'color.background.accent.yellow.subtler',
    '#FFF0B3',
  ) as 'var(--ds-background-accent-yellow-subtler, #FFF0B3)', // source for hex code was legacy token Y75
  /** yellowOrange - medium */
  ['#FFC400']: token(
    'color.background.accent.orange.subtle',
    '#FFC400',
  ) as 'var(--ds-background-accent-orange-subtle, #FFC400)', // source for hex code was legacy token Y200
  /** yellowOrange - strong */
  ['#FF991F']: token(
    'color.icon.accent.orange',
    '#FF991F',
  ) as 'var(--ds-icon-accent-orange, #FF991F)', // source for hex code was legacy token Y400

  // red
  /** red - light */
  ['#FFBDAD']: token(
    'color.background.accent.red.subtler',
    '#FFBDAD',
  ) as 'var(--ds-background-accent-red-subtler, #FFBDAD)', // source for hex code was legacy token R75
  /** red - medium */
  ['#FF5630']: token(
    'color.icon.accent.red',
    '#FF5630',
  ) as 'var(--ds-icon-accent-red, #FF5630)', // source for hex code was legacy token R300
  /** red - strong */
  ['#BF2600']: token(
    'color.text.accent.red',
    '#BF2600',
  ) as 'var(--ds-text-accent-red, #BF2600)', // source for hex code was legacy token R500

  // purple
  /** purple - light */
  ['#EAE6FF']: token(
    'color.background.accent.purple.subtler',
    '#EAE6FF',
  ) as 'var(--ds-background-accent-purple-subtler, #EAE6FF)', // source for hex code was legacy token P50
  /** purple - medium */
  ['#6554C0']: token(
    'color.icon.accent.purple',
    '#6554C0',
  ) as 'var(--ds-icon-accent-purple, #6554C0)', // source for hex code was legacy token P300
  /** purple - strong */
  ['#403294']: token(
    'color.text.accent.purple',
    '#403294',
  ) as 'var(--ds-text-accent-purple, #403294)', // source for hex code was legacy token P500

  // whiteGray
  /** whiteGray - light */
  ['#FFFFFF']: token(
    'color.text.inverse',
    '#FFFFFF',
  ) as 'var(--ds-text-inverse, #FFFFFF)', // source for hex code was legacy token N0
  /** whiteGray - medium */
  ['#97A0AF']: token(
    'color.icon.accent.gray',
    '#97A0AF',
  ) as 'var(--ds-icon-accent-gray, #97A0AF)', // source for hex code was legacy token N80
  /** whiteGray - strong */
  ['#172B4D']: token('color.text', '#172B4D') as 'var(--ds-text, #172B4D)', // source for hex code was legacy token N800
};
