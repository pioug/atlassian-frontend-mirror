import { Browser, BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { Node as PMNode } from 'prosemirror-model';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  doc,
  p,
  emoji,
  mention,
  panel,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  getDummyBridgeCalls,
  setContent,
  getBridgeOutput,
  editor,
  editable,
  configureEditor,
  navigateOrClear,
  getDocFromElement,
  callNativeBridge,
  ENABLE_QUICK_INSERT,
} from '../_utils';
import { docWithTable } from './__fixtures__/table-adf';

// TODO: Unskipped type-ahead tests ED-13572
const skip: Browser[] = ['*'];

BrowserTestCase(
  `type-ahead.ts: should insert a mention node`,
  { skip },
  async (client: any) => {
    const page = new Page(client);
    await navigateOrClear(page, editor.path);
    await page.waitForSelector(editable);

    const mentionItem = {
      id: '0',
      name: 'Raina Halper',
      mentionName: 'Caprice',
      nickname: 'Carolyn',
    };

    await callNativeBridge(
      page,
      'insertTypeAheadItem',
      'mention',
      JSON.stringify(mentionItem),
    );

    const jsonDocument = await page.$eval(editable, getDocFromElement);
    const pmDocument = PMNode.fromJSON(sampleSchema, jsonDocument);
    const expectedDocument = doc(
      p(
        mention({
          id: '0',
          text: '@Carolyn',
        })(),
        ' ',
      ),
    );

    expect(pmDocument).toEqualDocument(expectedDocument);
  },
);

BrowserTestCase(
  `type-ahead.ts: should insert an emoji node`,
  { skip },
  async (client: any) => {
    const page = new Page(client);
    await navigateOrClear(page, editor.path);
    await page.waitForSelector(editable);

    const emojiItem = {
      id: '1f4a8',
      fallback: '💨',
      shortName: ':dash:',
    };

    await callNativeBridge(
      page,
      'insertTypeAheadItem',
      'emoji',
      JSON.stringify(emojiItem),
    );

    const jsonDocument = await page.$eval(editable, getDocFromElement);
    const pmDocument = PMNode.fromJSON(sampleSchema, jsonDocument);
    const expectedDocument = doc(
      p(
        emoji({
          id: '1f4a8',
          fallback: '💨',
          shortName: ':dash:',
        })(),
        ' ',
      ),
    );

    expect(pmDocument).toEqualDocument(expectedDocument);
  },
);

BrowserTestCase(
  `type-ahead.ts: should insert an action item node by enter key`,
  { skip: skip.concat('safari') },
  async (client: any) => {
    const page = new Page(client);
    await navigateOrClear(page, editor.path);
    await page.waitForSelector(editable);

    await configureEditor(page, ENABLE_QUICK_INSERT);
    await page.click(editable);
    await page.keys('/Info'.split(''));
    await page.keys('Enter');

    const jsonDocument = await page.$eval(editable, getDocFromElement);
    const pmDocument = PMNode.fromJSON(sampleSchema, jsonDocument);
    const expectedDocument = doc(panel()(p('')));

    expect(pmDocument).toEqualDocument(expectedDocument);
  },
);

BrowserTestCase(
  `type-ahead.ts: should insert an action item node by bridge`,
  { skip: skip.concat('safari') },
  async (client: any) => {
    const page = new Page(client);
    await navigateOrClear(page, editor.path);
    await page.waitForSelector(editable);

    await configureEditor(page, ENABLE_QUICK_INSERT);
    await page.click(editable);
    await page.keys('/Info'.split(''));

    await callNativeBridge(
      page,
      'insertTypeAheadItem',
      'quickinsert',
      JSON.stringify({
        index: 0,
      }),
    );

    const jsonDocument = await page.$eval(editable, getDocFromElement);
    const pmDocument = PMNode.fromJSON(sampleSchema, jsonDocument);
    const expectedDocument = doc(panel()(p('')));

    expect(pmDocument).toEqualDocument(expectedDocument);
  },
);

