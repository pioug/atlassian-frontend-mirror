/* eslint-disable @atlaskit/editor/no-re-export -- VOLTC-139 tracks removal of these deprecated compatibility re-export shims. */
export type RGB = { b: number; g: number; r: number };
export type LCH = { c: number; h: number; l: number };

export const FULL_HEX_REGEX: RegExp = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/iu;

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { clampLightness } from './clamp-lightness';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { getDarkModeLCHColor } from './get-dark-mode-lch-color';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { rgbFromHex } from './rgb-from-hex';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { rgbToLch } from './rgb-to-lch';

// https://en.wikipedia.org/wiki/HCL_color_space
// https://en.wikipedia.org/wiki/CIE_1931_color_space#CIE_xy_chromaticity_diagram_and_the_CIE_xyY_color_space
// https://en.wikipedia.org/wiki/CIELAB_color_space
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { expandShorthandHex } from './expand-shorthand-hex';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { rgbToXyz } from './rgb-to-xyz';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { xyzToLab } from './xyz-to-lab';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { labToLch } from './lab-to-lch';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export type { XYZ } from './xyz';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export type { LAB } from './lab';
