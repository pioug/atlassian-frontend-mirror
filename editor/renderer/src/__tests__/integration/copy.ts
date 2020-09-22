import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  mountRenderer,
  goToRendererTestingExample,
} from '../__helpers/testing-example-helpers';

import simpleTableADF from './__fixtures__/simple-table.adf.json';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const PASTE_AREA_ID = 'paste-area-test-123';

const getClipboardContent = async (page: Page, type: string) => {
  page.evaluate(
    (id: string, type: string) => {
      const textArea = document.createElement('textarea');
      textArea.id = id;
      textArea.addEventListener('paste', (event: ClipboardEvent): any => {
        event.preventDefault();
        if (event.clipboardData) {
          const html = event.clipboardData.getData(type);
          textArea.innerHTML = html;
        }
      });

      document.body.appendChild(textArea);
    },
    PASTE_AREA_ID,
    type,
  );

  await page.click(`#${PASTE_AREA_ID}`);

  await page.paste();

  const value = await page.getValue(`#${PASTE_AREA_ID}`);

  page.evaluate((id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.remove();
    }
  }, PASTE_AREA_ID);

  return value;
};

// We need this test for
// https://product-fabric.atlassian.net/browse/ED-8001
// This test is mainly targeting Firefox.
// Once https://bugzilla.mozilla.org/show_bug.cgi?id=1664350 been resolved,
// We should remove this test.
BrowserTestCase(
  `Copy correct table structure`,
  { skip: ['edge', 'safari'] },
  async (client: any) => {
    const page = await goToRendererTestingExample(client);

    await mountRenderer(page, {}, simpleTableADF);

    await page.simulateUserSelection('th', 'td');

    await page.copy();

    const htmlValue = await getClipboardContent(page, 'text/html');

    const divElem = document.createElement('div');
    divElem.innerHTML = htmlValue;

    // should only copied 1 table with two table rows
    expect(divElem.querySelectorAll(':scope > table').length).toEqual(1);
    expect(
      divElem.querySelectorAll(':scope > table > tbody > tr').length,
    ).toEqual(2);

    //Each row has correct content
    expect(
      divElem.querySelector(':scope > table > tbody > tr > th > p > strong')
        ?.innerHTML,
    ).toEqual('a');
    expect(
      divElem.querySelector(':scope > table > tbody > tr > td > p')?.innerHTML,
    ).toEqual('b');
  },
);
