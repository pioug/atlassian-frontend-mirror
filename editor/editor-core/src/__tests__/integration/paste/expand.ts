import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { copyAsHTML, getDocFromElement, fullpage } from '../_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { document } from './__fixtures__/document-with-table';
import {
  documentWithExpand,
  documentWithExpandAndTables,
  tableWithPanel,
} from './__fixtures__/document-with-expand';
import { panelSelectors } from '../../__helpers/page-objects/_panel';
import { selectors } from '../../__helpers/page-objects/_editor';

const editorSelector = selectors.editor;
const expandSelector = '[data-node-type="expand"]';
const nestedExpandSelector = '[data-node-type="nestedExpand"]';
const controlSelector = 'tbody tr:first-child th:nth-child(1)';
const panelSelector = panelSelectors.panelContent;

// TODO: https://product-fabric.atlassian.net/browse/ED-9831
// Selection in Catalina Safari isn't working properly.

// TODO: https://product-fabric.atlassian.net/browse/ED-9831
// Note: most of these tests will not work as expected on mac+chrome
// the paste here happens with Shift+Instert for mac due to chromedriver issue with sending keys with Command
// when pasting expand into table like this this breaks table in two, and leads to some other issues that are not reproducible manually
// ticket to implement better pasting - ED-9756

BrowserTestCase(
  'expand.ts: expand copied from renderer and pasted on full-page',
  { skip: ['edge', 'safari'] },
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
  { skip: ['edge', 'safari'] },
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
  { skip: ['edge', 'safari'] },
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
  { skip: ['edge', 'safari'] },
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
  { skip: ['edge', 'safari'] },
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
  { skip: ['edge', 'safari'] },
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
  { skip: ['edge', 'safari'] },
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
  'expand.ts: table with nestedExpand pasted inside an expand',
  { skip: ['edge', 'safari'] },
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
  { skip: ['edge', 'safari'] },
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
  { skip: ['edge', 'safari'] },
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
  { skip: ['edge', 'safari'] },
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
