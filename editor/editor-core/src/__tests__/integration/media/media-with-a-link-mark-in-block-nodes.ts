import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  getDocFromElement,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { waitForNumImages } from './_utils';
import adfMediaSingleWithLinkInALayoutColumn from './_fixtures_/media-single-with-a-link-mark-in-a-layout-column.adf.json';
import adfMediaSingleWithLinkInAListItem from './_fixtures_/media-single-with-a-link-mark-in-a-list-item.adf.json';
import adfMediaSingleWithLinkInANestedExpand from './_fixtures_/media-single-with-a-link-mark-in-a-nested-expand.adf.json';
import adfMediaSingleWithLinkInATable from './_fixtures_/media-single-with-a-link-mark-in-a-table.adf.json';
import adfMediaSingleWithLinkInAnExpand from './_fixtures_/media-single-with-a-link-mark-in-an-expand.adf.json';
import adfMediaSingleWithLinkMarkInABodiedExtension from './_fixtures_/media-single-with-a-link-mark-in-a-bodied-extension.adf.json';

async function loadADF(client: any, adf: object): Promise<any> {
  const page = await goToEditorTestingWDExample(client);

  await mountEditor(page, {
    appearance: fullpage.appearance,
    defaultValue: adf,
    allowExtension: true,
    allowLayouts: true,
    allowTables: true,
    allowExpand: true,
    media: {
      allowMediaSingle: true,
      allowLinking: true,
      allowResizing: false,
    },
  });

  await waitForNumImages(page, 1);
  // All the ADF test example are start with an empty paragraph,
  // we press a key to trigger a transaction
  // This is a workaround for Safari, which seems not reflect update without changes on the page.
  await page.keys(['ArrowUp']);

  return await page.$eval(editable, getDocFromElement);
}

BrowserTestCase(
  'should load the adf with media single inside a layout column',
  // TODO: safari skipped due to flakines in pipelines - please fix
  { skip: ['safari'] },
  async (client: any, testName: string) => {
    const doc = await loadADF(client, adfMediaSingleWithLinkInALayoutColumn);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'should load the adf with media single inside a table cell',
  // TODO: safari skipped due to flakines in pipelines - please fix
  { skip: ['safari'] },
  async (client: any, testName: string) => {
    const doc = await loadADF(client, adfMediaSingleWithLinkInATable);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'should load the adf with media single inside a list item',
  // TODO: safari skipped due to flakines in pipelines - please fix
  { skip: ['safari'] },
  async (client: any, testName: string) => {
    const doc = await loadADF(client, adfMediaSingleWithLinkInAListItem);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'should load the adf with media single inside an expand',
  // TODO: safari skipped due to flakines in pipelines - please fix
  { skip: ['safari'] },
  async (client: any, testName: string) => {
    const doc = await loadADF(client, adfMediaSingleWithLinkInAnExpand);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'should load the adf with media single inside a bodied extension',
  // TODO: safari skipped due to flakines in pipelines - please fix
  { skip: ['safari'] },
  async (client: any, testName: string) => {
    const doc = await loadADF(
      client,
      adfMediaSingleWithLinkMarkInABodiedExtension,
    );

    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'should load the adf with media single inside a nested expand',
  // TODO: safari skipped due to flakines in pipelines - please fix
  { skip: ['safari'] },
  async (client: any, testName: string) => {
    const doc = await loadADF(client, adfMediaSingleWithLinkInANestedExpand);

    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
