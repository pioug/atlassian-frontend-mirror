import { waitForTooltip } from '@atlaskit/visual-regression/helper';
import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import adf from './__fixtures__/nested-elements.adf.json';
import {
  tableSelectors,
  clickFirstCell,
} from '../../__helpers/page-objects/_table';
import { animationFrame } from '../../__helpers/page-objects/_editor';
import { EditorTestCardProvider } from '@atlaskit/editor-test-helpers/card-provider';

import * as selectionPanelAdf from './__fixtures__/selection-panel-adf.json';
import * as selectionLayoutAdf from './__fixtures__/selection-layout-adf.json';

/*
When importing this ADF from a file using
`import * as selectionUnsupportedBlock from './__fixtures__/file.json';`

the unsupported block doesn't appear. The `default` key apppears in the JSON and there
appears to be an issue in the validater where it fails if there are 2 errors.

https://product-fabric.atlassian.net/browse/ED-9643
*/
const selectionUnsupportedBlock = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'text before panel',
        },
      ],
    },
    {
      type: 'notapanel',
      attrs: {
        panelType: 'info',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'text in panel',
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'text after panel',
        },
      ],
    },
  ],
};

const selectionUnsupportedInline = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'before ',
        },
        {
          type: 'notanemoji',
          attrs: {
            shortName: ':slight_smile:',
            id: '1f642',
            text: '🙂',
          },
        },
        {
          type: 'text',
          text: ' after',
        },
      ],
    },
  ],
};

const selectionUnsupportedInlineInPanel = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'panel',
      attrs: {
        panelType: 'info',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'before ',
            },
            {
              type: 'notanemoji',
              attrs: {
                shortName: ':grinning:',
                id: '1f600',
                text: '😀',
              },
            },
            {
              type: 'text',
              text: ' after',
            },
          ],
        },
      ],
    },
  ],
};

