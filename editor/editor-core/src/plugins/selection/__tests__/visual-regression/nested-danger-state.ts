import {
  PuppeteerPage,
  waitForTooltip,
} from '@atlaskit/visual-regression/helper';
import { EditorTestCardProvider } from '@atlaskit/editor-test-helpers/card-provider';
import { waitForResolvedInlineCard } from '@atlaskit/media-integration-test-helpers';

import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import {
  tableSelectors,
  clickFirstCell,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import { animationFrame } from '@atlaskit/editor-test-helpers/page-objects/editor';
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
      await waitForTooltip(page);
    });
  });
});
