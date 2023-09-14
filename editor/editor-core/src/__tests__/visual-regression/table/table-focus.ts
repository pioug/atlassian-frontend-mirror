import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { selectElementWithText } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { pressKey } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import adf from './__fixtures__/table-with-paragraph.adf.json';

describe('Focused table: fullpage', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  // FIXME: This test was automatically skipped due to failure on 06/08/2023: https://product-fabric.atlassian.net/browse/ED-19363
  it.skip('focus via keyboard', async () => {
    await initFullPageEditorWithAdf(page, adf, undefined, undefined, {});
    await selectElementWithText({
      page,
      tag: 'p',
      text: 'test',
    });

    await pressKey(page, 'ArrowUp');
    await snapshot(page);
  });
});
