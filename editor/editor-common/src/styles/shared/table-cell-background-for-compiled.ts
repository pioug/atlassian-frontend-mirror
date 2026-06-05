import { mapBackgroundColors } from './mapBackgroundColors';

/**
 * Pre-built CSS string with `background-color` rules for every named table cell
 * color (e.g. `td[colorname='red' i]`, `th[colorname='red' i]`).
 *
 * Intended for Compiled CSS consumers — render inside a `<style>` tag, since
 * these rules are dynamically derived and cannot be expressed in a `cssMap`.
 */
export const tableCellBackgroundStyleOverrideForCompiled: string = mapBackgroundColors();
