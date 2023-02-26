import { THEME_MODES } from '@atlaskit/theme/constants';
import {
  PuppeteerPage,
  waitForLoadedBackgroundImages,
} from '@atlaskit/visual-regression/helper';

import {
  animationFrame,
  initRendererWithADF,
  snapshot,
  waitForText,
} from './_utils';
import { getBoundingClientRect } from '@atlaskit/editor-test-helpers/vr-utils/bounding-client-rect';
import * as wideTableResized from '../__fixtures__/table-wide-resized.adf.json';
import * as tableWithShadowAdf from '../__fixtures__/table-with-shadow.adf.json';
import * as tableWithWrappedNodesAdf from './__fixtures__/table-with-wrapped-nodes.adf.json';
import * as tableComplexSelectionsAdf from './__fixtures__/table-complex-selections.adf.json';
import * as tableEmpty from '../__fixtures__/table-empty.adf.json';
import { RendererAppearance } from '../../ui/Renderer/types';
import { selectors as expandSelectors } from '../__helpers/page-objects/_expand';
import { selectors as statusSelectors } from '../__helpers/page-objects/_status';
import { selectors as decisionSelectors } from '../__helpers/page-objects/_decision';
import { selectors as panelSelectors } from '../__helpers/page-objects/_panel';
import { selectors as codeBlockSelectors } from '../__helpers/page-objects/_codeblock';
import { selectors as mediaSelectors } from '../__helpers/page-objects/_media';
import { emojiSelectors } from '../__helpers/page-objects/_emoji';

const tableContainerSelector = '.pm-table-container';

async function waitForTableWithCards(page: PuppeteerPage) {
  await page.waitForSelector(tableContainerSelector);
}

const initRenderer = async (
  page: PuppeteerPage,
  adf: any,
  mode?: 'light' | 'dark',
  appearance: RendererAppearance = 'full-page',
  allowColumnSorting: boolean = false,
  viewport?: { width: number; height: number },
) => {
  await initRendererWithADF(page, {
    appearance,
    viewport: viewport ?? { width: 1485, height: 1175 },
    adf,
    themeMode: mode,
    rendererProps: { allowColumnSorting },
  });
};

describe('Snapshot Test: Table scaling', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  afterAll(() => {
    page.addStyleTag({
      content: `.__fake_inline_comment__ { display: none; }`,
    });
  });

  afterEach(async () => {
    await animationFrame(page);
    await snapshot(page);
  });

  describe.each(THEME_MODES)('Theme: %s', (theme) => {
    const mode = theme === 'dark' ? 'dark' : 'light';
    it(`should NOT render a right shadow`, async () => {
      await initRenderer(page, tableEmpty, mode);
      await waitForTableWithCards(page);
    });

    it(`should not overlap inline comments dialog`, async () => {
      await initRenderer(page, tableWithShadowAdf, mode);
      await waitForTableWithCards(page);

      await page.evaluate(() => {
        let div = document.createElement('div');
        div.className = '__fake_inline_comment__';
        document.body.appendChild(div);
      });

      const css = `
    .__fake_inline_comment__ {
      position: absolute;
      right: 300px;
      top: 300px;
      width: 300px;
      height: 200px;
      background: white;
      border: 1px solid red;
    }
    `;
      await page.addStyleTag({ content: css });
      await snapshot(page);
    });

    // TODO: https://product-fabric.atlassian.net/browse/ED-13527
    it.skip('should render table content correctly in mobile appearance', async () => {
      await initRenderer(page, wideTableResized, mode, 'mobile');
      await page.waitForSelector(tableContainerSelector);
      await page.waitForSelector(
        '#renderer-container [data-testid="inline-card-resolved-view"]',
      );
    });
  });
});

describe('Snapshot Test: wrapping inline nodes inside table cells', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await animationFrame(page);
    await snapshot(page);
  });

  describe.each(THEME_MODES)('Theme: %s', (theme) => {
    const mode = theme === 'dark' ? 'dark' : 'light';

    // ED-7785
    it(`should NOT overflow inline nodes when table columns are narrow`, async () => {
      await initRenderer(page, tableWithWrappedNodesAdf, mode);
      const mentionSelector = 'span[data-mention-id]>span';
      const dateSelector = 'span[data-node-type="date"]';
      await waitForText(page, mentionSelector, '@Erwin Petrovich');
      await waitForText(page, dateSelector, 'Jun 30, 2020');
    });
  });
});

