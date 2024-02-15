// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { selectElementWithText } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { pressKey } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import adf from './__fixtures__/table-with-paragraph.adf.json';

describe('Focused table: fullpage', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  it('focus via keyboard', async () => {
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
