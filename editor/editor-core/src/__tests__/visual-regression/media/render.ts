import { snapshot, Device, initFullPageEditorWithAdf } from '../_utils';
import * as layoutsAndWidths from './__fixtures__/layouts-and-widths-adf.json';

describe('Snapshot Test: Media', () => {
  describe('full page editor', () => {
    it('display media with correct layouts and widths', async () => {
      // @ts-ignore
      const page = global.page;

      await initFullPageEditorWithAdf(
        page,
        layoutsAndWidths,
        Device.LaptopHiDPI,

        // viewport size to cover whole document
        //
        // can't use .ak-editor-content-area selector
        // in snapshot, because that cuts off wide and full-width images
        { width: 1440, height: 9200 },
      );

      await snapshot(page);
    });
  });
});
