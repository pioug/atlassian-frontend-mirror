import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import WebdriverPage from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import {
  clickFirstCell,
  tableSelectors,
} from '../../../../__tests__/__helpers/page-objects/_table';
import {
  expectToMatchSelection,
  editable,
  getDocFromElement,
  animationFrame,
} from '../../../../__tests__/integration/_helpers';
import { clickTaskNth } from '../../../../__tests__/__helpers/page-objects/_task';
import { clickNthDecision } from '../../../../__tests__/__helpers/page-objects/_decision';
import { fullpage } from '../../../../__tests__/integration/_helpers';
import taskListTableAdf from '../__fixtures__/tasklist-in-table-adf.json';
import decisionListInTableAdf from '../__fixtures__/decisionlist-in-table-adf.json';
import { retryUntilStablePosition } from '../../../../__tests__/__helpers/page-objects/_toolbar';

const initEditor = async (page: WebdriverPage, adf: Object) =>
  await mountEditor(page, {
    appearance: fullpage.appearance,
    defaultValue: adf,
    allowTables: {},
    allowNestedTasks: true,
  });

// Chrome webdriver holds shift down, whilst firefox and edge just press it
const subsequentShiftTab = async (page: WebdriverPage) => {
  if (page.isBrowser('chrome')) {
    await page.keys(['Tab']);
  } else {
    await page.keys(['Shift', 'Tab'], true);
  }
};

// ALl tests skipped in safari as webdriver was encountering session termination issues
BrowserTestCase(
  'keymap.ts: tabbing from the first taskItem in a tableCell should go to the next cell',
  { skip: ['safari'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await initEditor(page, taskListTableAdf);

    await clickTaskNth(page, 1);
    await page.keys(['Tab']);
    await animationFrame(page);
    await expectToMatchSelection(page, {
      type: 'text',
      from: 62,
      to: 66,
    });
  },
);

BrowserTestCase(
  'keymap.ts: shift+tab from the first taskItem in a tableCell should go to the previous cell',
  { skip: ['safari'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await initEditor(page, taskListTableAdf);

    await clickTaskNth(page, 1);
    await page.keys(['Shift', 'Tab'], true);
    await animationFrame(page);
    await expectToMatchSelection(page, {
      type: 'text',
      from: 18,
      to: 22,
    });

    if (page.isBrowser('chrome')) {
      // unpress shift for the next test
      await page.keys(['Shift']);
    }
  },
);

BrowserTestCase(
  'keymap.ts: tab and shift+tab respectively indent and unident subsequent actionItems in a table',
  { skip: ['safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await initEditor(page, taskListTableAdf);

    // tab to indent
    await clickTaskNth(page, 2);
    await page.keys(['Tab']);
    await animationFrame(page);
    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(`${testName}:indent`);

    // shift + tab to unindent
    await page.keys(['Shift', 'Tab'], true);
    await animationFrame(page);
    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(`${testName}:unindent`);

    if (page.isBrowser('chrome')) {
      // unpress shift for the next test
      await page.keys(['Shift']);
    }
  },
);

BrowserTestCase(
  'keymap.ts: can tab back and forth through a table cell containing a taskList',
  { skip: ['safari'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await initEditor(page, taskListTableAdf);

    await clickFirstCell(page, true);
    // need to wait for cursor to be stable in the cell
    await retryUntilStablePosition(
      page,
      async () => {
        await page.waitForSelector(tableSelectors.contextualMenuButton);
      },
      tableSelectors.contextualMenuButton,
    );

    // tab forward
    await page.keys(['Tab']);
    await animationFrame(page);
    await page.keys(['Tab']);
    await animationFrame(page);
    await expectToMatchSelection(page, {
      type: 'text',
      from: 62,
      to: 66,
    });

    // tab backward
    await page.keys(['Shift', 'Tab'], true);
    await animationFrame(page);
    await subsequentShiftTab(page);
    await animationFrame(page);
    await expectToMatchSelection(page, {
      type: 'text',
      from: 18,
      to: 22,
    });

    if (page.isBrowser('chrome')) {
      // unpress shift for the next test
      await page.keys(['Shift']);
    }
  },
);

BrowserTestCase(
  'keymap.ts: tabbing from any decisionItem in a tableCell should go to the next cell',
  { skip: ['safari'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await initEditor(page, decisionListInTableAdf);

    await clickNthDecision(page, 1);
    await page.keys(['Tab']);
    await animationFrame(page);
    await expectToMatchSelection(page, {
      type: 'text',
      from: 64,
      to: 68,
    });

    await clickNthDecision(page, 2);
    await page.keys(['Tab']);
    await animationFrame(page);
    await expectToMatchSelection(page, {
      type: 'text',
      from: 64,
      to: 68,
    });
  },
);

BrowserTestCase(
  'keymap.ts: shift+tabbing from any decisionItem in a tableCell should go to the previous cell',
  { skip: ['safari'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await initEditor(page, decisionListInTableAdf);

    await clickNthDecision(page, 1);
    await page.keys(['Shift', 'Tab'], true);
    await animationFrame(page);
    await expectToMatchSelection(page, {
      type: 'text',
      from: 18,
      to: 22,
    });

    await clickNthDecision(page, 2);
    await subsequentShiftTab(page);
    await animationFrame(page);
    await expectToMatchSelection(page, {
      type: 'text',
      from: 18,
      to: 22,
    });

    if (page.isBrowser('chrome')) {
      // unpress shift for the next test
      await page.keys(['Shift']);
    }
  },
);

BrowserTestCase(
  'keymap.ts: can tab back and forth through a table cell containing a decisionList',
  { skip: ['safari'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await initEditor(page, decisionListInTableAdf);

    await clickFirstCell(page, true);
    // need to wait for cursor to be stable in the cell
    await retryUntilStablePosition(
      page,
      async () => {
        await page.waitForSelector(tableSelectors.contextualMenuButton);
      },
      tableSelectors.contextualMenuButton,
    );

    // tab forward
    await page.keys(['Tab']);
    await animationFrame(page);
    await page.keys(['Tab']);
    await animationFrame(page);
    await expectToMatchSelection(page, {
      type: 'text',
      from: 64,
      to: 68,
    });

    // tab backward
    await page.keys(['Shift', 'Tab'], true);
    await animationFrame(page);
    await subsequentShiftTab(page);
    await animationFrame(page);
    await expectToMatchSelection(page, {
      type: 'text',
      from: 18,
      to: 22,
    });
  },
);
