import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  animationFrame,
  initRendererWithADF,
  snapshot,
  waitForText,
} from './_utils';
import * as wideTableResized from '../__fixtures__/table-wide-resized.adf.json';
import * as tableWithShadowAdf from '../__fixtures__/table-with-shadow.adf.json';
import * as tableWithWrappedNodesAdf from './__fixtures__/table-with-wrapped-nodes.adf.json';
import { RendererAppearance } from '../../ui/Renderer/types';
import { THEME_MODES } from '@atlaskit/theme/constants';

const tableContainerSelector = '.pm-table-container';

async function waitForTableWithCards(page: PuppeteerPage) {
  await page.waitForSelector(tableContainerSelector);
}

const waitForMinimumTableSize = (
  page: PuppeteerPage,
  width: number,
  height: number,
) =>
  page.waitForFunction(
    (selector: string, width: number, height: number) => {
      const table = document.querySelector(selector);
      if (table) {
        const rect = table.getBoundingClientRect();
        return rect.width >= width && rect.height >= height;
      }
    },
    {},
    tableContainerSelector,
    width,
    height,
  );

const initRenderer = async (
  page: PuppeteerPage,
  adf: any,
  mode?: 'light' | 'dark',
  appearance: RendererAppearance = 'full-page',
) => {
  await initRendererWithADF(page, {
    appearance,
    viewport: { width: 1485, height: 1175 },
    adf,
    themeMode: mode,
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
      await initRenderer(page, wideTableResized, mode);
      await waitForTableWithCards(page);
      await page.waitForSelector(
        '#renderer-container [data-testid="inline-card-resolved-view"]',
      );
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
      // ED-10446: If we assume that the table is occasionally
      // not given enough time to render and scale out to it's
      // layout in the viewport, this should resolve flakiness.
      // If instead, the tests fail with timeouts, then the
      // issue has not been resolved.
      await waitForMinimumTableSize(page, 750, 880);
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
