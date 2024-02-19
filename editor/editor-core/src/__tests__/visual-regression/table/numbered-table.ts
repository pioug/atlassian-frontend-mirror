// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickFirstCell,
  tableSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/table';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { waitForFloatingControl } from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  editorCommentContentSelector,
  initCommentEditorWithAdf,
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import { isElementBySelectorInDocument } from '../../../test-utils';

import multipleTablesAdf from './__fixtures__/numbered-table-multiple.adf.json';
import tableWithContentAdf from './__fixtures__/numbered-table-with-content.adf.json';
import adf from './__fixtures__/numbered-table.adf.json';

const numberedColumnSelector = '.pm-table-numbered-column';
const undefinedThreshold = {};

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('Snapshot Test: numbered table', () => {
  let page: PuppeteerPage;

  const checkIsInsertRowButtonInDocument = async () => {
    return await page.evaluate(
      isElementBySelectorInDocument,
      tableSelectors.insertRowButton,
    );
  };

  beforeAll(async () => {
    page = global.page;
  });

  it('looks correct for fullpage', async () => {
    await initFullPageEditorWithAdf(page, multipleTablesAdf, Device.LaptopMDPI);
    await clickFirstCell(page, true);
    await waitForFloatingControl(page, 'Table floating controls');
    await snapshot(page);
  });

  it('looks correct for comment', async () => {
    await initCommentEditorWithAdf(page, multipleTablesAdf, Device.LaptopMDPI);
    await clickFirstCell(page, true);
    await waitForFloatingControl(page, 'Table floating controls');
    await snapshot(page, undefined, editorCommentContentSelector);
  });

  it('should show insert button when mouse is hover numbered button', async () => {
    await initFullPageEditorWithAdf(page, adf);

    await expect(checkIsInsertRowButtonInDocument()).resolves.toBeFalsy();

    await clickFirstCell(page, true);
    await waitForFloatingControl(page, 'Table floating controls');
    await page.hover(tableSelectors.nthRowControl(2));
    await page.waitForSelector(tableSelectors.insertRowButton);

    await expect(checkIsInsertRowButtonInDocument()).resolves.toBeTruthy();
  });

  it('should show numbered column correctly', async () => {
    await initFullPageEditorWithAdf(page, tableWithContentAdf);

    await snapshot(page, undefinedThreshold, numberedColumnSelector);
  });
});
