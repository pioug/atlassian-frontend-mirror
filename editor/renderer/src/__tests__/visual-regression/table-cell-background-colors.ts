import { initRendererWithADF, snapshot } from './_utils';
import { THEME_MODES } from '@atlaskit/theme/constants';
import adfAllColors from './__fixtures__/table-with-all-background-colors.adf.json';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

const initRenderer = async (page: PuppeteerPage, theme: string) => {
  await initRendererWithADF(page, {
    appearance: 'full-page',
    viewport: { width: 1485, height: 1175 },
    adf: adfAllColors,
    themeMode: theme === 'dark' ? 'dark' : 'light',
  });
};

describe('Snapshot Test: Render all Table Cell Background Colors', () => {
  let page: PuppeteerPage;

  beforeAll(() => {
    page = global.page;
  });

  describe.each(THEME_MODES)('Theme: %s', (theme) => {
    it('should render all table cell background colors correctly', async () => {
      await initRenderer(page, theme);
      await snapshot(page);
    });
  });
});
