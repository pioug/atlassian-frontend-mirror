import { snapshot, Device, initFullPageEditorWithAdf } from '../_utils';
import * as wrappedMediaAdf from './__fixtures__/wrapped-media.adf.json';
import * as wrappedInBlockMedia from './__fixtures__/wrapped-in-block-media.adf.json';

describe('Snapshot Test: Wrapped media', () => {
  it('should have 2 media items in 1 line when wrapped', async () => {
    const page = global.page;

    await initFullPageEditorWithAdf(page, wrappedMediaAdf, Device.LaptopHiDPI);

    await snapshot(page);
  });

  it('should wrap properly inside other block nodes', async () => {
    const page = global.page;

    await initFullPageEditorWithAdf(
      page,
      wrappedInBlockMedia,
      Device.LaptopHiDPI,
    );

    await snapshot(page);
  });
});
