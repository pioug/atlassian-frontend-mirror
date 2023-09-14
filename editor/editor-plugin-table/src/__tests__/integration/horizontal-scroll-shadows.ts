// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  fullpage,
  resizeColumn,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import type WebdriverPage from '@atlaskit/webdriver-runner/wd-wrapper';

import { TableCssClassName as className } from '../../plugins/table/types';

import basicTable from './__fixtures__/basic-table';

const checkShadows = async (page: WebdriverPage, side?: 'left' | 'right') => {
  const leftShadow = await page.$(`.${className.TABLE_LEFT_SHADOW}`);
  const rightShadow = await page.$(`.${className.TABLE_RIGHT_SHADOW}`);

  if (!side) {
    const leftDisplayed = await leftShadow.isDisplayed();
    const rightDisplayed = await rightShadow.isDisplayed();
    return leftDisplayed && rightDisplayed;
  } else if (side === 'left') {
    return await leftShadow.isDisplayed();
  } else if (side === 'right') {
    return await rightShadow.isDisplayed();
  }
};

BrowserTestCase(
  'Table does not show horizontal scroll shadows when there is no scrollbar',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(basicTable),
      allowTables: {
        advanced: true,
      },
    });

    await page.waitForSelector('table');
    expect(await checkShadows(page)).toBeFalsy();
  },
);

BrowserTestCase(
  'Table shows right shadow when table is scrollable and all the way to the left',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(basicTable),
      allowTables: {
        advanced: true,
      },
    });

    await page.waitForSelector('table');
    await resizeColumn(page, { cellHandlePos: 2, resizeWidth: 1000 });

    expect(await checkShadows(page, 'right')).toBeTruthy();
  },
);

BrowserTestCase(
  'Table should not show left shadow when table is scrollable and all the way to the left',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(basicTable),
      allowTables: {
        advanced: true,
      },
    });

    await page.waitForSelector('table');
    await resizeColumn(page, { cellHandlePos: 2, resizeWidth: 1000 });

    expect(await checkShadows(page, 'left')).toBeFalsy();
  },
);

BrowserTestCase(
  'Table should show both left and right shadows when table is scrollable and scrolled',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(basicTable),
      allowTables: {
        advanced: true,
      },
    });

    await page.waitForSelector('table');
    await resizeColumn(page, { cellHandlePos: 2, resizeWidth: 1000 });
    await page.evaluate(() => {
      const tableWrapper =
        document.querySelector<HTMLElement>('.pm-table-wrapper');
      if (tableWrapper) {
        tableWrapper.scrollLeft += 500;
      }
      return tableWrapper;
    });

    expect(await checkShadows(page)).toBeTruthy();
  },
);

BrowserTestCase(
  'Table should not show right shadow when table is scrollable and scrolled all the way to the right',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(basicTable),
      allowTables: {
        advanced: true,
      },
    });

    await page.waitForSelector('table');
    await resizeColumn(page, { cellHandlePos: 2, resizeWidth: 1000 });
    await page.evaluate(() => {
      const tableWrapper =
        document.querySelector<HTMLElement>('.pm-table-wrapper');
      if (tableWrapper) {
        tableWrapper.scrollLeft += 1000;
      }
      return tableWrapper;
    });

    expect(await checkShadows(page, 'right')).toBeFalsy();
  },
);

BrowserTestCase(
  'Table should show left shadow when table is scrollable and scrolled all the way to the right',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(basicTable),
      allowTables: {
        advanced: true,
      },
    });

    await page.waitForSelector('table');
    await resizeColumn(page, { cellHandlePos: 2, resizeWidth: 1000 });
    await page.evaluate(() => {
      const tableWrapper =
        document.querySelector<HTMLElement>('.pm-table-wrapper');
      if (tableWrapper) {
        tableWrapper.scrollLeft += 1000;
      }
      return tableWrapper;
    });

    expect(await checkShadows(page, 'left')).toBeTruthy();
  },
);
