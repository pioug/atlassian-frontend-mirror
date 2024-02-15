// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { clickFirstCell } from '@atlaskit/editor-test-helpers/page-objects/table';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import messages from '../../../messages';

import tableInExtAdf from './__fixtures__/nested-table-inside-bodied-ext.adf.json';

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

  describe('resizing table when changing breakout mode', () => {
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
