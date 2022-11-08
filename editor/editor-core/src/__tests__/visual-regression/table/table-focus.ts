import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { selectElementWithText } from '@atlaskit/editor-test-helpers/page-objects/editor';
import { pressKey } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
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

  it.each([
    ['with stickyHeadersOptimization', true],
    ['without stickyHeadersOptimization', false],
  ])('focus via keayboard %s', async (_, stickyHeadersOptimization) => {
    await initFullPageEditorWithAdf(page, adf, undefined, undefined, {
      featureFlags: {
        stickyHeadersOptimization,
      },
    });
    await selectElementWithText({
      page,
      tag: 'p',
      text: 'test',
    });

    await pressKey(page, 'ArrowUp');
    await snapshot(page);
  });
});
