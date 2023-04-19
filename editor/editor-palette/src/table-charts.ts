// This import will be stripped on build
// eslint-disable-next-line import/no-extraneous-dependencies
import { token } from '@atlaskit/tokens';

/**
 * This takes an adf hex color and returns a matching chart palette
 * color.
 *
 * By providing a design token, this enables ADF content to be rendered in new themes such as dark mode.
 *
 * Example usage
 * ```tsx
 * const cssValue = hexToEditorTableChartsPaletteColor('#FFFFFF');
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
export function hexToEditorTableChartsPaletteColor<HexColor extends string>(
  hexColor: HexColor,
): HexColor extends EditorTableChartsPaletteKey
  ? /** If the hexColor is an template literal matching a hex color -- we know what string will be returned  */
    EditorTableChartsPalette[HexColor]['token']
  : string | undefined {
  // Ts ignore used to allow use of conditional return type
  // (preferencing better type on consumption over safety in implementation)
  // @ts-ignore
  const tokenData = editorTableChartsPalette[hexColor.toUpperCase()];
  return tokenData ? tokenData.token : undefined;
}

export function hexToEditorTableChartsPaletteColorTokenName<
  HexColor extends string,
>(
  hexColor: HexColor,
): HexColor extends EditorTableChartsPaletteKey
  ? /** If the hexColor is an template literal matching a hex color -- we know what string will be returned  */
    EditorTableChartsPalette[HexColor]['tokenName']
  : EditorBackgroundPaletteTokenNames | undefined {
  // Ts ignore used to allow use of conditional return type
  // (preferencing better type on consumption over safety in implementation)
  // @ts-ignore
  const tokenData = editorTableChartsPalette[hexColor.toUpperCase()];
  return tokenData ? tokenData.tokenName : undefined;
}

type EditorTableChartsPalette = typeof editorTableChartsPalette;
export type EditorTableChartsPaletteKey = keyof EditorTableChartsPalette;
// Colors taken from
// https://hello.atlassian.net/wiki/spaces/DST/pages/1790979421/DSTRFC-002+-+Shifting+Editor+s+color+palette+to+design+tokens
// values are asserted to improve generated type declarations

/**
 * Tokenize hex codes into DST chart colors or
 *  into DST background.accent colors.
 *
 * The hex codes do not match the DST tokens, they are
 *  constants that are saved in the ADF that will be rendered
 *  as the mapped DST token.
 *
 * https://product-fabric.atlassian.net/browse/ED-17042
 */