describe('Snapshot Test: triple click selection', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    // We only care about asserting on DOM selection, and want to avoid loading visual flakiness
    // that forces multiple media tests to be skipped, so we will hide the media single node's content
    // before snapshots (but keep an outline as a marker)
    await page.evaluate((selector) => {
      const mediaSingles = document.querySelectorAll(selector);
      mediaSingles.forEach((mediaSingle) => {
        if (mediaSingle) {
          mediaSingle.style.border = '1px solid black';
          mediaSingle.firstChild.style.visibility = 'hidden';
        }
      });
    }, mediaSelectors.mediaSingle);
    await snapshot(page);
  });

  const testCases: {
    fixtureTableCellRow: number;
    fixtureTableCellCol: number;
    fixtureTableCellType: `header` | `cell`;
    beforeClickTargetClick?: (page: PuppeteerPage) => Promise<void>;
    clickTargetSelector: string;
    clickTargetDescription: string;
    expectedSelectionStartSelector: string | null;
    expectedSelectionEndSelector: string | null;
    expectedSelectionDescription: string;
    clickTargetClickPos?: `top left` | `bottom right`;
    clickTargetAdjustPx?: number;
  }[] = [
    {
      fixtureTableCellRow: 2,
      fixtureTableCellCol: 1,
      fixtureTableCellType: 'cell',
      clickTargetSelector: `p:nth-of-type(2)`,
      clickTargetClickPos: `bottom right`,
      clickTargetAdjustPx: -5,
      clickTargetDescription: `last paragraph (with text,inline nodes)`,
      expectedSelectionStartSelector: `p:nth-of-type(2)`,
      expectedSelectionEndSelector: `p:nth-of-type(2)`,
      expectedSelectionDescription: `from last paragraph to last paragraph`,
    },
    {
      fixtureTableCellRow: 2,
      fixtureTableCellCol: 2,
      fixtureTableCellType: `cell`,
      clickTargetSelector: `p:nth-of-type(2)`,
      clickTargetClickPos: `top left`,
      clickTargetDescription: `start of last paragraph (with text,inline nodes,img emoji)`,
      expectedSelectionStartSelector: `p:nth-of-type(2)`,
      expectedSelectionEndSelector: `p:nth-of-type(2)`,
      // Selection ending halfway in the paragraph is probably unwanted behaviour, but we haven't fixed this yet.
      // This test is to document existing behaviour. Once fixed, update this test.
      expectedSelectionDescription: `from start of last paragraph to img emoji`,
    },
    {
      fixtureTableCellRow: 2,
      fixtureTableCellCol: 2,
      fixtureTableCellType: `cell`,
      clickTargetSelector: `p:nth-of-type(2)`,
      clickTargetClickPos: `bottom right`,
      clickTargetAdjustPx: -5,
      clickTargetDescription: `end of last paragraph (with text,inline nodes,img emoji)`,
      expectedSelectionStartSelector: `p:nth-of-type(2)`,
      expectedSelectionEndSelector: `p:nth-of-type(2)`,
      expectedSelectionDescription: `from last paragraph to last paragraph`,
    },
    {
      fixtureTableCellRow: 2,
      fixtureTableCellCol: 3,
      fixtureTableCellType: `cell`,
      clickTargetSelector: `p:nth-of-type(1)`,
      clickTargetDescription: `first paragraph (with text) above closed expand`,
      expectedSelectionStartSelector: `p:nth-of-type(1)`,
      expectedSelectionEndSelector: `p:nth-of-type(1)`,
      expectedSelectionDescription: `from first paragraph to first paragraph`,
    },
    {
      fixtureTableCellRow: 2,
      fixtureTableCellCol: 3,
      fixtureTableCellType: `cell`,
      beforeClickTargetClick: async (page: PuppeteerPage) => {
        await page.waitForSelector(expandSelectors.nestedExpandToggle);
        await page.click(expandSelectors.nestedExpandToggle);
        await page.waitForSelector(expandSelectors.nestedExpandOpen);
      },
      clickTargetSelector: `p:nth-of-type(1)`,
      clickTargetDescription: `first paragraph (with text) above opened expand`,
      expectedSelectionStartSelector: `p:nth-of-type(1)`,
      expectedSelectionEndSelector: `${expandSelectors.nestedExpandOpen} p:nth-of-type(1)`,
      // Selection ending in a different paragraph is probably unwanted behaviour, but we haven't fixed this yet.
      // This test is to document existing behaviour. Once fixed, update this test.
      expectedSelectionDescription: `from first paragraph above expand to first paragraph inside expand`,
    },
    {
      fixtureTableCellRow: 2,
      fixtureTableCellCol: 3,
      fixtureTableCellType: `cell`,
      beforeClickTargetClick: async (page: PuppeteerPage) => {
        await page.waitForSelector(expandSelectors.nestedExpandToggle);
        await page.click(expandSelectors.nestedExpandToggle);
        await page.waitForSelector(expandSelectors.nestedExpandOpen);
      },
      clickTargetSelector: `${expandSelectors.nestedExpandOpen} p:nth-of-type(2)`,
      clickTargetDescription: `last paragraph (with text) inside opened expand`,
      expectedSelectionStartSelector: `${expandSelectors.nestedExpandOpen} p:nth-of-type(2)`,
      expectedSelectionEndSelector: `${expandSelectors.nestedExpandOpen} p:nth-of-type(2)`,
      expectedSelectionDescription: `from last paragraph inside expand to last paragraph inside expand`,
    },
    {
      fixtureTableCellRow: 3,
      fixtureTableCellCol: 1,
      fixtureTableCellType: `cell`,
      clickTargetSelector: statusSelectors.status,
      clickTargetDescription: `status (standalone)`,
      expectedSelectionStartSelector: `p:nth-of-type(1)`,
      expectedSelectionEndSelector: `p:nth-of-type(1)`,
      // Even though DOM selection appears correct, copy/paste would only paste the status text and we haven't fixed this yet.
      expectedSelectionDescription: `from status to status`,
    },
    {
      fixtureTableCellRow: 3,
      fixtureTableCellCol: 2,
      fixtureTableCellType: `cell`,
      clickTargetSelector: `li:nth-of-type(2) ${decisionSelectors.decisionItem}`,
      clickTargetDescription: `last decision item (with text)`,
      expectedSelectionStartSelector: `li:nth-of-type(2) ${decisionSelectors.decisionItem} > div`,
      expectedSelectionEndSelector: `li:nth-of-type(2) ${decisionSelectors.decisionItem} > div`,
      expectedSelectionDescription: `from last decision item to last decision item`,
    },
    {
      fixtureTableCellRow: 3,
      fixtureTableCellCol: 3,
      fixtureTableCellType: `cell`,
      clickTargetSelector: `p:nth-of-type(1)`,
      clickTargetDescription: `first paragraph (with text) above panel`,
      expectedSelectionStartSelector: `p:nth-of-type(1)`,
      expectedSelectionEndSelector: panelSelectors.panel,
      // Selection ending in a different paragraph is probably unwanted behaviour, but we haven't fixed this yet.
      // This test is to document existing behaviour. Once fixed, update this test.
      expectedSelectionDescription: `from first paragraph above panel to first paragraph inside panel`,
    },

    // NOTE: The below test has been disabled as it requires custom logic for testing.
    // see see https://product-fabric.atlassian.net/browse/DSP-6360
    // {
    //   fixtureTableCellRow: 4,
    //   fixtureTableCellCol: 1,
    //   fixtureTableCellType: `cell`,
    //   // We hook into lower-level page.mouse.click path to try to avoid the scrollIntoViewIfNeeded puppeteer
    //   // path, which seems to cause flakiness errors (Node is detached from document)
    //   clickTargetClickPos: `top left`,
    //   clickTargetAdjustPx: 5,
    //   clickTargetSelector: `${codeBlockSelectors.codeBlock} code span:nth-of-type(2)`,
    //   clickTargetDescription: `first line in codeblock`,
    //   expectedSelectionStartSelector: `${codeBlockSelectors.codeBlock} code span:nth-of-type(2)`,
    //   expectedSelectionEndSelector: `${codeBlockSelectors.codeBlock} code span:nth-of-type(3)`,
    //   // Selection ending in the next line-number instead of in the same line of text is probably unwanted behaviour,
    //   // but we haven't fixed this yet. This test is to document existing behaviour. Once fixed, update this test.
    //   expectedSelectionDescription: `from line of codeblock to next line number of codeblock`,
    // },
    {
      fixtureTableCellRow: 4,
      fixtureTableCellCol: 1,
      fixtureTableCellType: `cell`,
      clickTargetSelector: codeBlockSelectors.codeBlock,
      // The last line in a codeblock is a standalone text node, so to select it we
      // have to indirectly target it by targeting the end edge of the entire codeblock element
      clickTargetClickPos: `bottom right`,
      clickTargetAdjustPx: -5,
      clickTargetDescription: `last line in codeblock`,
      expectedSelectionStartSelector: codeBlockSelectors.codeBlock,
      expectedSelectionEndSelector: codeBlockSelectors.codeBlock,
      // Selection moving to the whole codeblock instead of selecting just the target line of text
      // is probably unwanted behaviour, but we haven't fixed this yet.
      // This test is to document existing behaviour. Once fixed, update this test.
      expectedSelectionDescription: `from codeblock to codeblock`,
    },
    {
      fixtureTableCellRow: 4,
      fixtureTableCellCol: 2,
      fixtureTableCellType: `cell`,
      clickTargetSelector: ``,
      // We don't want to click the mediaSingle directly otherwise it will open up.
      // So instead we target the bottom right edge of the table cell to simulate "clicking"
      // in a cell that has media".
      clickTargetClickPos: `bottom right`,
      clickTargetAdjustPx: -5,
      clickTargetDescription: `nearby (outside) mediaSingle`,
      expectedSelectionStartSelector: `td`,
      expectedSelectionEndSelector: `td`,
      expectedSelectionDescription: `from table cell to table cell`,
    },
  ];

  beforeEach(async () => {
    await page.evaluate(() => {
      window.getSelection()?.removeAllRanges();
    });
  });

  testCases.forEach(
    ({
      fixtureTableCellRow,
      fixtureTableCellCol,
      fixtureTableCellType,
      clickTargetSelector,
      clickTargetClickPos,
      clickTargetAdjustPx,
      clickTargetDescription,
      expectedSelectionStartSelector,
      expectedSelectionEndSelector,
      expectedSelectionDescription,
      beforeClickTargetClick,
    }) => {
      // FIXME: This test was automatically skipped due to failure on 25/02/2023: https://product-fabric.atlassian.net/browse/ED-16993
      it.skip(`on triple-clicking ${clickTargetDescription} in table ${fixtureTableCellType} (row:${fixtureTableCellRow},col:${fixtureTableCellCol}), it should select ${expectedSelectionDescription} inside table cell`, async () => {
        await initRenderer(
          page,
          tableComplexSelectionsAdf,
          undefined,
          undefined,
          true,
          { height: 700, width: 700 },
        );

        await waitForLoadedBackgroundImages(page, emojiSelectors.standard);

        const tableCellSelector = `tr:nth-of-type(${fixtureTableCellRow}) ${
          fixtureTableCellType === 'header' ? 'th' : 'td'
        }:nth-of-type(${fixtureTableCellCol})`;
        const selector = `${tableCellSelector} ${clickTargetSelector}`;

        if (beforeClickTargetClick) {
          await beforeClickTargetClick(page);
        }

        const $elem = await page.waitForSelector(selector);

        if (clickTargetClickPos) {
          const rect = await getBoundingClientRect(page, selector);
          const px: number = clickTargetAdjustPx ?? 0;
          switch (clickTargetClickPos) {
            case `top left`: {
              await page.mouse.click(rect.left + px, rect.top + px, {
                clickCount: 3,
              });
              break;
            }
            case `bottom right`: {
              await page.mouse.click(rect.right + px, rect.bottom + px, {
                clickCount: 3,
              });
              break;
            }
            default: {
              await $elem?.click({ clickCount: 3 });
            }
          }
        } else {
          await $elem?.click({ clickCount: 3 });
          await page.waitForSelector(selector, { visible: true });
        }

        const {
          type,
          selectionStartsInTableCell,
          selectionEndsInTableCell,
          selectionStartsInExpectedSelection,
          selectionEndsInExpectedSelection,
        } = await page.evaluate(
          (
            tableCellSelector,
            expectedSelectionStartSelector,
            expectedSelectionEndSelector,
          ) => {
            const { type, anchorNode, focusNode } = window.getSelection() ?? {
              anchorNode: null,
              focusNode: null,
            };
            const tableCell = document.querySelector(tableCellSelector);
            const expectedSelectionStart = [`td`, `th`].includes(
              expectedSelectionStartSelector,
            )
              ? tableCell
              : tableCell?.querySelector(expectedSelectionStartSelector);
            const expectedSelectionEnd = [`td`, `th`].includes(
              expectedSelectionEndSelector,
            )
              ? tableCell
              : tableCell?.querySelector(expectedSelectionEndSelector);
            const selectionStartsInTableCell = tableCell?.contains(anchorNode);
            const selectionEndsInTableCell = tableCell?.contains(focusNode);
            const selectionStartsInExpectedSelection =
              expectedSelectionStart?.contains(anchorNode);
            const selectionEndsInExpectedSelection =
              expectedSelectionEnd?.contains(focusNode);

            return {
              type,
              selectionStartsInTableCell,
              selectionEndsInTableCell,
              selectionStartsInExpectedSelection,
              selectionEndsInExpectedSelection,
            };
          },
          tableCellSelector,
          expectedSelectionStartSelector,
          expectedSelectionEndSelector,
        );

        expect(type).toBe('Range');
        expect(selectionStartsInTableCell).toBe(true);
        expect(selectionEndsInTableCell).toBe(true);
        expect(selectionStartsInExpectedSelection).toBe(true);
        expect(selectionEndsInExpectedSelection).toBe(true);
      });
    },
  );

  /**
   * The below test is a replacement for the above test (which was disabled)
   * This is a result of the the line numbers changing to float left,
   * see https://product-fabric.atlassian.net/browse/DSP-6360
   *
   * The reason for this; window.getSelection() behaviour changes when content is floated. This causes "focusNode" to
   * return "last code line" text node, when previously it would return the line number 2 span.
   * The problem is the "last code line" is a text node and cannot be queried via selectors; and the 'expectedSelectionEndSelector' query
   * returns the same node (span line 2) regardless of whether it floats or not.
   */
  it(`on triple-clicking first line in codeblock in table cell (row: 4, col: 1), it should select from line of codeblock to next line number of codeblock inside table cell`, async () => {
    await initRenderer(
      page,
      tableComplexSelectionsAdf,
      undefined,
      undefined,
      true,
      { height: 700, width: 700 },
    );

    await waitForLoadedBackgroundImages(page, emojiSelectors.standard);

    const codeBlockSelector = `tr:nth-of-type(4) td:nth-of-type(1) ${codeBlockSelectors.codeBlock} code`;
    const rect = await getBoundingClientRect(
      page,
      `${codeBlockSelector} span:nth-of-type(2)`,
    );
    const px: number = 5;
    await page.mouse.click(rect.left + px, rect.top + px, {
      clickCount: 3,
    });

    const { collapsed, selectionInsideCodeBlock, selectionText } =
      await page.evaluate((selectorCodeBlock) => {
        // We'll use range here because it doesn't care about selection directionality.
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        const codeBlock = document.querySelector(selectorCodeBlock);

        return {
          collapsed: range?.collapsed,
          selectionInsideCodeBlock:
            range?.commonAncestorContainer === codeBlock ?? false,
          selectionText: selection?.toString(),
        };
      }, codeBlockSelector);

    expect(collapsed).toBe(false);
    expect(selectionInsideCodeBlock).toBe(true);
    // NOTE: the selection text ends with "2", even though what is actually selected on screen doesn't contain it.
    expect(selectionText).toBe('first code line\n2');
  });
});
