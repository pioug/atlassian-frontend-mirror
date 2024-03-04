import { snapshotInformational } from '@af/visual-regression';
import {
  PixelWidthGreaterThenDefault,
  PixelWidthGreaterThenDefaultFullWidth,
} from '../__helpers/rendererComponents';

snapshotInformational.skip(PixelWidthGreaterThenDefault, {
  prepare: async (page) => {
    await page.setViewportSize({ width: 1800, height: 4500 });
  },
});

snapshotInformational.skip(PixelWidthGreaterThenDefaultFullWidth, {
  prepare: async (page) => {
    await page.setViewportSize({ width: 1800, height: 4500 });
  },
});
