import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { editable, getDocFromElement, fullpage } from '../_helpers';
import {
  mountEditor,
  goToEditorTestingExample,
} from '../../__helpers/testing-example-helpers';
import adfMediaSingleWithLinkInALayoutColumn from './_fixtures_/media-single-with-a-link-mark-in-a-layout-column.adf.json';
import adfMediaSingleWithLinkInAListItem from './_fixtures_/media-single-with-a-link-mark-in-a-list-item.adf.json';
import adfMediaSingleWithLinkInANestedExpand from './_fixtures_/media-single-with-a-link-mark-in-a-nested-expand.adf.json';
import adfMediaSingleWithLinkInATable from './_fixtures_/media-single-with-a-link-mark-in-a-table.adf.json';
import adfMediaSingleWithLinkInAnExpand from './_fixtures_/media-single-with-a-link-mark-in-an-expand.adf.json';

async function loadADF(client: any, adf: object): Promise<any> {
  const page = await goToEditorTestingExample(client);

  await mountEditor(page, {
    appearance: fullpage.appearance,
    defaultValue: adf,
    media: {
      allowMediaSingle: true,
    },
  });

  return await page.$eval(editable, getDocFromElement);
}

BrowserTestCase(
  'should load the adf with media single inside a layout column',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const doc = await loadADF(client, adfMediaSingleWithLinkInALayoutColumn);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'should load the adf with media single inside a table cell',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const doc = await loadADF(client, adfMediaSingleWithLinkInATable);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'should load the adf with media single inside a list item',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const doc = await loadADF(client, adfMediaSingleWithLinkInAListItem);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'should load the adf with media single inside an expand',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const doc = await loadADF(client, adfMediaSingleWithLinkInAnExpand);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'should load the adf with media single inside a nested expand',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: adfMediaSingleWithLinkInANestedExpand,
      media: {
        allowMediaSingle: true,
      },
    });

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
