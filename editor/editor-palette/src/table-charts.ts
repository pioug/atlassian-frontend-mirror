// This import will be stripped on build
// eslint-disable-next-line import/no-extraneous-dependencies
import { getTokenValue, token } from '@atlaskit/tokens';

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

/**
 * Takes an ADF hex color and returns the rendered hex code for the associated chart palette design token using getTokenValue.
 * If the provided color does not exist in the Editor color palette, this function returns undefined.
 *
 * This should only be used when rendering content where CSS variables are not feasible, such as a non-CSS environment
 * or to enable cross-app copy/paste.
 *
 * WARNING: If the rendered theme changes (such as from light -> dark mode) the value returned here will no longer match
 * the surrounding UI and will need to be re-fetched.
 * In addition, the values of tokens will differ between themes and the value for a given theme can and will change.
 * - **DO NOT**: store the output of these functions in any user-generated content or back-end.
 * - **DO**: store the ADF hex color, and use these utilities at render time to display the themed version of the color.
 */
export function hexToEditorTableChartsPaletteRawValue<HexColor extends string>(
  hexColor: HexColor,
): HexColor extends EditorTableChartsPaletteKey
  ? /** If the hexColor is an template literal matching a hex color -- we know what string will be returned  */
    string
  : undefined {
  // Ts ignore used to allow use of conditional return type
  // (preferencing better type on consumption over safety in implementation)
  // @ts-ignore
  const tokenData = editorTableChartsPalette[hexColor.toUpperCase()];
  return tokenData ? tokenData.getValue(hexColor) : undefined;
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
    getValue: (fallback: string) =>
      getTokenValue('color.background.accent.blue.subtle', fallback),
    token: token(
      'color.background.accent.blue.subtle',
      '#7AB2FF',
    ) as 'var(--ds-background-accent-blue-subtle, #7AB2FF)',
  },
  ['#60C6D2']: {
    getValue: (fallback: string) =>
      getTokenValue('color.background.accent.teal.subtle', fallback),
    token: token(
      'color.background.accent.teal.subtle',
      '#60C6D2',
    ) as 'var(--ds-background-accent-teal-subtle, #60C6D2)',
  },
  ['#6BE1B0']: {
    getValue: (fallback: string) =>
      getTokenValue('color.background.accent.green.subtle', fallback),
    token: token(
      'color.background.accent.green.subtle',
      '#6BE1B0',
    ) as 'var(--ds-background-accent-green-subtle, #6BE1B0)',
  },
  ['#FFDB57']: {
    getValue: (fallback: string) =>
      getTokenValue('color.background.accent.yellow.subtle', fallback),
    token: token(
      'color.background.accent.yellow.subtle',
      '#FFDB57',
    ) as 'var(--ds-background-accent-yellow-subtle, #FFDB57)',
  },
  ['#FAA53D']: {
    getValue: (fallback: string) =>
      getTokenValue('color.background.accent.orange.subtle', fallback),
    token: token(
      'color.background.accent.orange.subtle',
      '#FAA53D',
    ) as 'var(--ds-background-accent-orange-subtle, #FAA53D)',
  },
  ['#FF8F73']: {
    getValue: (fallback: string) =>
      getTokenValue('color.background.accent.red.subtle', fallback),
    token: token(
      'color.background.accent.red.subtle',
      '#FF8F73',
    ) as 'var(--ds-background-accent-red-subtle, #FF8F73)',
  },
  ['#E774BB']: {
    getValue: (fallback: string) =>
      getTokenValue('color.background.accent.magenta.subtle', fallback),
    token: token(
      'color.background.accent.magenta.subtle',
      '#E774BB',
    ) as 'var(--ds-background-accent-magenta-subtle, #E774BB)',
  },
  ['#B5A7FB']: {
    getValue: (fallback: string) =>
      getTokenValue('color.background.accent.purple.subtle', fallback),
    token: token(
      'color.background.accent.purple.subtle',
      '#B5A7FB',
    ) as 'var(--ds-background-accent-purple-subtle, #B5A7FB)',
  },
  ['#8993A5']: {
    getValue: (fallback: string) =>
      getTokenValue('color.background.accent.gray.subtler', fallback),
    token: token(
      'color.background.accent.gray.subtler',
      '#8993A5',
    ) as 'var(--ds-background-accent-gray-subtler, #8993A5)',
  },
  ['#247FFF']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.blue.bold', fallback),
    token: token(
      'color.chart.blue.bold',
      '#247FFF',
    ) as 'var(--ds-chart-blue-bold, #247FFF)',
  },
  ['#1D9AAA']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.teal.bold', fallback),
    token: token(
      'color.chart.teal.bold',
      '#1D9AAA',
    ) as 'var(--ds-chart-teal-bold, #1D9AAA)',
  },
  ['#23A971']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.green.bold', fallback),
    token: token(
      'color.chart.green.bold',
      '#23A971',
    ) as 'var(--ds-chart-green-bold, #23A971)',
  },
  ['#FFBE33']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.yellow.bold', fallback),
    token: token(
      'color.chart.yellow.bold',
      '#FFBE33',
    ) as 'var(--ds-chart-yellow-bold, #FFBE33)',
  },
  ['#D97008']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.orange.bold', fallback),
    token: token(
      'color.chart.orange.bold',
      '#D97008',
    ) as 'var(--ds-chart-orange-bold, #D97008)',
  },
  ['#FC552C']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.red.bold', fallback),
    token: token(
      'color.chart.red.bold',
      '#FC552C',
    ) as 'var(--ds-chart-red-bold, #FC552C)',
  },
  ['#DA62AC']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.magenta.bold', fallback),
    token: token(
      'color.chart.magenta.bold',
      '#DA62AC',
    ) as 'var(--ds-chart-magenta-bold, #DA62AC)',
  },
  ['#8B77EE']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.purple.bold', fallback),
    token: token(
      'color.chart.purple.bold',
      '#8B77EE',
    ) as 'var(--ds-chart-purple-bold, #8B77EE)',
  },
  ['#8590A2']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.gray.bold', fallback),
    token: token(
      'color.chart.gray.bold',
      '#8590A2',
    ) as 'var(--ds-chart-gray-bold, #8590A2)',
  },
  ['#0055CC']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.blue.bolder', fallback),
    token: token(
      'color.chart.blue.bolder',
      '#0055CC',
    ) as 'var(--ds-chart-blue-bolder, #0055CC)',
  },
  ['#1D7F8C']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.teal.bolder', fallback),
    token: token(
      'color.chart.teal.bolder',
      '#1D7F8C',
    ) as 'var(--ds-chart-teal-bolder, #1D7F8C)',
  },
  ['#177D52']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.green.bolder', fallback),
    token: token(
      'color.chart.green.bolder',
      '#177D52',
    ) as 'var(--ds-chart-green-bolder, #177D52)',
  },
  ['#FF9D00']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.yellow.bolder', fallback),
    token: token(
      'color.chart.yellow.bolder',
      '#FF9D00',
    ) as 'var(--ds-chart-yellow-bolder, #FF9D00)',
  },
  ['#B65C02']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.orange.bolder', fallback),
    token: token(
      'color.chart.orange.bolder',
      '#B65C02',
    ) as 'var(--ds-chart-orange-bolder, #B65C02)',
  },
  ['#D32D03']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.red.bolder', fallback),
    token: token(
      'color.chart.red.bolder',
      '#D32D03',
    ) as 'var(--ds-chart-red-bolder, #D32D03)',
  },
  ['#CD519D']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.magenta.bolder', fallback),
    token: token(
      'color.chart.magenta.bolder',
      '#CD519D',
    ) as 'var(--ds-chart-magenta-bolder, #CD519D)',
  },
  ['#5A43D0']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.purple.bolder', fallback),
    token: token(
      'color.chart.purple.bolder',
      '#5A43D0',
    ) as 'var(--ds-chart-purple-bolder, #5A43D0)',
  },
  ['#758195']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.gray.bolder', fallback),
    token: token(
      'color.chart.gray.bolder',
      '#758195',
    ) as 'var(--ds-chart-gray-bolder, #758195)',
  },
  ['#003884']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.blue.boldest', fallback),
    token: token(
      'color.chart.blue.boldest',
      '#003884',
    ) as 'var(--ds-chart-blue-boldest, #003884)',
  },
  ['#206B74']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.teal.boldest', fallback),
    token: token(
      'color.chart.teal.boldest',
      '#206B74',
    ) as 'var(--ds-chart-teal-boldest, #206B74)',
  },
  ['#055C3F']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.green.boldest', fallback),
    token: token(
      'color.chart.green.boldest',
      '#055C3F',
    ) as 'var(--ds-chart-green-boldest, #055C3F)',
  },
  ['#946104']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.yellow.boldest', fallback),
    token: token(
      'color.chart.yellow.boldest',
      '#946104',
    ) as 'var(--ds-chart-yellow-boldest, #946104)',
  },
  ['#974F0C']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.orange.boldest', fallback),
    token: token(
      'color.chart.orange.boldest',
      '#974F0C',
    ) as 'var(--ds-chart-orange-boldest, #974F0C)',
  },
  ['#A32000']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.red.boldest', fallback),
    token: token(
      'color.chart.red.boldest',
      '#A32000',
    ) as 'var(--ds-chart-red-boldest, #A32000)',
  },
  ['#943D73']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.magenta.boldest', fallback),
    token: token(
      'color.chart.magenta.boldest',
      '#943D73',
    ) as 'var(--ds-chart-magenta-boldest, #943D73)',
  },
  ['#44368B']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.purple.boldest', fallback),
    token: token(
      'color.chart.purple.boldest',
      '#44368B',
    ) as 'var(--ds-chart-purple-boldest, #44368B)',
  },
  ['#44546F']: {
    getValue: (fallback: string) =>
      getTokenValue('color.chart.gray.boldest', fallback),
    token: token(
      'color.chart.gray.boldest',
      '#44546F',
    ) as 'var(--ds-chart-gray-boldest, #44546F)',
  },
};
