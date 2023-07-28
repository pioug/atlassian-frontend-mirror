import {
  MobileTestCase,
  DynamicMobileTestSuite,
  getDynamicMobileTestCase,
} from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import {
  lightModeStatusColorPalette,
  PaletteColor,
} from '@atlaskit/editor-core';
import { getDummyBridgeCalls } from '../../../integration/_utils';
import adfContent from '../../__fixtures__/panel-date-status-adf.json';
import {
  StatusSharedCssClassName,
  DateSharedCssClassName,
  TableSharedCssClassName,
} from '@atlaskit/editor-common/styles';
import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
import { loadEditor } from '../../_page-objects/hybrid-editor-page';

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

const buildInitialStatusLozengeToolbarItems = (color: PaletteColor) => [
  {
    id: 'editor.status.editText',
    type: 'button',
    title: 'Edit Status',
    showTitle: true,
    key: '0',
  },
  {
    type: 'separator',
  },
  {
    id: 'editor.status.colorPicker',
    type: 'select',
    selectType: 'color',
    title: 'Edit Status Color',
    defaultValue: color,
    options: [
      {
        label: 'neutral',
        value: '#DFE1E6',
        border: '#505F79',
        key: '2.0',
      },
      {
        label: 'purple',
        value: '#EAE6FF',
        border: '#5243AA',
        key: '2.1',
      },
      {
        label: 'blue',
        value: '#DEEBFF',
        border: '#0052CC',
        key: '2.2',
      },
      {
        label: 'red',
        value: '#FFEBE6',
        border: '#DE350B',
        key: '2.3',
      },
      {
        label: 'yellow',
        value: '#FFF0B3',
        border: '#FF991F',
        key: '2.4',
      },
      {
        label: 'green',
        value: '#E3FCEF',
        border: '#00875A',
        key: '2.5',
      },
    ],
    key: '2',
  },
  {
    type: 'separator',
  },
  {
    id: 'editor.status.delete',
    type: 'button',
    title: 'Remove',
    key: '4',
    iconName: 'EditorRemoveIcon',
  },
];

const buildInitialStatusToolbarItems = () => [
  {
    id: 'editor.status.editText',
    key: '0',
    placeholder: 'Set a status',
    title: 'Edit Status',
    type: 'input',
  },
];

const buildEditTextStatusToolbarItems = (text: string) => [
  {
    id: 'editor.status.editText',
    type: 'input',
    placeholder: 'Set a status',
    title: 'Edit Status',
    defaultValue: text,
    key: '0',
  },
];

const buildInitialDateToolbarItems = (date: string) => [
  {
    id: 'editor.date.datePicker',
    type: 'select',
    selectType: 'date',
    options: [],
    defaultValue: date,
    title: 'Edit Date',
    key: '0',
  },
  {
    type: 'separator',
  },
  {
    id: 'editor.date.delete',
    type: 'button',
    title: 'Remove',
    iconName: 'EditorRemoveIcon',
    key: '2',
  },
];

