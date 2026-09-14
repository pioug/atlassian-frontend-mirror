import { labToLch } from './lab-to-lch';
import type { LCH, RGB } from './lch-color-inversion';
import { rgbToXyz } from './rgb-to-xyz';
import { xyzToLab } from './xyz-to-lab';

export const rgbToLch = (rgb: RGB): LCH => labToLch(xyzToLab(rgbToXyz(rgb)));
