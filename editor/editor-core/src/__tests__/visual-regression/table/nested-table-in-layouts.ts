import {
  initFullPageEditorWithAdf,
  snapshot,
  Device,
  deviceViewPorts,
} from '../_utils';
import tableIn2ColAdf from './__fixtures__/table-in-2-col-layout.adf.json';
import { Page } from '../../__helpers/page-objects/_types';
import { messages } from '../../../plugins/layout/toolbar';
import { clickFirstCell } from '../../__helpers/page-objects/_table';
import { toggleBreakout } from '../../__helpers/page-objects/_layouts';
import {
  clickOnLayoutColumn,
  waitForLayoutToolbar,
} from '../../__helpers/page-objects/_layouts';

describe('Snapshot Test: Nested table inside layouts', () => {
  let page: Page;

  const { rightSidebar, leftSidebar, threeColumns } = messages;
  const layoutBtns = [
    rightSidebar.defaultMessage,
    leftSidebar.defaultMessage,
    threeColumns.defaultMessage,
  ];

  const initEditor = async (
    viewport: { height: number; width: number } = deviceViewPorts[
      Device.LaptopHiDPI
    ],
  ) => {
    await initFullPageEditorWithAdf(page, tableIn2ColAdf, undefined, viewport, {
      allowLayouts: { allowBreakout: true, UNSAFE_addSidebarLayouts: true },
      allowDynamicTextSizing: true,
    });
  };

  beforeAll(async () => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  // want one size above and one below dynamic text sizing breakpoint (1265px)
  [deviceViewPorts[Device.LaptopHiDPI], { width: 1260, height: 800 }].forEach(
    viewport => {
      describe(`${viewport.width}x${viewport.height}: resizing table when changing layout`, () => {
        beforeEach(async () => {
          await initEditor(viewport);
        });
        layoutBtns.forEach(layout => {
          const layoutBtnSelector = `[aria-label="${layout}"]`;

          it(`should resize when changing to ${layout}`, async () => {
            await clickOnLayoutColumn(page, 2);
            await waitForLayoutToolbar(page);
            await page.click(layoutBtnSelector);
            await clickFirstCell(page);
          });
        });
      });
    },
  );

  describe('breakout modes', () => {
    beforeEach(async () => {
      await initEditor();
      await clickFirstCell(page);
    });
    ['wide', 'full-width'].forEach((breakout, idx) => {
      it(`should display correctly for layout in ${breakout} breakout mode`, async () => {
        await toggleBreakout(page, idx + 1);
        await clickFirstCell(page);
      });
    });
  });

  it('should display correctly when columns are stacked', async () => {
    await initEditor({ width: 768, height: 600 });
    await clickFirstCell(page);
  });
});