const buildInitialTableToolbarItems = () => [
  {
    id: 'editor.table.tableOptions',
    type: 'dropdown',
    title: 'Table options',
    hidden: false,
    options: [
      {
        id: 'editor.table.headerRow',
        title: 'Header row',
        selected: true,
        hidden: false,
        key: '0.0',
      },
      {
        id: 'editor.table.headerColumn',
        title: 'Header column',
        selected: false,
        hidden: false,
        key: '0.1',
      },
      {
        id: 'editor.table.numberedColumn',
        title: 'Numbered column',
        selected: false,
        hidden: false,
        key: '0.2',
      },
      {
        disabled: true,
        hidden: true,
        id: 'editor.table.collapseTable',
        key: '0.3',
        selected: false,
        title: 'Collapse table',
      },
    ],
    key: '0',
  },
  {
    type: 'separator',
    hidden: false,
  },
  {
    id: 'editor.table.cellOptions',
    type: 'dropdown',
    title: 'Cell options',
    options: [
      {
        id: 'editor.table.insertColumn',
        title: 'Insert column right',
        selected: false,
        disabled: false,
        key: '2.0',
      },
      {
        id: 'editor.table.insertRow',
        title: 'Insert row below',
        selected: false,
        disabled: false,
        key: '2.1',
      },
      {
        id: 'editor.table.removeColumns',
        title: 'Delete column',
        selected: false,
        disabled: false,
        key: '2.2',
      },
      {
        id: 'editor.table.removeRows',
        title: 'Delete row',
        selected: false,
        disabled: false,
        key: '2.3',
      },
      {
        id: 'editor.table.mergeCells',
        title: 'Merge cells',
        selected: false,
        disabled: true,
        key: '2.4',
      },
      {
        id: 'editor.table.splitCell',
        title: 'Split cell',
        selected: false,
        disabled: true,
        key: '2.5',
      },
      // {
      //   id: 'editor.table.distributeColumns',
      //   title: 'Distribute columns',
      //   selected: false,
      //   disabled: true,
      //   key: '2.6',
      // },
      {
        id: 'editor.table.clearCells',
        title: 'Clear cell',
        selected: false,
        disabled: false,
        key: '2.6',
      },
    ],
    key: '2',
  },
  {
    type: 'separator',
  },
  {
    id: 'editor.table.delete',
    type: 'button',
    appearance: 'danger',
    disabled: false,
    title: 'Remove',
    key: '4',
    iconName: 'EditorRemoveIcon',
  },
];

const buildInitialPanelToolbarItems = (panelType: string) => [
  {
    id: 'editor.panel.info',
    type: 'button',
    selected: panelType === 'info',
    title: 'Info',
    key: '0',
    iconName: 'EditorInfoIcon',
  },
  {
    id: 'editor.panel.note',
    type: 'button',
    selected: panelType === 'note',
    title: 'Note',
    key: '1',
    iconName: 'EditorNoteIcon',
  },
  {
    id: 'editor.panel.success',
    type: 'button',
    selected: panelType === 'success',
    title: 'Success',
    key: '2',
    iconName: 'EditorSuccessIcon',
  },
  {
    id: 'editor.panel.warning',
    type: 'button',
    selected: panelType === 'warning',
    title: 'Warning',
    key: '3',
    iconName: 'EditorWarningIcon',
  },
  {
    id: 'editor.panel.error',
    type: 'button',
    selected: panelType === 'error',
    title: 'Error',
    key: '4',
    iconName: 'EditorErrorIcon',
  },
  { type: 'separator' },
  {
    id: 'editor.panel.delete',
    type: 'button',
    appearance: 'danger',
    title: 'Remove',
    key: '6',
    iconName: 'EditorRemoveIcon',
  },
];

const getDate = (page: Page, today?: boolean) => {
  return page.execute((today) => {
    if (today) {
      const today = new Date(Date.now());
      const todayInUTC = Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );
      return todayInUTC.toString();
    }
    return '0';
  }, today);
};

const defaultColor: PaletteColor = lightModeStatusColorPalette[0];

type TestName =
  | 'adaptive toolbar: passes through toolbar on status select'
  | 'adaptive toolbar: passes through toolbar on date select'
  | 'adaptive toolbar: passes through toolbar on panel select'
  | 'adaptive toolbar: passes through toolbar on table select'
  | 'adaptive toolbar: passes through toolbar on nested status in toolbar'
  | 'adaptive toolbar: passes through toolbar on panel to status'
  | 'adaptive toolbar: passes through toolbar on date to status'
  | 'adaptive toolbar: hides toolbar when click off node';

