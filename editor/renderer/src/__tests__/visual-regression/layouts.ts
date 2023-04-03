import {
  PuppeteerPage,
  waitForLoadedBackgroundImages,
} from '@atlaskit/visual-regression/helper';
import { snapshot, initRendererWithADF, waitForText } from './_utils';
import * as layoutWithDefaultBreakoutMark from '../__fixtures__/layout-default-breakout.adf.json';
import * as layout2Col from '../__fixtures__/layout-2-columns.adf.json';
import * as layout3Col from '../__fixtures__/layout-3-columns.adf.json';
import * as layoutLeftSidebar from '../__fixtures__/layout-left-sidebar.adf.json';
import * as layoutRightSidebar from '../__fixtures__/layout-right-sidebar.adf.json';
import * as layout3ColWithSidebars from '../__fixtures__/layout-3-columns-with-sidebars.adf.json';
import * as layoutWithDifferentColumnChildren from '../__fixtures__/layout-with-different-column-children.adf.json';

import { emojiSelectors } from '../__helpers/page-objects/_emoji';
import { selectors as mentionSelectors } from '../__helpers/page-objects/_mention';
import { selectors as rendererSelectors } from '../__helpers/page-objects/_renderer';

const initRenderer = async (
  page: PuppeteerPage,
  adf: any,
  viewport?: { width?: number; height?: number },
  options?: { darkMode?: boolean },
) => {
  await initRendererWithADF(page, {
    appearance: 'full-page',
    viewport: { width: 1040, height: 700, ...viewport },
    adf,
    themeMode: options?.darkMode ? 'dark' : 'light',
  });
};

describe('Snapshot Test: Layouts', () => {
  let page: PuppeteerPage;

  const layouts = [
    { name: '2 columns', adf: layout2Col },
    { name: '3 columns', adf: layout3Col },
    { name: 'left sidebar', adf: layoutLeftSidebar },
    { name: 'right sidebar', adf: layoutRightSidebar },
    { name: '3 columns with sidebars', adf: layout3ColWithSidebars },
  ];

  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await page.waitForSelector(rendererSelectors.document);
    await snapshot(page);
  });

  describe('Columns', () => {
    layouts.forEach((layout) => {
      it(`should correctly render "${layout.name}" layout`, async () => {
        // Wait for action list (within ADF) to render
        await initRenderer(page, layout.adf);
        await page.waitForSelector('div[data-task-list-local-id] > div');
        const taskItemSelector =
          'div[data-task-list-local-id] div[data-renderer-start-pos]';
        await waitForText(page, taskItemSelector, 'item one');
      });
    });

    describe('spacing', () => {
      it(`should correctly reset/clear top margins of first nested elements of each layout column`, async () => {
        await initRenderer(page, layoutWithDifferentColumnChildren, {
          height: 1000,
        });
        await page.waitForSelector(emojiSelectors.standard);
        await waitForText(
          page,
          mentionSelectors.mentionContainer,
          '@Verdie Carrales',
        );
      });
    });
  });

  describe('Dark layout', () => {
    it(`should correctly render 2 column layout`, async () => {
      const layout = layouts[0];
      // Wait for action list (within ADF) to render
      await initRenderer(page, layout.adf, undefined, { darkMode: true });
      await page.waitForSelector('div[data-task-list-local-id] > div');
      const taskItemSelector =
        'div[data-task-list-local-id] div[data-renderer-start-pos]';
      await waitForText(page, taskItemSelector, 'item one');
    });
  });

  describe('Breakout Mark', () => {
    it(`should correctly render three column layout with a default breakout mark`, async () => {
      await initRenderer(page, layoutWithDefaultBreakoutMark);
      await waitForLoadedBackgroundImages(page, emojiSelectors.standard, 10000);
    });
  });
});
