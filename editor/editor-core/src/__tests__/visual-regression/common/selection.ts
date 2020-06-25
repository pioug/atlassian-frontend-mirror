import { waitForTooltip } from '@atlaskit/visual-regression/helper';
import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import adf from './__fixtures__/nested-elements.adf.json';
import {
  tableSelectors,
  clickFirstCell,
} from '../../__helpers/page-objects/_table';
import { animationFrame } from '../../__helpers/page-objects/_editor';
import { EditorTestCardProvider } from '@atlaskit/editor-test-helpers/card-provider';

import * as selectionAdf from './__fixtures__/selection-adf.json';
import { Page } from '../../__helpers/page-objects/_types';
import {
  PanelSharedCssClassName,
  PanelSharedSelectors,
} from '@atlaskit/editor-common';
import { mentionSelectors } from '../../__helpers/page-objects/_mention';

// TODO: https://product-fabric.atlassian.net/browse/ED-7721
describe.skip('Danger for nested elements', () => {
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

  beforeAll(() => {
    page = global.page;
  });

  beforeEach(async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf: selectionAdf,
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
