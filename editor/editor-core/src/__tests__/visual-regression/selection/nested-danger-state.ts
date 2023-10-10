// eslint-disable-next-line import/no-extraneous-dependencies
import { EditorTestCardProvider } from '@atlaskit/editor-test-helpers/card-provider';
// eslint-disable-next-line import/no-extraneous-dependencies
import { animationFrame } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  clickFirstCell,
  tableSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/table';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import { waitForResolvedInlineCard } from '@atlaskit/media-integration-test-helpers';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import adf from './__fixtures__/nested-elements.adf.json';

describe('Danger for nested elements', () => {
  let page: PuppeteerPage;
  const cardProvider = new EditorTestCardProvider();

  describe(`Full page`, () => {
    beforeAll(async () => {
      page = global.page;
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf,
        viewport: { width: 1280, height: 550 },
        editorProps: {
          smartLinks: { provider: Promise.resolve(cardProvider) },
        },
      });
      await waitForResolvedInlineCard(page);
      await clickFirstCell(page);
      await animationFrame(page);
    });

    afterEach(async () => {
      await snapshot(page);
    });

    it(`should show danger for table and all nested elements`, async () => {
      await page.waitForSelector(tableSelectors.removeTable);
      await page.hover(tableSelectors.removeTable);
      await page.waitForSelector(tableSelectors.removeDanger);
    });
  });
});
