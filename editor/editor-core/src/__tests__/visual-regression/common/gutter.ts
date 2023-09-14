import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import longContent from './__fixtures__/long-content-adf.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { typeInEditorAtEndOfDocument } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { tableSelectors } from '@atlaskit/editor-test-helpers/page-objects/table';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { panelSelectors } from '@atlaskit/editor-test-helpers/page-objects/panel';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { decisionSelectors } from '@atlaskit/editor-test-helpers/page-objects/decision';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { pressKey } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { quickInsert } from '@atlaskit/editor-test-helpers/page-objects/extensions';

const waitForScrollGutter = async (page: PuppeteerPage) => {
  await page.waitForSelector('#editor-scroll-gutter');
};

describe('Gutter:', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
    await initFullPageEditorWithAdf(page, longContent, Device.LaptopMDPI);
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('should add gutter at the bottom of the page', async () => {
    await typeInEditorAtEndOfDocument(page, 'Hello World');
    await waitForScrollGutter(page);
  });

  it.skip('should add gutter if a table is added at the end of the editor', async () => {
    await typeInEditorAtEndOfDocument(page, '');
    await quickInsert(page, 'Table', false);
    await pressKey(page, 'Enter');
    await page.waitForSelector(tableSelectors.tableTh);

    await pressKey(page, ['ArrowDown', 'ArrowDown']); // Go to last row
    await waitForScrollGutter(page);
  });

  it.skip('should add gutter if a panel is added at the end of the editor', async () => {
    await typeInEditorAtEndOfDocument(page, '');
    await quickInsert(page, 'info', false);
    await pressKey(page, 'Enter');

    await page.waitForSelector(panelSelectors.infoPanel);
    await waitForScrollGutter(page);
  });

  it.skip('should add gutter if a decision is added at the end of the editor', async () => {
    await typeInEditorAtEndOfDocument(page, '');
    await quickInsert(page, 'decision', false);
    await pressKey(page, 'Enter');

    await page.waitForSelector(decisionSelectors.decisionItem);
    await waitForScrollGutter(page);
  });
});
