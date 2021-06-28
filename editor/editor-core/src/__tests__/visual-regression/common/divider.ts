import { THEME_MODES } from '@atlaskit/theme/constants';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import * as adfWithDivider from './__fixtures__/divider.adf.json';

import { Device, initFullPageEditorWithAdf, snapshot } from '../_utils';

describe('Snapshot Test: Divider', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  describe.each(THEME_MODES)('Theme: %s', (theme) => {
    test('should render the divider node properly', async () => {
      await initFullPageEditorWithAdf(
        page,
        adfWithDivider,
        Device.LaptopMDPI,
        undefined,
        undefined,
        theme === 'dark' ? 'dark' : 'light',
      );

      await snapshot(page);
    });
  });
});
