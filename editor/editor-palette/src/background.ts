// This import will be stripped on build
// eslint-disable-next-line import/no-extraneous-dependencies
import { token } from '@atlaskit/tokens';

/**
 * This takes an adf hex color and returns a matching background palette
 * color.
 *
 * By providing a design token, this enables ADF content to be rendered in new themes such as dark mode.
 *
 * Example usage
 * ```tsx
 * const cssValue = hexToBackgroundPaletteColor('#FFFFFF');
 * //     ^? const cssValue: string
 * <div style={{backgroundColor: cssValue}} />
 * ```
 *
 * The names of tokens can change over time, and the values of tokens will differ between themes.
 * The exact output of this function is an implementation detail and should only be used when rendering
 * content to the user, on a client with a matching major version of `@atlaskit/tokens`.
 * - **DO NOT**: store the output of these functions in any user-generated content or back-end.
 * - **DO**: store the ADF hex color, and use these utilities at render time to display the themed version of the color
 */
export function hexToEditorBackgroundPaletteColor<HexColor extends string>(
  hexColor: HexColor,
): HexColor extends EditorBackgroundPaletteKey
  ? /** If the hexColor is an template literal matching a hex color -- we know what string will be returned  */
    EditorBackgroundPalette[HexColor]['token']
  : string | undefined {
  // Ts ignore used to allow use of conditional return type
  // (preferencing better type on consumption over safety in implementation)
  // @ts-ignore
  const tokenData = editorBackgroundPalette[hexColor.toUpperCase()];
  return tokenData ? tokenData.token : undefined;
}

export function hexToEditorBackgroundPaletteColorTokenName<
  HexColor extends string,
>(
  hexColor: HexColor,
): HexColor extends EditorBackgroundPaletteKey
  ? /** If the hexColor is an template literal matching a hex color -- we know what string will be returned  */
    EditorBackgroundPalette[HexColor]['tokenName']
  : EditorBackgroundPaletteTokenNames | undefined {
  // Ts ignore used to allow use of conditional return type
  // (preferencing better type on consumption over safety in implementation)
  // @ts-ignore
  const tokenData = editorBackgroundPalette[hexColor.toUpperCase()];
  return tokenData ? tokenData.tokenName : undefined;
}
type EditorBackgroundPalette = typeof editorBackgroundPalette;
export type EditorBackgroundPaletteKey = keyof EditorBackgroundPalette;

// Colors taken from
// https://hello.atlassian.net/wiki/spaces/DST/pages/1790979421/DSTRFC-002+-+Shifting+Editor+s+color+palette+to+design+tokens

