// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import tableInExtAdf from './__fixtures__/nested-table-inside-bodied-ext.adf.json';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { clickFirstCell } from '@atlaskit/editor-test-helpers/page-objects/table';
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