const editorTableChartsPalette = {
  ['#7AB2FF']: {
    tokenName: 'color.background.accent.blue.subtle' as const,
    token: token(
      'color.background.accent.blue.subtle',
      '#7AB2FF',
    ) as 'var(--ds-background-accent-blue-subtle, #7AB2FF)',
  },
  ['#60C6D2']: {
    tokenName: 'color.background.accent.teal.subtle' as const,
    token: token(
      'color.background.accent.teal.subtle',
      '#60C6D2',
    ) as 'var(--ds-background-accent-teal-subtle, #60C6D2)',
  },
  ['#6BE1B0']: {
    tokenName: 'color.background.accent.green.subtle' as const,
    token: token(
      'color.background.accent.green.subtle',
      '#6BE1B0',
    ) as 'var(--ds-background-accent-green-subtle, #6BE1B0)',
  },
  ['#FFDB57']: {
    tokenName: 'color.background.accent.yellow.subtle' as const,
    token: token(
      'color.background.accent.yellow.subtle',
      '#FFDB57',
    ) as 'var(--ds-background-accent-yellow-subtle, #FFDB57)',
  },
  ['#FAA53D']: {
    tokenName: 'color.background.accent.orange.subtle' as const,
    token: token(
      'color.background.accent.orange.subtle',
      '#FAA53D',
    ) as 'var(--ds-background-accent-orange-subtle, #FAA53D)',
  },
  ['#FF8F73']: {
    tokenName: 'color.background.accent.red.subtle' as const,
    token: token(
      'color.background.accent.red.subtle',
      '#FF8F73',
    ) as 'var(--ds-background-accent-red-subtle, #FF8F73)',
  },
  ['#E774BB']: {
    tokenName: 'color.background.accent.magenta.subtle' as const,
    token: token(
      'color.background.accent.magenta.subtle',
      '#E774BB',
    ) as 'var(--ds-background-accent-magenta-subtle, #E774BB)',
  },
  ['#B5A7FB']: {
    tokenName: 'color.background.accent.purple.subtle' as const,
    token: token(
      'color.background.accent.purple.subtle',
      '#B5A7FB',
    ) as 'var(--ds-background-accent-purple-subtle, #B5A7FB)',
  },
  ['#8993A5']: {
    tokenName: 'color.background.accent.gray.subtler' as const,
    token: token(
      'color.background.accent.gray.subtler',
      '#8993A5',
    ) as 'var(--ds-background-accent-gray-subtler, #8993A5)',
  },
  ['#247FFF']: {
    tokenName: 'color.chart.blue.bold' as const,
    token: token(
      'color.chart.blue.bold',
      '#247FFF',
    ) as 'var(--ds-chart-blue-bold, #247FFF)',
  },
  ['#1D9AAA']: {
    tokenName: 'color.chart.teal.bold' as const,
    token: token(
      'color.chart.teal.bold',
      '#1D9AAA',
    ) as 'var(--ds-chart-teal-bold, #1D9AAA)',
  },
  ['#23A971']: {
    tokenName: 'color.chart.green.bold' as const,
    token: token(
      'color.chart.green.bold',
      '#23A971',
    ) as 'var(--ds-chart-green-bold, #23A971)',
  },
  ['#FFBE33']: {
    tokenName: 'color.chart.yellow.bold' as const,
    token: token(
      'color.chart.yellow.bold',
      '#FFBE33',
    ) as 'var(--ds-chart-yellow-bold, #FFBE33)',
  },
  ['#D97008']: {
    tokenName: 'color.chart.orange.bold' as const,
    token: token(
      'color.chart.orange.bold',
      '#D97008',
    ) as 'var(--ds-chart-orange-bold, #D97008)',
  },
  ['#FC552C']: {
    tokenName: 'color.chart.red.bold' as const,
    token: token(
      'color.chart.red.bold',
      '#FC552C',
    ) as 'var(--ds-chart-red-bold, #FC552C)',
  },
  ['#DA62AC']: {
    tokenName: 'color.chart.magenta.bold' as const,
    token: token(
      'color.chart.magenta.bold',
      '#DA62AC',
    ) as 'var(--ds-chart-magenta-bold, #DA62AC)',
  },
  ['#8B77EE']: {
    tokenName: 'color.chart.purple.bold' as const,
    token: token(
      'color.chart.purple.bold',
      '#8B77EE',
    ) as 'var(--ds-chart-purple-bold, #8B77EE)',
  },
  ['#8590A2']: {
    tokenName: 'color.chart.gray.bold' as const,
    token: token(
      'color.chart.gray.bold',
      '#8590A2',
    ) as 'var(--ds-chart-gray-bold, #8590A2)',
  },
  ['#0055CC']: {
    tokenName: 'color.chart.blue.bolder' as const,
    token: token(
      'color.chart.blue.bolder',
      '#0055CC',
    ) as 'var(--ds-chart-blue-bolder, #0055CC)',
  },
  ['#1D7F8C']: {
    tokenName: 'color.chart.teal.bolder' as const,
    token: token(
      'color.chart.teal.bolder',
      '#1D7F8C',
    ) as 'var(--ds-chart-teal-bolder, #1D7F8C)',
  },
  ['#177D52']: {
    tokenName: 'color.chart.green.bolder' as const,
    token: token(
      'color.chart.green.bolder',
      '#177D52',
    ) as 'var(--ds-chart-green-bolder, #177D52)',
  },
  ['#FF9D00']: {
    tokenName: 'color.chart.yellow.bolder' as const,
    token: token(
      'color.chart.yellow.bolder',
      '#FF9D00',
    ) as 'var(--ds-chart-yellow-bolder, #FF9D00)',
  },
  ['#B65C02']: {
    tokenName: 'color.chart.orange.bolder' as const,
    token: token(
      'color.chart.orange.bolder',
      '#B65C02',
    ) as 'var(--ds-chart-orange-bolder, #B65C02)',
  },
  ['#D32D03']: {
    tokenName: 'color.chart.red.bolder' as const,
    token: token(
      'color.chart.red.bolder',
      '#D32D03',
    ) as 'var(--ds-chart-red-bolder, #D32D03)',
  },
  ['#CD519D']: {
    tokenName: 'color.chart.magenta.bolder' as const,
    token: token(
      'color.chart.magenta.bolder',
      '#CD519D',
    ) as 'var(--ds-chart-magenta-bolder, #CD519D)',
  },
  ['#5A43D0']: {
    tokenName: 'color.chart.purple.bolder' as const,
    token: token(
      'color.chart.purple.bolder',
      '#5A43D0',
    ) as 'var(--ds-chart-purple-bolder, #5A43D0)',
  },
  ['#758195']: {
    tokenName: 'color.chart.gray.bolder' as const,
    token: token(
      'color.chart.gray.bolder',
      '#758195',
    ) as 'var(--ds-chart-gray-bolder, #758195)',
  },
  ['#003884']: {
    tokenName: 'color.chart.blue.boldest' as const,
    token: token(
      'color.chart.blue.boldest',
      '#003884',
    ) as 'var(--ds-chart-blue-boldest, #003884)',
  },
  ['#206B74']: {
    tokenName: 'color.chart.teal.boldest' as const,
    token: token(
      'color.chart.teal.boldest',
      '#206B74',
    ) as 'var(--ds-chart-teal-boldest, #206B74)',
  },
  ['#055C3F']: {
    tokenName: 'color.chart.green.boldest' as const,
    token: token(
      'color.chart.green.boldest',
      '#055C3F',
    ) as 'var(--ds-chart-green-boldest, #055C3F)',
  },
  ['#946104']: {
    tokenName: 'color.chart.yellow.boldest' as const,
    token: token(
      'color.chart.yellow.boldest',
      '#946104',
    ) as 'var(--ds-chart-yellow-boldest, #946104)',
  },
  ['#974F0C']: {
    tokenName: 'color.chart.orange.boldest' as const,
    token: token(
      'color.chart.orange.boldest',
      '#974F0C',
    ) as 'var(--ds-chart-orange-boldest, #974F0C)',
  },
  ['#A32000']: {
    tokenName: 'color.chart.red.boldest' as const,
    token: token(
      'color.chart.red.boldest',
      '#A32000',
    ) as 'var(--ds-chart-red-boldest, #A32000)',
  },
  ['#943D73']: {
    tokenName: 'color.chart.magenta.boldest' as const,
    token: token(
      'color.chart.magenta.boldest',
      '#943D73',
    ) as 'var(--ds-chart-magenta-boldest, #943D73)',
  },
  ['#44368B']: {
    tokenName: 'color.chart.purple.boldest' as const,
    token: token(
      'color.chart.purple.boldest',
      '#44368B',
    ) as 'var(--ds-chart-purple-boldest, #44368B)',
  },
  ['#44546F']: {
    tokenName: 'color.chart.gray.boldest' as const,
    token: token(
      'color.chart.gray.boldest',
      '#44546F',
    ) as 'var(--ds-chart-gray-boldest, #44546F)',
  },
};

const tableChartsPaletteKeys = Object.keys(
  editorTableChartsPalette,
) as EditorTableChartsPaletteKey[];

const tokenNames = tableChartsPaletteKeys.map(
  hexCode => editorTableChartsPalette[hexCode].tokenName,
);

export type EditorBackgroundPaletteTokenNames = typeof tokenNames[number];
