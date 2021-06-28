import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import { Device, initFullPageEditorWithAdf, snapshot } from '../_utils';

import adfAllColors from './__fixtures__/table-with-all-background-colors.adf.json';
import { THEME_MODES } from '@atlaskit/theme/constants';

describe('Snapshot Test: render all table cell background colors', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  describe.each(THEME_MODES)('Theme: %s', (theme) => {
    beforeEach(async () => {
      await initFullPageEditorWithAdf(
        page,
        adfAllColors,
        Device.LaptopMDPI,
        undefined,
        undefined,
        theme === 'dark' ? 'dark' : 'light',
      );
    });

    it('should render all available background colors correctly', async () => {
      await snapshot(page);
    });
  });
});
