import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { THEME_MODES } from '@atlaskit/theme/constants';
import { initRendererWithADF, snapshot } from './_utils';
import * as placeholderAdf from './__fixtures__/placeholder.adf.json';
import { selectors } from '../__helpers/page-objects/_placeholder';
import { getModeFromTheme } from '@atlaskit/editor-common';

describe('Snapshot Test: Placeholder', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  describe.each(THEME_MODES)('Theme: %s', (theme) => {
    test('should render the date node properly', async () => {
      await initRendererWithADF(page, {
        adf: placeholderAdf,
        appearance: 'full-page',
        viewport: { width: 200, height: 200 },
        themeMode: getModeFromTheme(theme),
        rendererProps: { allowPlaceholderText: true },
      });

      await page.waitForSelector(selectors.placeholder);
      await snapshot(page);
    });
  });
});