BrowserTestCase(
  `type-ahead.ts: should call the typeAheadBridge when a hyperlink is inserted by API`,
  { skip },
  async (client: any) => {
    const page = new Page(client);
    await navigateOrClear(page, editor.path);
    await page.waitForSelector(editable);

    await configureEditor(page, ENABLE_QUICK_INSERT);
    await page.click(editable);
    await page.keys('opa /Link'.split(''));

    await callNativeBridge(
      page,
      'insertTypeAheadItem',
      'quickinsert',
      JSON.stringify({
        index: 0,
      }),
    );

    const typeAheadPayloads = await getBridgeOutput(
      page,
      'typeAheadBridge',
      'typeAheadItemSelected',
    );

    expect(typeAheadPayloads).toHaveLength(1);
    expect(JSON.parse(typeAheadPayloads[0])).toEqual(
      expect.objectContaining({
        id: 'hyperlink',
        title: 'Link',
      }),
    );

    // Make sure the query wasn't add into the document
    const jsonDocument = await page.$eval(editable, getDocFromElement);
    const pmDocument = PMNode.fromJSON(sampleSchema, jsonDocument);
    const expectedDocument = doc(p('opa '));

    expect(pmDocument).toEqualDocument(expectedDocument);
  },
);

BrowserTestCase(
  `type-ahead.ts: should use the allow list on the quick insert items`,
  { skip },
  async (client: any) => {
    const page = new Page(client);
    await navigateOrClear(page, editor.path);
    await page.waitForSelector(editable);

    await configureEditor(page, ENABLE_QUICK_INSERT);
    const quickInsertList = JSON.stringify(['heading1', 'heading2']);
    await callNativeBridge(page, 'setQuickInsertAllowList', quickInsertList);
    await page.click(editable);

    await page.keys(' /'.split(''));

    const typeAheadPayloads = await getBridgeOutput(
      page,
      'typeAheadBridge',
      'typeAheadDisplayItems',
    );
    const result = JSON.parse(typeAheadPayloads[0].items);

    expect(result).toHaveLength(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'heading1', title: 'Heading 1' }),
        expect.objectContaining({ id: 'heading2', title: 'Heading 2' }),
      ]),
    );
  },
);

BrowserTestCase(
  `type-ahead.ts: it should keep the type-ahead when the configuration changes`,
  { skip: skip.concat('safari') },
  async (client: any) => {
    const browser = new Page(client);
    await navigateOrClear(browser, editor.path);
    await browser.waitForSelector(editable);

    await browser.keys('hey '.split(''));

    await configureEditor(browser, ENABLE_QUICK_INSERT);
    await configureEditor(browser, '{"mode": "dark"}');
    await browser.click(editable);

    // Navigating cursor away from query mark should dismiss typeahead
    await browser.keys('abc /act'.split(''));

    const typeAheadPayloads = await getBridgeOutput(
      browser,
      'typeAheadBridge',
      'typeAheadDisplayItems',
    );

    expect(typeAheadPayloads.length).toEqual(4);
  },
);

BrowserTestCase(
  `type-ahead.ts: should insert the raw text query when the cancelTypeAhead is called`,
  { skip },
  async (client: any) => {
    const page = new Page(client);
    await navigateOrClear(page, editor.path);
    await page.waitForSelector(editable);

    await configureEditor(page, ENABLE_QUICK_INSERT);
    await page.click(editable);
    await page.keys('opa /Info'.split(''));

    await callNativeBridge(page, 'cancelTypeAhead');

    const jsonDocument = await page.$eval(editable, getDocFromElement);
    const pmDocument = PMNode.fromJSON(sampleSchema, jsonDocument);
    const expectedDocument = doc(p('opa /Info'));

    expect(pmDocument).toEqualDocument(expectedDocument);
  },
);

