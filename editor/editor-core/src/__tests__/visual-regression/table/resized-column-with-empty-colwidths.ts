import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  scrollToElement,
  selectors,
} from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import adf from './__fixtures__/table-with-text-in-zero-colwidth-columns.adf.json';

describe('table with zero width and text', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  async function setupEditor(
    stickyHeaders: boolean,
    featureFlags: { [featureFlag: string]: string | boolean } = {},
  ) {
    await initFullPageEditorWithAdf(page, adf, undefined, undefined, {
      allowTables: {
        advanced: true,
        stickyHeaders,
      },
      featureFlags,
    });
  }
  describe('shows headers with correct height', () => {
    it('without sticky headers', async () => {
      await setupEditor(false);
      await snapshot(page);
    });

    describe('with sticky headers', () => {
      beforeEach(async () => {
        await setupEditor(true);
      });

      it('on initial render', async () => {
        await snapshot(page);
      });

      it('when table is scrolled and header is sticky', async () => {
        await scrollToElement(page, selectors.lastEditorElement);
        await snapshot(page);
      });
    });
  });
});
