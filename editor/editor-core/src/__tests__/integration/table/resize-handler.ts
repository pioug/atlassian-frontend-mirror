import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { fullpage, quickInsert, hoverResizeHandler } from '../_helpers';
import {
  clickFirstCell,
  getSelectorForTableCell,
} from '../../__helpers/page-objects/_table';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';

interface BBoxWithId {
  left: number;
  top: number;
  width: number;
  height: number;
  id: string;
}

function calcOffset(
  element: 'start' | 'target',
  side: 'left' | 'top',
  rect: BBoxWithId,
): number {
  if (element === 'target' && side === 'left') {
    return -(rect.width / 2);
  } else if (element === 'start' && side === 'left') {
    return +(rect.width * 0.8);
  }

  return 0;
}

/*
 * This is a regression test.
 *
 * The goal of this test is to make sure
 * we can resize the table after a CellSelectio, and here is the why:
 *
 *
 * Given this cell A1
 *
 * ```
 *    ▁▁▁▁▁▁▁▁▁▁▁▁▁
 *   |           ▒▒|
 *   |     A1    ▒▒|
 *   |           ▒▒|
 *    ▔▔▔▔▔▔▔▔▔▔▔▔▔
 * ```
 *
 * This element is a div, and every time the user hovers it, we should display a resize line.
 * However, keeping a div for each cell in a table increases the HTML a lot,
 * resulting in performance degradation to any DOM diff action.
 * To avoid that, we decided to add the div on demand.
 * Then, when the user comes close to that gap, we added a DIV.
 * Next, we needed to check if the handle was already there using the resizeHandleColumnIndex from the PluginState.
 * However, if that state was not clean properly, we could end up not adding the DIV element,
 * then the user could not resize the column until they hover another one.
 *
 * We solved this problem search for the decorations too: if the DIV is not there, we will add it.
 */
BrowserTestCase(
  'Should display the resizer handler after a cellselection',
  // We are skipping other browsers because this test relies on drag and drop,
  // and this API isn't stable in other browsers
  { skip: ['firefox', 'edge', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {
        advanced: true,
      },
    });
    await quickInsert(page, 'Table');

    await clickFirstCell(page);

    const firstCell = getSelectorForTableCell({
      row: 2,
      cell: 1,
    });
    const lastCell = getSelectorForTableCell({ row: 2, cell: 2 });
    await hoverResizeHandler(page, 2, 1);

    await page.simulateUserSelection(firstCell, lastCell, calcOffset);

    // if it is not possible to resize this method will fail
    await hoverResizeHandler(page, 2, 1);

    expect(true).toBe(true);
  },
);
