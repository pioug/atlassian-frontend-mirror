import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  fullpage,
  editable,
  getDocFromElement,
} from '../../../../__tests__/integration/_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';

import emptyExpandAdf from './__fixtures__/empty-expand.json';
import closedExpandAdf from './__fixtures__/closed-expand.json';

const startEditor = async (client: any, closedExpand?: boolean) => {
  const page = await goToEditorTestingWDExample(client);

  await mountEditor(page, {
    appearance: fullpage.appearance,
    allowExpand: true,
    quickInsert: true,
    allowTables: true,
    defaultValue: closedExpand ? closedExpandAdf : emptyExpandAdf,
  });

  await page.keys('ArrowLeft'); // node selection
  await page.keys('ArrowLeft'); // gap cursor
  return page;
};

describe('given the gap cursor is on the left of the expand', () => {
  describe('when tab is pressed', () => {
    describe('when button is focused', () => {
      describe('and enter is pressed', () => {
        BrowserTestCase(
          'should collapse the expand',
          // TODO: Unskip Safari as part of https://product-fabric.atlassian.net/browse/ED-11351
          { skip: ['edge', 'safari'] },
          async (client: any, testName: string) => {
            const page = await startEditor(client);
            await page.keys('Tab');
            await page.keys('Enter');

            const doc = await page.$eval(editable, getDocFromElement);
            expect(doc).toMatchCustomDocSnapshot(testName);
          },
        );
      });

      describe('and space is pressed', () => {
        BrowserTestCase(
          'should collapse the expand',
          // TODO: Unskip Safari as part of https://product-fabric.atlassian.net/browse/ED-11351
          { skip: ['edge', 'safari'] },
          async (client: any, testName: string) => {
            const page = await startEditor(client);
            await page.keys('Tab');
            await page.keys('Space');

            const doc = await page.$eval(editable, getDocFromElement);
            expect(doc).toMatchCustomDocSnapshot(testName);
          },
        );
      });
    });
  });

  describe('when tab is pressed twice', () => {
    BrowserTestCase(
      'should focus on title',
      // TODO: Unskip Safari as part of https://product-fabric.atlassian.net/browse/ED-11351
      { skip: ['edge', 'safari'] },
      async (client: any, testName: string) => {
        const page = await startEditor(client);
        await page.keys('Tab');
        await page.keys('Tab');
        await page.keys('I am here'.split(''));

        const doc = await page.$eval(editable, getDocFromElement);
        expect(doc).toMatchCustomDocSnapshot(testName);
      },
    );
  });

  describe('when tab is pressed three times', () => {
    describe('when expand is opened', () => {
      BrowserTestCase(
        'should focus on content',
        // TODO: Unskip Safari as part of https://product-fabric.atlassian.net/browse/ED-11351
        { skip: ['edge', 'safari'] },
        async (client: any, testName: string) => {
          const page = await startEditor(client);
          await page.keys('Tab');
          await page.keys('Tab');
          await page.keys('Tab');
          await page.keys('I am here'.split(''));

          const doc = await page.$eval(editable, getDocFromElement);
          expect(doc).toMatchCustomDocSnapshot(testName);
        },
      );
    });

    describe('when expand is closed', () => {
      BrowserTestCase(
        'should focus outside',
        // TODO: Unskip Safari as part of https://product-fabric.atlassian.net/browse/ED-11351
        // TODO: unskip chrome and firefox https://product-fabric.atlassian.net/browse/ED-13164
        { skip: ['edge', 'safari', 'chrome', 'firefox'] },
        async (client: any, testName: string) => {
          const page = await startEditor(client, true);
          await page.keys('Tab');
          await page.keys('Tab');
          await page.keys('Tab');
          await page.keys('I am here'.split(''));

          const doc = await page.$eval(editable, getDocFromElement);
          expect(doc).toMatchCustomDocSnapshot(testName);
        },
      );
    });
  });
});
