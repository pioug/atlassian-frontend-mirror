import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { THEME_MODES } from '@atlaskit/theme/constants';
import { initRendererWithADF, snapshot } from './_utils';
import * as adfWithDate from '../__fixtures__/date.adf.json';
import { selectors } from '../__helpers/page-objects/_date';
import { getModeFromTheme } from '@atlaskit/editor-common';

describe('Snapshot Test: Date', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  describe.each(THEME_MODES)('Theme: %s', (theme) => {
    test('should render the date node properly', async () => {
      await initRendererWithADF(page, {
        adf: adfWithDate,
        appearance: 'full-page',
        viewport: { width: 500, height: 200 },
        themeMode: getModeFromTheme(theme),
      });

      await page.waitForSelector(selectors.date);
      await snapshot(page);
    });
  });
});
