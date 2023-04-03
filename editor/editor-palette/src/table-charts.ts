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
    EditorTableChartsPalette[HexColor]
  : string | undefined {
  // Ts ignore used to allow use of conditional return type
  // (preferencing better type on consumption over safety in implementation)
  // @ts-ignore
  return editorTableChartsPalette[hexColor.toUpperCase()];
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
  ['#7AB2FF']: token(
    'color.background.accent.blue.subtle',
    '#7AB2FF',
  ) as 'var(--ds-background-accent-blue-subtle, #7AB2FF)',
  ['#60C6D2']: token(
    'color.background.accent.teal.subtle',
    '#60C6D2',
  ) as 'var(--ds-background-accent-teal-subtle, #60C6D2)',
  ['#6BE1B0']: token(
    'color.background.accent.green.subtle',
    '#6BE1B0',
  ) as 'var(--ds-background-accent-green-subtle, #6BE1B0)',
  ['#FFDB57']: token(
    'color.background.accent.yellow.subtle',
    '#FFDB57',
  ) as 'var(--ds-background-accent-yellow-subtle, #FFDB57)',
  ['#FAA53D']: token(
    'color.background.accent.orange.subtle',
    '#FAA53D',
  ) as 'var(--ds-background-accent-orange-subtle, #FAA53D)',
  ['#FF8F73']: token(
    'color.background.accent.red.subtle',
    '#FF8F73',
  ) as 'var(--ds-background-accent-red-subtle, #FF8F73)',
  ['#E774BB']: token(
    'color.background.accent.magenta.subtle',
    '#E774BB',
  ) as 'var(--ds-background-accent-magenta-subtle, #E774BB)',
  ['#B5A7FB']: token(
    'color.background.accent.purple.subtle',
    '#B5A7FB',
  ) as 'var(--ds-background-accent-purple-subtle, #B5A7FB)',
  ['#8993A5']: token(
    'color.background.accent.gray.subtler',
    '#8993A5',
  ) as 'var(--ds-background-accent-gray-subtler, #8993A5)',
  ['#247FFF']: token(
    'color.chart.blue.bold',
    '#247FFF',
  ) as 'var(--ds-chart-blue-bold, #247FFF)',
  ['#1D9AAA']: token(
    'color.chart.teal.bold',
    '#1D9AAA',
  ) as 'var(--ds-chart-teal-bold, #1D9AAA)',
  ['#23A971']: token(
    'color.chart.green.bold',
    '#23A971',
  ) as 'var(--ds-chart-green-bold, #23A971)',
  ['#FFBE33']: token(
    'color.chart.yellow.bold',
    '#FFBE33',
  ) as 'var(--ds-chart-yellow-bold, #FFBE33)',
  ['#D97008']: token(
    'color.chart.orange.bold',
    '#D97008',
  ) as 'var(--ds-chart-orange-bold, #D97008)',
  ['#FC552C']: token(
    'color.chart.red.bold',
    '#FC552C',
  ) as 'var(--ds-chart-red-bold, #FC552C)',
  ['#DA62AC']: token(
    'color.chart.magenta.bold',
    '#DA62AC',
  ) as 'var(--ds-chart-magenta-bold, #DA62AC)',
  ['#8B77EE']: token(
    'color.chart.purple.bold',
    '#8B77EE',
  ) as 'var(--ds-chart-purple-bold, #8B77EE)',
  ['#8590A2']: token(
    'color.chart.gray.bold',
    '#8590A2',
  ) as 'var(--ds-chart-gray-bold, #8590A2)',
  ['#0055CC']: token(
    'color.chart.blue.bolder',
    '#0055CC',
  ) as 'var(--ds-chart-blue-bolder, #0055CC)',
  ['#1D7F8C']: token(
    'color.chart.teal.bolder',
    '#1D7F8C',
  ) as 'var(--ds-chart-teal-bolder, #1D7F8C)',
  ['#177D52']: token(
    'color.chart.green.bolder',
    '#177D52',
  ) as 'var(--ds-chart-green-bolder, #177D52)',
  ['#FF9D00']: token(
    'color.chart.yellow.bolder',
    '#FF9D00',
  ) as 'var(--ds-chart-yellow-bolder, #FF9D00)',
  ['#B65C02']: token(
    'color.chart.orange.bolder',
    '#B65C02',
  ) as 'var(--ds-chart-orange-bolder, #B65C02)',
  ['#D32D03']: token(
    'color.chart.red.bolder',
    '#D32D03',
  ) as 'var(--ds-chart-red-bolder, #D32D03)',
  ['#CD519D']: token(
    'color.chart.magenta.bolder',
    '#CD519D',
  ) as 'var(--ds-chart-magenta-bolder, #CD519D)',
  ['#5A43D0']: token(
    'color.chart.purple.bolder',
    '#5A43D0',
  ) as 'var(--ds-chart-purple-bolder, #5A43D0)',
  ['#758195']: token(
    'color.chart.gray.bolder',
    '#758195',
  ) as 'var(--ds-chart-gray-bolder, #758195)',
  ['#003884']: token(
    'color.chart.blue.boldest',
    '#003884',
  ) as 'var(--ds-chart-blue-boldest, #003884)',
  ['#206B74']: token(
    'color.chart.teal.boldest',
    '#206B74',
  ) as 'var(--ds-chart-teal-boldest, #206B74)',
  ['#055C3F']: token(
    'color.chart.green.boldest',
    '#055C3F',
  ) as 'var(--ds-chart-green-boldest, #055C3F)',
  ['#946104']: token(
    'color.chart.yellow.boldest',
    '#946104',
  ) as 'var(--ds-chart-yellow-boldest, #946104)',
  ['#974F0C']: token(
    'color.chart.orange.boldest',
    '#974F0C',
  ) as 'var(--ds-chart-orange-boldest, #974F0C)',
  ['#A32000']: token(
    'color.chart.red.boldest',
    '#A32000',
  ) as 'var(--ds-chart-red-boldest, #A32000)',
  ['#943D73']: token(
    'color.chart.magenta.boldest',
    '#943D73',
  ) as 'var(--ds-chart-magenta-boldest, #943D73)',
  ['#44368B']: token(
    'color.chart.purple.boldest',
    '#44368B',
  ) as 'var(--ds-chart-purple-boldest, #44368B)',
  ['#44546F']: token(
    'color.chart.gray.boldest',
    '#44546F',
  ) as 'var(--ds-chart-gray-boldest, #44546F)',
};
