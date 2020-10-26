import { ADFStage } from '@atlaskit/editor-common';
import {
  PuppeteerPage,
  waitForLoadedBackgroundImages,
} from '@atlaskit/visual-regression/helper';

import { emojiSelectors } from '../__helpers/page-objects/_emoji';
import { selectors as rendererSelectors } from '../__helpers/page-objects/_renderer';

import * as panelsADF from './__fixtures__/renderer-panels.adf.json';
import { initRendererWithADF, snapshot } from './_utils';

const initRenderer = async (
  page: PuppeteerPage,
  isDarkTheme: boolean,
  adfStage: ADFStage,
) => {
  await initRendererWithADF(page, {
    appearance: 'full-page',
    viewport: { width: 1040, height: 400 },
    adf: panelsADF,
    rendererProps: {
      adfStage,
      UNSAFE_allowCustomPanels: adfStage === 'stage0',
    },
    themeMode: isDarkTheme ? 'dark' : 'light',
  });
};

describe('Snapshot Test: Panels', () => {
  let page: PuppeteerPage;

  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await page.waitForSelector(rendererSelectors.document);
    await page.waitForSelector('div[data-panel-type]', {
      visible: true,
    });
    await snapshot(page);
  });

  describe('Light theme', () => {
    it(`should render custom panels as info panel when not supported`, async () => {
      await initRenderer(page, false, 'final');
    });

    it(`should render regular and custom panels types correctly`, async () => {
      await initRenderer(page, false, 'stage0');
      await waitForLoadedBackgroundImages(page, emojiSelectors.standard);
    });
  });

  describe('Dark theme', () => {
    it(`should render custom panels as info panel when not supported`, async () => {
      await initRenderer(page, true, 'final');
    });

    it(`should render regular and custom panels types correctly`, async () => {
      await initRenderer(page, true, 'stage0');
      await waitForLoadedBackgroundImages(page, emojiSelectors.standard);
    });
  });
});
