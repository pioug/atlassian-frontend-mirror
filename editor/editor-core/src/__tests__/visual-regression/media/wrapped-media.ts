import { snapshot, Device, initFullPageEditorWithAdf } from '../_utils';
import * as wrappedMediaAdf from './__fixtures__/wrapped-media.adf.json';

describe('Snapshot Test: Wrapped media', () => {
  it('should have 2 media items in 1 line when wrapped', async () => {
    const page = global.page;

    await initFullPageEditorWithAdf(page, wrappedMediaAdf, Device.LaptopHiDPI);

    await snapshot(page);
  });
});
