import { snapshotInformational } from '@af/visual-regression';
import {
  PixelWidthGreaterThenDefault,
  PixelWidthGreaterThenDefaultFullWidth,
} from '../__helpers/rendererComponents';

snapshotInformational(PixelWidthGreaterThenDefault, {
  prepare: async (page) => page.setViewportSize({ width: 1800, height: 4500 }),
});

snapshotInformational(PixelWidthGreaterThenDefaultFullWidth, {
  prepare: async (page) => page.setViewportSize({ width: 1800, height: 4500 }),
});
