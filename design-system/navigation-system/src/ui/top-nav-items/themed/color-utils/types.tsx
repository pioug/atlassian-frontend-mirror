// Defining distinct RGB and RGBA types so we can track exactly
// where we do or do not expect a value with an alpha channel
export type RGB = { r: number; g: number; b: number; a?: never };
export type RGBA = { r: number; g: number; b: number; a: number };

export type HSL = { h: number; s: number; l: number };