const selectionUnsupportedBlockInExpand = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'expand',
      attrs: {
        title: '',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'before',
            },
          ],
        },
        {
          type: '1panel',
          attrs: {
            panelType: 'info',
          },
          content: [
            {
              type: 'paragraph',
              content: [],
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

import { Page } from '../../__helpers/page-objects/_types';
import {
  PanelSharedCssClassName,
  PanelSharedSelectors,
} from '@atlaskit/editor-common';
import { mentionSelectors } from '../../__helpers/page-objects/_mention';
import { layoutSelectors } from '../../__helpers/page-objects/_layouts';
import { unsupportedNodeSelectors } from '../../__helpers/page-objects/_unsupported';
import { waitForResolvedInlineCard } from '../../__helpers/page-objects/_cards';

describe('Danger for nested elements', () => {
  let page: any;
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
          UNSAFE_cards: { provider: Promise.resolve(cardProvider) },
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

describe('Selection:', () => {
  let page: Page;

  describe('Panel', () => {
    beforeAll(() => {
      page = global.page;
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: selectionPanelAdf,
        viewport: { width: 400, height: 320 },
      });
    });

    afterEach(async () => {
      await page.waitForSelector(PanelSharedSelectors.removeButton);
      await page.hover(PanelSharedSelectors.removeButton);
      await page.waitForSelector(`.${PanelSharedCssClassName.prefix}.danger`);
      await waitForTooltip(page);
      await snapshot(page);
    });

    it('displays danger styling when node is selected', async () => {
      await page.click(`.${PanelSharedCssClassName.icon}`);
    });

    it('displays danger styling when child node is selected', async () => {
      await page.click(mentionSelectors.mention);
    });
  });

  describe('Layout', () => {
    beforeAll(() => {
      page = global.page;
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: selectionLayoutAdf,
        viewport: { width: 1040, height: 400 },
      });
    });

    afterEach(async () => {
      await page.waitForSelector(layoutSelectors.removeButton);
      await page.hover(layoutSelectors.removeButton);
      await page.waitForSelector(`[data-layout-section].danger`);
      await waitForTooltip(page);
      await snapshot(page);
    });

    it('displays danger styling when node is selected', async () => {
      await page.click(layoutSelectors.column);
    });

    it('displays danger styling when child node is selected', async () => {
      await page.click(mentionSelectors.mention);
    });
  });
  describe('Unsupported block', () => {
    beforeAll(() => {
      page = global.page;
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: selectionUnsupportedBlock,
        viewport: { width: 1040, height: 400 },
      });
    });

    afterEach(async () => {
      await snapshot(page);
    });

    it('displays selection when node is clicked', async () => {
      await page.waitForSelector(unsupportedNodeSelectors.unsupportedBlock);
      await page.click(unsupportedNodeSelectors.unsupportedBlock);
    });
    it('deletes selected node with backspace', async () => {
      await page.waitForSelector(unsupportedNodeSelectors.unsupportedBlock);
      await page.click(unsupportedNodeSelectors.unsupportedBlock);
      await page.keyboard.press('Backspace');
    });
    it('deletes selected node with typing', async () => {
      await page.waitForSelector(unsupportedNodeSelectors.unsupportedBlock);
      await page.click(unsupportedNodeSelectors.unsupportedBlock);
      await page.keyboard.type('replaced');
    });
  });
  describe('Unsupported Inline', () => {
    beforeAll(() => {
      page = global.page;
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: selectionUnsupportedInline,
        viewport: { width: 1040, height: 400 },
      });
    });

    afterEach(async () => {
      await snapshot(page);
    });

    it('displays selection when inline node is clicked', async () => {
      await page.waitForSelector(unsupportedNodeSelectors.unsupportedInline);
      await page.click(unsupportedNodeSelectors.unsupportedInline);
    });
    it('deletes selected node with backspace', async () => {
      await page.waitForSelector(unsupportedNodeSelectors.unsupportedInline);
      await page.click(unsupportedNodeSelectors.unsupportedInline);
      await page.keyboard.press('Backspace');
    });
    it('deletes selected node with typing', async () => {
      await page.waitForSelector(unsupportedNodeSelectors.unsupportedInline);
      await page.click(unsupportedNodeSelectors.unsupportedInline);
      await page.keyboard.type('replaced');
    });
  });
  describe('Unsupported Inline inside Panel', () => {
    beforeAll(() => {
      page = global.page;
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: selectionUnsupportedInlineInPanel,
        viewport: { width: 1040, height: 400 },
      });
    });

    afterEach(async () => {
      await waitForTooltip(page);
      await snapshot(page);
    });

    it('displays red border when selected and panel about to be deleted', async () => {
      await page.waitForSelector(unsupportedNodeSelectors.unsupportedInline);
      await page.click(unsupportedNodeSelectors.unsupportedInline);
      await snapshot(page);
      await page.waitForSelector(PanelSharedSelectors.removeButton);
      await page.hover(PanelSharedSelectors.removeButton);
    });
    it(`doesn't display red border when not selected and panel about to be deleted`, async () => {
      await page.waitForSelector(unsupportedNodeSelectors.unsupportedInline);
      await page.click(`.${PanelSharedCssClassName.icon}`);
      await page.waitForSelector(PanelSharedSelectors.removeButton);
      await page.hover(PanelSharedSelectors.removeButton);
    });
  });
  describe('Unsupported Block inside Expand', () => {
    beforeAll(() => {
      page = global.page;
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: selectionUnsupportedBlockInExpand,
        viewport: { width: 1040, height: 400 },
      });
    });

    afterEach(async () => {
      await waitForTooltip(page);
      await snapshot(page);
    });

    it('displays red border when selected and panel about to be deleted', async () => {
      await page.waitForSelector(unsupportedNodeSelectors.unsupportedBlock);
      await page.click(unsupportedNodeSelectors.unsupportedBlock);
      await snapshot(page);
      await page.waitForSelector(`button[aria-label="Remove"]`);
      await page.hover(`button[aria-label="Remove"]`);
    });
    it(`doesn't display red border when not selected and panel about to be deleted`, async () => {
      await page.click(`.ak-editor-expand p`);
      await page.waitForSelector(`button[aria-label="Remove"]`);
      await page.hover(`button[aria-label="Remove"]`);
    });
  });
});
