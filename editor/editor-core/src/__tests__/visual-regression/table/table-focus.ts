import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { selectElementWithText } from '../../__helpers/page-objects/_editor';
import { pressKey } from '../../__helpers/page-objects/_keyboard';
import { snapshot, initFullPageEditorWithAdf } from '../_utils';
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