// values are asserted to improve generated type declarations
// Modified structure as having tokenName, token
//  and possibly editorColorName in future will make it
//  simpler to link everything together.
export const editorBackgroundPalette = {
  // blue
  /** blue - light */
  ['#DEEBFF']: {
    tokenName: 'color.background.accent.blue.subtlest' as const,
    token: token(
      'color.background.accent.blue.subtlest',
      '#DEEBFF',
    ) as 'var(--ds-background-accent-blue-subtlest, #DEEBFF)',
  }, // source for hex code was legacy token B50
  /** blue - medium */
  ['#B3D4FF']: {
    tokenName: 'color.background.accent.blue.subtler' as const,
    token: token(
      'color.background.accent.blue.subtler',
      '#B3D4FF',
    ) as 'var(--ds-background-accent-blue-subtler, #B3D4FF)',
  }, // source for hex code was legacy token B75
  /** blue - strong */
  ['#4C9AFF']: {
    tokenName: 'color.background.accent.blue.subtle' as const,
    token: token(
      'color.background.accent.blue.subtle',
      '#4C9AFF',
    ) as 'var(--ds-background-accent-blue-subtle, #4C9AFF)',
  }, // source for hex code was legacy token B100

  // teal
  /** teal - light */
  ['#E6FCFF']: {
    tokenName: 'color.background.accent.teal.subtlest' as const,
    token: token(
      'color.background.accent.teal.subtlest',
      '#E6FCFF',
    ) as 'var(--ds-background-accent-teal-subtlest, #E6FCFF)', // source for hex code was legacy token T50,
  },
  /** teal - medium */
  ['#B3F5FF']: {
    tokenName: 'color.background.accent.teal.subtler' as const,
    token: token(
      'color.background.accent.teal.subtler',
      '#B3F5FF',
    ) as 'var(--ds-background-accent-teal-subtler, #B3F5FF)', // source for hex code was legacy token T75,
  },
  /** teal - strong */
  ['#79E2F2']: {
    tokenName: 'color.background.accent.teal.subtle' as const,
    token: token(
      'color.background.accent.teal.subtle',
      '#79E2F2',
    ) as 'var(--ds-background-accent-teal-subtle, #79E2F2)', // source for hex code was legacy token T100,
  },

  // green
  /** green - light */
  ['#E3FCEF']: {
    tokenName: 'color.background.accent.green.subtlest' as const,
    token: token(
      'color.background.accent.green.subtlest',
      '#E3FCEF',
    ) as 'var(--ds-background-accent-green-subtlest, #E3FCEF)', // source for hex code was legacy token G50,
  },
  /** green - medium */
  ['#ABF5D1']: {
    tokenName: 'color.background.accent.green.subtler' as const,
    token: token(
      'color.background.accent.green.subtler',
      '#ABF5D1',
    ) as 'var(--ds-background-accent-green-subtler, #ABF5D1)', // source for hex code was legacy token G75,
  },
  /** green - strong */
  ['#57D9A3']: {
    tokenName: 'color.background.accent.green.subtle' as const,
    token: token(
      'color.background.accent.green.subtle',
      '#57D9A3',
    ) as 'var(--ds-background-accent-green-subtle, #57D9A3)', // source for hex code was legacy token G200,
  },

  // yellowOrange
  /** yellowOrange - light */
  ['#FFFAE6']: {
    tokenName: 'color.background.accent.yellow.subtlest' as const,
    token: token(
      'color.background.accent.yellow.subtlest',
      '#FFFAE6',
    ) as 'var(--ds-background-accent-yellow-subtlest, #FFFAE6)', // source for hex code was legacy token Y50,
  },
  /** yellowOrange - medium */
  ['#FFF0B3']: {
    tokenName: 'color.background.accent.yellow.subtler' as const,
    token: token(
      'color.background.accent.yellow.subtler',
      '#FFF0B3',
    ) as 'var(--ds-background-accent-yellow-subtler, #FFF0B3)', // source for hex code was legacy token Y75,
  },
  /** yellowOrange - strong */
  ['#FFC400']: {
    tokenName: 'color.background.accent.orange.subtle' as const,
    token: token(
      'color.background.accent.orange.subtle',
      '#FFC400',
    ) as 'var(--ds-background-accent-orange-subtle, #FFC400)', // source for hex code was legacy token Y200,
  },

  // red
  /** red - light */
  ['#FFEBE6']: {
    tokenName: 'color.background.accent.red.subtlest' as const,
    token: token(
      'color.background.accent.red.subtlest',
      '#FFEBE6',
    ) as 'var(--ds-background-accent-red-subtlest, #FFEBE6)', // source for hex code was legacy token R50,
  },
  /** red - medium */
  ['#FFBDAD']: {
    tokenName: 'color.background.accent.red.subtler' as const,
    token: token(
      'color.background.accent.red.subtler',
      '#FFBDAD',
    ) as 'var(--ds-background-accent-red-subtler, #FFBDAD)', // source for hex code was legacy token R75,
  },
  /** red - strong */
  ['#FF8F73']: {
    tokenName: 'color.background.accent.red.subtle' as const,
    token: token(
      'color.background.accent.red.subtle',
      '#FF8F73',
    ) as 'var(--ds-background-accent-red-subtle, #FF8F73)', // source for hex code was legacy token R100,
  },

  // purple
  /** purple - light */
  ['#EAE6FF']: {
    tokenName: 'color.background.accent.purple.subtlest' as const,
    token: token(
      'color.background.accent.purple.subtlest',
      '#EAE6FF',
    ) as 'var(--ds-background-accent-purple-subtlest, #EAE6FF)', // source for hex code was legacy token P50,
  },
  /** purple - medium */
  ['#C0B6F2']: {
    tokenName: 'color.background.accent.purple.subtler' as const,
    token: token(
      'color.background.accent.purple.subtler',
      '#C0B6F2',
    ) as 'var(--ds-background-accent-purple-subtler, #C0B6F2)', // source for hex code was legacy token P75,
  },
  /** purple - strong */
  ['#998DD9']: {
    tokenName: 'color.background.accent.purple.subtle' as const,
    token: token(
      'color.background.accent.purple.subtle',
      '#998DD9',
    ) as 'var(--ds-background-accent-purple-subtle, #998DD9)', // source for hex code was legacy token P100,
  },

  // whiteGray
  /** whiteGray - light */
  ['#FFFFFF']: {
    tokenName: 'elevation.surface' as const,
    token: token(
      'elevation.surface',
      '#FFFFFF',
    ) as 'var(--ds-surface, #FFFFFF)', // source for hex code was legacy token N0,
  },
  /** whiteGray - medium */
  ['#F4F5F7']: {
    tokenName: 'color.background.accent.gray.subtlest' as const,
    token: token(
      'color.background.accent.gray.subtlest',
      '#F4F5F7',
    ) as 'var(--ds-background-accent-gray-subtlest, #F4F5F7)', // source for hex code was legacy token N20,
  },
  /** whiteGray - strong */
  ['#B3BAC5']: {
    tokenName: 'color.background.accent.gray.subtle' as const,
    token: token(
      'color.background.accent.gray.subtle',
      '#B3BAC5',
    ) as 'var(--ds-background-accent-gray-subtle, #B3BAC5)', // source for hex code was legacy token N60,
  },
};

const backgroundPaletteKeys = Object.keys(
  editorBackgroundPalette,
) as EditorBackgroundPaletteKey[];

const tokenNames = backgroundPaletteKeys.map(
  hexCode => editorBackgroundPalette[hexCode].tokenName,
);

export type EditorBackgroundPaletteTokenNames = (typeof tokenNames)[number];
