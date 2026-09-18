/* eslint-disable @atlaskit/editor/no-re-export -- VOLTC-139 tracks removal of these deprecated compatibility re-export shims. */

/**
 * We're avoding importing these colors from @atlaskit/theme since we
 * do not want to have react as a dependency of this package.
 * TODO: Refactor this once tokenization by Core team is ready
 * https://product-fabric.atlassian.net/browse/CS-908
 */

export const R50 = '#FFEBE6';

export const R75 = '#FFBDAD';

export const R100 = '#FF8F73';

export const RedBold = '#FFB8B2';

export const R200 = '#FFD5D2';

export const R300 = '#FF5630';

export const R400 = '#DE350B';

export const R500 = '#BF2600';

export const Y50 = '#FFFAE6';

export const Y75 = '#FFF0B3';

export const Y200 = '#FFC400';

export const YellowBold = '#EFDD4E';

export const Yellow200 = '#F8E6A0';

export const Y400 = '#FF991F';

export const Y500 = '#FF8B00';

export const Y600 = '#B38600';

export const Y800 = '#7F5F01';

export const G50 = '#E3FCEF';

export const G75 = '#ABF5D1';

export const G200 = '#57D9A3';

export const GreenBold = '#97EDC9';

export const G300 = '#36B37E';

export const G400 = '#00875A';

export const G500 = '#006644';

export const B50 = '#DEEBFF';

export const B75 = '#B3D4FF';

export const B100 = '#4C9AFF';

export const BlueBold = '#ADCBFB';

export const B400 = '#0052CC';

export const B500 = '#0747A6';

export const L50 = '#EFFFD6';

export const L200 = '#D3F1A7';

export const L400 = '#BDE97C';

export const L600 = '#6A9A23';

export const L800 = '#4C6B1F';

export const N0 = '#FFFFFF';

export const N20 = '#F4F5F7';

export const N30 = '#EBECF0';

export const N40 = '#DFE1E6';

export const N50 = '#C1C7D0';

export const N60 = '#B3BAC5';

export const GrayBold = '#B7B9BE';

export const N80 = '#97A0AF';

export const N90 = '#8993A4';

export const N200 = '#6B778C';

export const N300 = '#5E6C84';

export const Neutral300 = '#DCDFE4';

export const N300A = '#091E4224';

export const N500 = '#42526E';

export const N600 = '#758195';

export const N800 = '#172B4D';

export const N1000 = '#172B4D';

export const M50 = '#FFECF8';

export const M200 = '#FDD0EC';

export const M400 = '#FCB6E1';

export const M600 = '#CD519D';

export const M800 = '#943D73';

export const O200 = '#FEDEC8';

export const Orange50 = '#FFF5DB';

export const Orange200 = '#FCE4A6';

export const Orange400 = '#FBD779';

export const O600 = '#E06C00';

export const O800 = '#9E4C00';

export const P50 = '#EAE6FF';

export const P75 = '#C0B6F2';

export const P100 = '#998DD9';

export const PurpleBold = '#E3BDFA';

export const P200 = '#DFD8FD';

export const P300 = '#6554C0';

export const P400 = '#5243AA';

export const P500 = '#403294';

export const T50 = '#E6FCFF';

export const T75 = '#B3F5FF';

export const T100 = '#79E2F2';

export const TealBold = '#B1E4F7';

export const T200 = '#C6EDFB';

export const T300 = '#00B8D9';

export const T500 = '#008DA6';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { normalizeHexColor } from './normalize-hex-color';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { hexToRgb } from './hex-to-rgb';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { hexToRgba } from './hex-to-rgba';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { rgbToHex } from './rgb-to-hex';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { isRgb } from './is-rgb';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { isHex } from './is-hex';
