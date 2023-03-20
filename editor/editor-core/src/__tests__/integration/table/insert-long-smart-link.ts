import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { waitForInlineCard } from '@atlaskit/media-integration-test-helpers';
import { inlineCardLongNameSlowResolveUrl } from '@atlaskit/editor-test-helpers/card-provider';
import { fullpage } from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDClipboardExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import {
  clickFirstCell,
  insertTable,
  tableSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/table';

BrowserTestCase(
  'table row controls should be same height as table body after a long title smart link finishes async rendering',
  { skip: ['safari'] },
  async (client: any) => {
    // Copy stuff to clipboard and go to editor
    const page = await goToEditorTestingWDClipboardExample(
      client,
      inlineCardLongNameSlowResolveUrl,
    );
    await mountEditor(
      page,
      {
        appearance: fullpage.appearance,
        smartLinks: {
          allowEmbeds: true,
        },
        allowTables: {
          advanced: true,
        },
      },
      {
        providers: {
          cards: true,
        },
      },
    );

    await insertTable(page);
    await clickFirstCell(page);
    await page.paste();
    await waitForInlineCard(page);

    const { tableBodyHeight, tableRowControlsHeight } = await page.evaluate<{
      tableBodyHeight: number;
      tableRowControlsHeight: number;
    }>(
      (tableRowControlsSelector, tableBodySelector) => {
        const tableRowControls = document.querySelector(
          tableRowControlsSelector,
        ) as HTMLElement;
        const tableBody = document.querySelector(tableBodySelector);
        if (!tableBody || !tableRowControls) {
          throw new Error(
            'Missing tableBody or tableRowControls, exiting test',
          );
        }
        return {
          tableBodyHeight: Math.round(tableBody.offsetHeight),
          tableRowControlsHeight: Math.round(tableRowControls.offsetHeight),
        };
      },
      tableSelectors.rowControlsForTableBody,
      tableSelectors.tableBody,
    );

    expect(tableBodyHeight).toBe(tableRowControlsHeight);
  },
);
