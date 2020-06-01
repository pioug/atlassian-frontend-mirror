import {
  snapshot,
  initEditorWithAdf,
  Appearance,
  getContentBoundingRectTopLeftCoords,
} from '../_utils';
import { Page } from '../../__helpers/page-objects/_types';
import { layoutSelectors } from '../../__helpers/page-objects/_layouts';
import * as col2 from './__fixtures__/column2-adf.json';
import * as col3 from './__fixtures__/column3-adf.json';
import * as layoutWithAction from './__fixtures__/layout-with-action-adf.json';
import * as colLeftSidebar from './__fixtures__/columnLeftSidebar-adf.json';
import * as colRightSidebar from './__fixtures__/columnRightSidebar-adf.json';
import * as col3WithSidebars from './__fixtures__/column3WithSidebars-adf.json';

describe('Layouts:', () => {
  let page: Page;

  const layouts = [
    { name: '2 columns', adf: col2 },
    { name: '3 columns', adf: col3 },
    { name: 'left sidebar', adf: colLeftSidebar },
    { name: 'right sidebar', adf: colRightSidebar },
    { name: '3 columns with sidebars', adf: col3WithSidebars },
  ];

  const smallViewport = { width: 768, height: 400 };
  const largeViewport = { width: 1040, height: 400 };

  const initEditor = async (
    adf: Object,
    viewport: { width: number; height: number },
  ) =>
    initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf,
      viewport,
      editorProps: {
        allowLayouts: { allowBreakout: true, UNSAFE_addSidebarLayouts: true },
      },
    });

  beforeAll(async () => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  layouts.forEach(layout => {
    describe(layout.name, () => {
      it('should correctly render layout on laptop', async () => {
        await initEditor(layout.adf, largeViewport);
        await page.click(layoutSelectors.column);
      });

      it('should stack layout on smaller screen', async () => {
        await initEditor(layout.adf, smallViewport);
        await page.click(layoutSelectors.column);
      });
    });
  });

  it('should actions placeholder not overflow the layout', async () => {
    await initEditor(layoutWithAction, largeViewport);
    await page.click(layoutSelectors.column);
  });

  it('should display as selected when clicked on', async () => {
    await initEditor(col2, largeViewport);
    const contentBoundingRect = await getContentBoundingRectTopLeftCoords(
      page,
      layoutSelectors.section,
    );
    await page.mouse.click(contentBoundingRect.left, contentBoundingRect.top);
  });
});
