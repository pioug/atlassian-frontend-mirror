import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import tableInExtAdf from './__fixtures__/nested-table-inside-bodied-ext.adf.json';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { clickFirstCell } from '../../../__tests__/__helpers/page-objects/_table';
import messages from '../../../messages';

describe('Snapshot Test: Nested table inside bodied extension', () => {
  let page: PuppeteerPage;

  const breakoutModes = [
    { name: 'default', label: messages.layoutFixedWidth.defaultMessage },
    { name: 'wide', label: messages.layoutWide.defaultMessage },
    { name: 'full-width', label: messages.layoutFullWidth.defaultMessage },
  ];

  const initEditor = async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf: tableInExtAdf,
      viewport: { width: 1280, height: 500 },
      editorProps: { allowDynamicTextSizing: true },
    });
  };

  beforeAll(async () => {
    page = global.page;
  });

  beforeEach(async () => {
    await initEditor();
  });

  afterEach(async () => {
    await snapshot(page);
  });

  // TODO: UNSKIP
  describe.skip('resizing table when changing breakout mode', () => {
    breakoutModes.forEach((breakout) => {
      it(`should resize when changing to ${breakout.name} layout`, async () => {
        const layoutBtnSelector = `[aria-label="${breakout.label}"]`;
        await page.waitForSelector(layoutBtnSelector);
        await page.click(layoutBtnSelector);
        await clickFirstCell(page, true);
      });
    });
  });
});