BrowserTestCase(
  `type-ahead.ts: should set the selection after the raw text query when the cancelTypeAhead is called`,
  { skip },
  async (client: any) => {
    const page = new Page(client);
    await navigateOrClear(page, editor.path);
    await page.waitForSelector(editable);

    await configureEditor(page, ENABLE_QUICK_INSERT);
    await page.click(editable);
    await page.keys('opa /Info'.split(''));

    await callNativeBridge(page, 'cancelTypeAhead');

    await page.keys('More'.split(''));

    const jsonDocument = await page.$eval(editable, getDocFromElement);
    const pmDocument = PMNode.fromJSON(sampleSchema, jsonDocument);
    const expectedDocument = doc(p('opa /InfoMore'));

    expect(pmDocument).toEqualDocument(expectedDocument);
  },
);

BrowserTestCase(
  `type-ahead.ts: should close the typeahead when the undo is pressed`,
  { skip },
  async (client: any) => {
    const page = new Page(client);
    await navigateOrClear(page, editor.path);
    await page.waitForSelector(editable);

    await configureEditor(page, ENABLE_QUICK_INSERT);
    await page.click(editable);
    await page.keys('first line'.split(''));
    await page.keys('Enter');
    await page.keys('opa /Info'.split(''));

    await callNativeBridge(page, 'undo');
    await page.keys('lol'.split(''));

    const jsonDocument = await page.$eval(editable, getDocFromElement);
    const pmDocument = PMNode.fromJSON(sampleSchema, jsonDocument);
    const expectedDocument = doc(p('first line'), p('lol'));

    expect(pmDocument).toEqualDocument(expectedDocument);
  },
);

BrowserTestCase(
  `type-ahead.ts: should call typeAheadDisplayItems with the old query after the undo opens the typeahead again`,
  { skip },
  async (client: any) => {
    const page = new Page(client);
    await navigateOrClear(page, editor.path);
    await page.waitForSelector(editable);

    await configureEditor(page, ENABLE_QUICK_INSERT);
    await page.click(editable);
    await page.keys('opa /Info'.split(''));

    await callNativeBridge(
      page,
      'insertTypeAheadItem',
      'quickinsert',
      JSON.stringify({
        index: 0,
      }),
    );

    await callNativeBridge(page, 'undo');

    const typeAheadPayloads = await getBridgeOutput(
      page,
      'typeAheadBridge',
      'typeAheadDisplayItems',
    );

    const lastCall = typeAheadPayloads[typeAheadPayloads.length - 1];
    expect(lastCall.query).toEqual('Info');
  },
);

BrowserTestCase(
  `type-ahead.ts: should call typeAheadQuery with the old query after the undo opens the typeahead again`,
  { skip },
  async (client: any) => {
    const page = new Page(client);
    await navigateOrClear(page, editor.path);
    await page.waitForSelector(editable);

    await configureEditor(page, ENABLE_QUICK_INSERT);
    await page.click(editable);
    await page.keys('opa :das'.split(''));

    const emojiItem = {
      id: '1f4a8',
      fallback: '💨',
      shortName: ':dash:',
    };
    await callNativeBridge(
      page,
      'insertTypeAheadItem',
      'emoji',
      JSON.stringify(emojiItem),
    );
    await callNativeBridge(page, 'undo');

    const typeAheadPayloads = await getBridgeOutput(
      page,
      'typeAheadBridge',
      'typeAheadQuery',
    );

    const lastCall = typeAheadPayloads[typeAheadPayloads.length - 1];
    expect(lastCall.query).toEqual('das');
  },
);

BrowserTestCase(
  `type-ahead.ts: should not call the onNodeDeselected API when the typeahead is open`,
  { skip },
  async (client: any) => {
    const page = new Page(client);
    await navigateOrClear(page, editor.path);
    await page.waitForSelector(editable);

    await configureEditor(page, ENABLE_QUICK_INSERT);
    await setContent(page, docWithTable);
    await page.waitForSelector(`${editable} table`);
    await page.click(editable);

    await page.keys('/Info'.split(''));

    const onNodeDeselectedCalls = await getDummyBridgeCalls(
      page,
      'onNodeDeselected',
    );
    expect(onNodeDeselectedCalls).toBeNull();
  },
);
