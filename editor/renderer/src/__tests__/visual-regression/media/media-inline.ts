import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { snapshot, Device, initRendererWithADF } from '../_utils';
import { ADFStage } from '@atlaskit/editor-common';
import {
  selectors,
  waitForLoadedMediaInlineCard,
} from '../../__helpers/page-objects/_media';

import * as mediaInlineAdf from './__fixtures__/media-inline.adf.json';
import * as mediaInlineInParagraphAdf from './__fixtures__/media-inline-in-paragraph.adf.json';
import * as mediaInlineMultipleInParagraphAdf from './__fixtures__/media-inline-multiple-in-paragraph.adf.json';

describe('Snapshot Test: MediaInline', () => {
  let page: PuppeteerPage;
  const stage: ADFStage = 'stage0';

  const initRenderer = async (page: PuppeteerPage, adf: any) => {
    return await initRendererWithADF(page, {
      appearance: 'full-page',
      device: Device.LaptopMDPI,
      rendererProps: {
        adfStage: stage,
      },
      adf,
    });
  };

  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page, undefined);
  });

  test('should render standalone component', async () => {
    await initRenderer(page, mediaInlineAdf);
    await waitForLoadedMediaInlineCard(page);
  });

  test('should render in paragraph', async () => {
    await initRenderer(page, mediaInlineInParagraphAdf);
    await waitForLoadedMediaInlineCard(page);
  });

  test('should render multiple in paragraph', async () => {
    await initRenderer(page, mediaInlineMultipleInParagraphAdf);
    await waitForLoadedMediaInlineCard(page);
  });

  test('should open media viewer when clicked', async () => {
    await initRenderer(page, mediaInlineAdf);
    await waitForLoadedMediaInlineCard(page);
    await page.click(selectors.mediaInlineCardSelector());
    await page.waitForSelector('[data-testid="media-viewer-popup"]');
  });
});
