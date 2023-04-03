import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  copyAsHTML,
  getDocFromElement,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { document } from './__fixtures__/document-with-table';
import {
  documentWithExpand,
  documentWithExpandAndTables,
  tableWithPanel,
} from './__fixtures__/document-with-expand';
import { panelSelectors } from '@atlaskit/editor-test-helpers/page-objects/panel';
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';

const editorSelector = selectors.editor;
const expandSelector = '[data-node-type="expand"]';
const nestedExpandSelector = '[data-node-type="nestedExpand"]';
const controlSelector = 'tbody tr:first-child th:nth-child(1)';
const panelSelector = panelSelectors.panelContent;

// Note: most of these tests will not work as expected on mac+chrome
// the paste here happens with Shift+Instert for mac due to chromedriver issue with sending keys with Command
// when pasting expand into table like this this breaks table in two, and leads to some other issues that are not reproducible manually
// ticket to implement better pasting - ED-9756

BrowserTestCase(
  'expand.ts: expand copied from renderer and pasted on full-page',
  { skip: [] },
  async (client: WebdriverIO.BrowserObject, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const data =
      '<div id="RendererOutput"><div class="ak-renderer-document"><div data-node-type="expand" data-title="Expand title"><button aria-label="Expand Expand title"><p>Expand title</p></button><div><p>hello there</p></div></div></div></div></div>';
    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowExpand: true,
    });

    await page.click(fullpage.placeholder);
    await page.paste();
    await page.waitForSelector(expandSelector);

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'expand.ts: expand with legal content pasted in table',
  { skip: [] },
  async (client: WebdriverIO.BrowserObject, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const data =
      '<div data-node-type="expand" data-title="title" data-pm-slice="0 0 []"><p><span data-mention-id="here" data-access-level="CONTAINER" contenteditable="false" data-user-type="SPECIAL">@here</span> hello</p></div>';
    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(document),
      allowExpand: true,
      allowTables: {
        advanced: true,
      },
    });

    await page.waitForSelector(controlSelector);
    await page.click(controlSelector);
    await page.paste();
    //expand becomes nested expand when pasted inside a table
    await page.waitForSelector(nestedExpandSelector);
    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'expand.ts: expand with illegal content pasted in table',
  { skip: [] },
  async (client: WebdriverIO.BrowserObject, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const data =
      '<div data-node-type="expand" data-title="title" data-pm-slice="0 0 []"><div data-panel-type="info"><div><p>content</p></div></div></div>';
    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(document),
      allowExpand: true,
      allowTables: {
        advanced: true,
      },
      allowPanel: true,
    });

    await page.waitForSelector(controlSelector);
    await page.click(controlSelector);
    await page.paste();
    await page.waitForSelector(expandSelector);

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'expand.ts: nestedExpand pasted in table',
  { skip: [] },
  async (client: WebdriverIO.BrowserObject, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const data =
      '<div data-node-type="nestedExpand" data-title="title" data-pm-slice="0 0 []"><p>hello there</p></div>';
    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(document),
      allowExpand: true,
      allowTables: {
        advanced: true,
      },
    });

    await page.waitForSelector(controlSelector);
    await page.click(controlSelector);
    await page.paste();
    await page.waitForSelector(nestedExpandSelector);

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'expand.ts: nestedExpand pasted on top level',
  { skip: [] },
  async (client: WebdriverIO.BrowserObject, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const data =
      '<div data-node-type="nestedExpand" data-title="title" data-pm-slice="0 0 []"><p>hello there</p></div>';
    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowExpand: true,
    });

    await page.click(fullpage.placeholder);
    await page.paste();
    //nestedExpand becomes normal expand when pasted on top level
    await page.waitForSelector(expandSelector);

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'expand.ts: table with nestedExpand pasted on top level',
  { skip: [] },
  async (client: WebdriverIO.BrowserObject, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const data =
      '<table data-number-column="false" data-layout="default" data-table-local-id=="abc-123" data-autosize="false" data-pm-slice="1 1 []"><tbody><tr><th class="pm-table-header-content-wrap"><p></p></th></tr><tr><td class="pm-table-cell-content-wrap"><div data-node-type="nestedExpand" data-title="title" data-expanded="true"><p>content</p></div></td></tr></tbody></table>';
    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowExpand: true,
      allowTables: true,
    });

    await page.click(fullpage.placeholder);
    await page.paste();
    await page.waitForSelector(nestedExpandSelector);

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'expand.ts: expand with table with nestedExpand pasted on top level',
  { skip: [] },
  async (client: WebdriverIO.BrowserObject, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const data =
      '<div data-node-type="expand" data-title="title 1" data-expanded="true" data-pm-slice="0 0 []"><table data-table-local-id=="abc-123" data-number-column="false" data-layout="default" data-autosize="false"><tbody><tr><td class="pm-table-cell-content-wrap"><div data-node-type="nestedExpand" data-title="title 2" data-expanded="true"><p>content</p></div></td></tr></tbody></table></div>';
    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowExpand: true,
      allowTables: true,
    });

    await page.click(fullpage.placeholder);
    await page.paste();
    await page.waitForSelector(nestedExpandSelector);

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'expand.ts: paste table with custom column width in expand and undo',
  { skip: ['safari'] },
  async (client: WebdriverIO.BrowserObject, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const data = `<div class="ak-editor-expand ak-editor-expand__type-expand ak-editor-expand__expanded" data-node-type="expand" data-title=""><div class="ak-editor-expand__title-container" tabindex="-1" contenteditable="false"><div class="ak-editor-expand__icon"><div role="presentation" class="css-rq7z01"><button class="ak-editor-expand__icon-container css-1wiphq4-ButtonBase" type="button" tabindex="0"><span class="css-1kejoa0-ButtonBase"><span role="img" aria-label="Collapse content" style="--icon-primary-color: currentColor; --icon-secondary-color: var(--ds-surface, #FFFFFF);" class="css-1u8sedw-Icon"><svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M10.294 9.698a.988.988 0 010-1.407 1.01 1.01 0 011.419 0l2.965 2.94a1.09 1.09 0 010 1.548l-2.955 2.93a1.01 1.01 0 01-1.42 0 .988.988 0 010-1.407l2.318-2.297-2.327-2.307z" fill="currentColor" fill-rule="evenodd"></path></svg></span></span></button></div></div><div class="ak-editor-expand__input-container"><input class="ak-editor-expand__title-input" value="" placeholder="Give this expand a title..." type="text"></div></div><div class="ak-editor-expand__content"><p><br class="ProseMirror-trailingBreak"></p></div></div><p><br class="ProseMirror-trailingBreak"></p>`;
    const tableData = `<table data-number-column="false" data-layout="default" data-autosize="false" data-table-local-id="7c477492-fa5a-474c-80da-9e5387c6c4aa"><colgroup><col style="width: 330px;"><col style="width: 176px;"><col style="width: 253px;"></colgroup><tbody><tr data-header-row="true" data-is-observed="true" style="grid-template-columns: 330px 176px 253px; width: 760px;"><th data-colwidth="330" class="pm-table-header-content-wrap" id="02ead3d6-3b5b-4cd9-b528-93d772bb9d23"><div class="pm-table-column-controls-decoration ProseMirror-widget" data-start-index="0" data-end-index="1" contenteditable="false"></div><p><br class="ProseMirror-trailingBreak"></p></th><th data-colwidth="176" class="pm-table-header-content-wrap" id="45c712b7-146c-4e75-9b20-46bb260bdd2d"><div class="pm-table-column-controls-decoration ProseMirror-widget" data-start-index="1" data-end-index="2" contenteditable="false"></div><p><br class="ProseMirror-trailingBreak"></p></th><th data-colwidth="253" class="pm-table-header-content-wrap" id="45a51aef-3368-4f9d-bdca-e4f3b4f0c6e4"><div class="pm-table-column-controls-decoration ProseMirror-widget" data-start-index="2" data-end-index="3" contenteditable="false"></div><p><br class="ProseMirror-trailingBreak"></p></th></tr><tr><td data-colwidth="330" class="pm-table-cell-content-wrap" id="cdea43bc-0a08-4e9f-97e9-20e01ac7b053"><p class="pm-table-last-item-in-cell"><br class="ProseMirror-trailingBreak"></p><div class="pm-table-resize-decoration ProseMirror-widget" data-start-index="0" data-end-index="1" contenteditable="false"></div></td><td data-colwidth="176" class="pm-table-cell-content-wrap" id="e6232b77-027c-4ae7-9dfd-0cacffeeb60f"><p><br class="ProseMirror-trailingBreak"></p></td><td data-colwidth="253" class="pm-table-cell-content-wrap" id="72388334-525c-443f-8879-31650d893e0b"><p><br class="ProseMirror-trailingBreak"></p></td></tr><tr><td data-colwidth="330" class="pm-table-cell-content-wrap" id="35326d05-c730-4239-baab-c3f3e48b724c"><p><br class="ProseMirror-trailingBreak"></p></td><td data-colwidth="176" class="pm-table-cell-content-wrap" id="c74da8ef-dee9-46c0-b097-e1d5dd0708be"><p><br class="ProseMirror-trailingBreak"></p></td><td data-colwidth="253" class="pm-table-cell-content-wrap" id="5a121de7-2bc4-4fc6-83d6-0d3e74c571fa"><p><br class="ProseMirror-trailingBreak"></p></td></tr></tbody></table>`;

    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowExpand: true,
      allowAnalyticsGASV3: true,
      allowTables: {
        allowColumnResizing: true,
        allowMergeCells: true,
        allowNumberColumn: true,
        allowBackgroundColor: true,
        allowHeaderRow: true,
        allowHeaderColumn: true,
        permittedLayouts: 'all',
      },
    });

    await page.click(fullpage.placeholder);
    await page.paste();
    await page.waitForSelector(expandSelector);

    await copyAsHTML(page, tableData);

    await page.click('.ak-editor-expand__content');
    await page.paste();

    await page.waitForSelector('table');

    // undo once
    await page.undo();

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'expand.ts: table with nestedExpand pasted inside an expand',
  { skip: [] },
  async (client: WebdriverIO.BrowserObject, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const data =
      '<table  data-table-local-id="abc-123" data-number-column="false" data-layout="default" data-autosize="false" data-pm-slice="1 1 []"><tbody><tr><th class="pm-table-header-content-wrap"><p></p></th><th class="pm-table-header-content-wrap"><p></p></th><th class="pm-table-header-content-wrap"><p></p></th></tr><tr><td class="pm-table-cell-content-wrap"><div data-node-type="nestedExpand" data-title="111" data-expanded="true"><p>content</p></div></td><td class="pm-table-cell-content-wrap"><p></p></td><td class="pm-table-cell-content-wrap"><p></p></td></tr><tr><td class="pm-table-cell-content-wrap"><p></p></td><td class="pm-table-cell-content-wrap"><p></p></td><td class="pm-table-cell-content-wrap"><p></p></td></tr></tbody></table>';
    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowExpand: true,
      allowTables: true,
      defaultValue: JSON.stringify(documentWithExpand),
    });

    await page.waitForSelector(expandSelector);
    await page.click(`${expandSelector} p`);
    await page.paste();
    await page.waitForSelector(nestedExpandSelector);

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'expand.ts: expand pasted inside a table inside an expand',
  { skip: [] },
  async (client: WebdriverIO.BrowserObject, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const data = `<meta charset='utf-8'><div data-node-type="expand" data-title="Copy me nested" data-expanded="true" data-pm-slice="0 0 []"><p>Hello <span data-mention-id="6" data-access-level="" contenteditable="false">@April</span> </p></div>`;
    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowExpand: true,
      allowTables: true,
      shouldFocus: true,
      defaultValue: JSON.stringify(documentWithExpandAndTables),
    });

    await page.waitForSelector(controlSelector);
    await page.click(controlSelector);
    await page.paste();
    await page.waitForSelector('p*=Hello ');

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'expand.ts: expand pasted inside a panel inside a table should paste below',
  { skip: [] },
  async (client: WebdriverIO.BrowserObject, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const data = `<meta charset='utf-8'><div data-node-type="expand" data-title="Copy me nested" data-expanded="true" data-pm-slice="0 0 []"><p>Hello <span data-mention-id="6" data-access-level="" contenteditable="false">@April</span> </p></div>`;
    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowExpand: true,
      allowTables: true,
      allowPanel: true,
      shouldFocus: true,
      defaultValue: JSON.stringify(tableWithPanel),
    });

    await page.waitForSelector(panelSelector);
    await page.click(panelSelector);
    await page.paste();
    await page.waitForSelector('p*=Hello ');

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'expand.ts: expand content pasted inside a panel inside a table should paste text inside',
  { skip: [] },
  async (client: WebdriverIO.BrowserObject, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const data = `<meta charset='utf-8'><p data-pm-slice="1 1 [&quot;expand&quot;,null]">sda</p>`;
    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowExpand: true,
      allowTables: true,
      allowPanel: true,
      shouldFocus: true,
      defaultValue: JSON.stringify(tableWithPanel),
    });

    await page.waitForSelector(panelSelector);
    await page.click(panelSelector);
    await page.paste();
    await page.waitUntil(async () => !!(await page.$('p*=sda')));
    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