const toolbarEditorTestSuite: DynamicMobileTestSuite<TestName> = async ({
  skipTests,
}) => {
  const DynamicMobileTestCase = getDynamicMobileTestCase({
    TestCase: MobileTestCase,
    skipTests,
  });

  DynamicMobileTestCase(
    `adaptive toolbar: passes through toolbar on status select`,
    {},
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await page.execute(() => {
        window.bridge?.insertNode('status');
      });

      let calls = await getDummyBridgeCalls(page, 'onNodeSelected');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      expect(calls.length).toBe(1);
      expect(calls[0][0]).toBe('status');
      expect(JSON.parse(calls[0][1])).toMatchObject(
        buildInitialStatusToolbarItems(),
      );

      await page.execute(() => {
        window.bridge?.performEditAction('0', 'New Status');
      });
      await wait(1000);

      calls = await getDummyBridgeCalls(page, 'onNodeSelected');
      expect(calls.length).toBe(2);
      expect(calls[1][0]).toBe('status');
      expect(JSON.parse(calls[1][1])).toMatchObject(
        buildInitialStatusLozengeToolbarItems(defaultColor),
      );

      await page.execute(() => {
        window.bridge?.performEditAction('0');
      });

      calls = await getDummyBridgeCalls(page, 'onNodeSelected');
      expect(calls.length).toBe(3);
      expect(calls[2][0]).toBe('status');
      expect(JSON.parse(calls[2][1])).toMatchObject(
        buildEditTextStatusToolbarItems('New Status'),
      );

      await page.execute(() => {
        window.bridge?.performEditAction('0', 'New Status');
      });
      await page.execute(() => {
        window.bridge?.performEditAction('2.1');
      });

      await wait(1000);

      calls = await getDummyBridgeCalls(page, 'onNodeSelected');
      expect(calls.length).toBe(5);
      expect(JSON.parse(calls[4][1])).toMatchObject(
        buildInitialStatusLozengeToolbarItems(lightModeStatusColorPalette[1]),
      );
    },
  );

  DynamicMobileTestCase(
    `adaptive toolbar: passes through toolbar on date select`,
    {},
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await page.execute(() => {
        window.bridge?.insertNode('date');
      });

      let date = await getDate(page, true);
      let calls = await getDummyBridgeCalls(page, 'onNodeSelected');
      expect(calls.length).toBe(1);
      expect(calls[0][0]).toBe('date');
      expect(JSON.parse(calls[0][1])).toMatchObject(
        buildInitialDateToolbarItems(date),
      );

      await page.execute(() => {
        window.bridge?.performEditAction('0', '0');
      });

      date = await getDate(page, false);
      calls = await getDummyBridgeCalls(page, 'onNodeDeselected');
      expect(calls.length).toBe(1);
    },
  );

  DynamicMobileTestCase(
    `adaptive toolbar: passes through toolbar on panel select`,
    {},
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await page.execute(() => {
        window.bridge?.insertBlockType('panel');
      });

      let calls = await getDummyBridgeCalls(page, 'onNodeSelected');
      expect(calls.length).toBe(1);
      expect(calls[0][0]).toBe('panel');
      expect(JSON.parse(calls[0][1])).toMatchObject(
        buildInitialPanelToolbarItems('info'),
      );

      await page.execute(() => {
        window.bridge?.performEditAction('3');
      });

      calls = await getDummyBridgeCalls(page, 'onNodeSelected');
      expect(calls.length).toBe(2);
      expect(calls[1][0]).toBe('panel');
      expect(JSON.parse(calls[1][1])).toMatchObject(
        buildInitialPanelToolbarItems('warning'),
      );
    },
  );

  DynamicMobileTestCase(
    `adaptive toolbar: passes through toolbar on table select`,
    {},
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await page.execute(() => {
        window.bridge?.insertBlockType('table');
      });

      // Table isn't selected on insert
      await page.click(`.${TableSharedCssClassName.TABLE_CELL_WRAPPER}`);
      let calls = await getDummyBridgeCalls(page, 'onNodeSelected');
      expect(calls.length).toBe(1);

      // Match table options
      const expectValues = buildInitialTableToolbarItems();
      const resultValues = JSON.parse(calls[0][1]);

      // Match editor.table.tableOptions
      expect(resultValues[0]).toEqual(expect.objectContaining(expectValues[0]));
      // Match editor.table.cellOptions and the options array
      const { options: options, ...expectedValuesWithoutOptions } =
        expectValues[2];
      expect(resultValues[2]).toEqual(
        expect.objectContaining(expectedValuesWithoutOptions),
      );
      // console.log(resultValues[2].options)
      expect(resultValues[2].options).toEqual(
        expect.arrayContaining(
          (options ?? []).map((option) => expect.objectContaining(option)),
        ),
      );
    },
  );

  DynamicMobileTestCase(
    'adaptive toolbar: passes through toolbar on nested status in toolbar',
    {},
    async (client: any) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await page.execute(() => {
        window.bridge?.insertBlockType('table');
        window.bridge?.insertNode('status');
      });

      let selectedCalls = await getDummyBridgeCalls(page, 'onNodeSelected');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      expect(selectedCalls.length).toBe(1);
      expect(selectedCalls[0][0]).toBe('status');
      expect(JSON.parse(selectedCalls[0][1])).toMatchObject(
        buildInitialStatusToolbarItems(),
      );

      let deselectedCalls = await getDummyBridgeCalls(page, 'onNodeDeselected');
      expect(deselectedCalls).toBeNull();
    },
  );

  DynamicMobileTestCase(
    `adaptive toolbar: passes through toolbar on panel to status`,
    // Skipping because of https://product-fabric.atlassian.net/browse/ME-1581
    { skipPlatform: ['*'] },
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await page.execute((adfContent) => {
        window.bridge?.setContent(JSON.stringify(adfContent));
      }, adfContent);

      await page.click(`.${PanelSharedCssClassName.prefix}`);

      let selectedCalls = await getDummyBridgeCalls(page, 'onNodeSelected');
      expect(selectedCalls.length).toBe(1);
      expect(selectedCalls[0][0]).toBe('panel');
      expect(JSON.parse(selectedCalls[0][1])).toMatchObject(
        buildInitialPanelToolbarItems('info'),
      );

      await page.click(`.${StatusSharedCssClassName.STATUS_LOZENGE}`);

      let deselectedCalls = await getDummyBridgeCalls(page, 'onNodeDeselected');
      expect(deselectedCalls).toBeNull();

      selectedCalls = await getDummyBridgeCalls(page, 'onNodeSelected');
      expect(selectedCalls.length).toBe(2);
      expect(selectedCalls[1][0]).toBe('status');
      expect(JSON.parse(selectedCalls[1][1])).toMatchObject(
        buildInitialStatusLozengeToolbarItems(defaultColor),
      );
    },
  );

  DynamicMobileTestCase(
    `adaptive toolbar: passes through toolbar on date to status`,
    // Skipping because of https://product-fabric.atlassian.net/browse/ME-1581
    { skipPlatform: ['*'] },
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await page.execute((adfContent) => {
        window.bridge?.setContent(JSON.stringify(adfContent));
      }, adfContent);

      const date = await getDate(page, false);
      await page.click(`.${DateSharedCssClassName.DATE_CONTAINER}`);

      let selectedCalls = await getDummyBridgeCalls(page, 'onNodeSelected');
      expect(selectedCalls.length).toBe(1);
      expect(selectedCalls[0][0]).toBe('date');
      expect(JSON.parse(selectedCalls[0][1])).toMatchObject(
        buildInitialDateToolbarItems(date),
      );

      await page.click(`.${StatusSharedCssClassName.STATUS_LOZENGE}`);

      selectedCalls = await getDummyBridgeCalls(page, 'onNodeSelected');
      expect(selectedCalls.length).toBe(2);
      expect(selectedCalls[1][0]).toBe('status');
      expect(JSON.parse(selectedCalls[1][1])).toMatchObject(
        buildInitialStatusLozengeToolbarItems(defaultColor),
      );
    },
  );

  DynamicMobileTestCase(
    `adaptive toolbar: hides toolbar when click off node`,
    { skipPlatform: ['ios'] },
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await page.execute((adfContent) => {
        window.bridge?.setContent(JSON.stringify(adfContent));
      }, adfContent);

      await page.click(`.${PanelSharedCssClassName.prefix}`);
      await page.click('.editor-click-wrapper');

      const deselectedCalls = await getDummyBridgeCalls(
        page,
        'onNodeDeselected',
      );
      expect(deselectedCalls.length).toBe(1);
    },
  );
};

export default toolbarEditorTestSuite;
