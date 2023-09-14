import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import * as rule from './__fixtures__/rule-adf.json';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import { getBoundingClientRect } from '@atlaskit/editor-test-helpers/vr-utils/bounding-client-rect';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
const ruleSelector = 'hr';

describe('Rule', () => {
  let page: PuppeteerPage;

  beforeAll(() => {
    page = global.page;
  });

  beforeEach(async () => {
    await initFullPageEditorWithAdf(page, rule, undefined, {
      width: 800,
      height: 300,
    });
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('displays as selected when clicked on', async () => {
    await page.click(ruleSelector);
  });

  it('displays as selected when click on leniency margin above rule', async () => {
    const contentBoundingRect = await getBoundingClientRect(page, ruleSelector);
    await page.mouse.click(contentBoundingRect.left, contentBoundingRect.top);
  });

  it('displays as selected when click on leniency margin below rule', async () => {
    const contentBoundingRect = await getBoundingClientRect(page, ruleSelector);
    await page.mouse.click(
      contentBoundingRect.left,
      contentBoundingRect.bottom,
    );
  });
});
