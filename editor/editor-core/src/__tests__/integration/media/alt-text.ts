import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { richMediaClassName } from '@atlaskit/editor-common';
import {
  editable,
  getDocFromElement,
  insertMedia,
  fullpage,
} from '../_helpers';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '../../__helpers/testing-example-helpers';

const altTextButtonSelector = '[data-testid="alt-text-edit-button"]';
const cancelBtnSelector = '[data-testid="alt-text-clear-button"]';
const inputSelector = '[data-testid="alt-text-input"]';

async function setupEditorWithMedia(client: any): Promise<Page> {
  const page = await goToEditorTestingWDExample(client);
  await mountEditor(page, {
    appearance: fullpage.appearance,
    media: {
      allowMediaSingle: true,
      allowAltTextOnImages: true,
    },
  });

  // type some text
  await page.click(editable);
  await page.type(editable, 'some text');
  await page.waitUntilContainsText(editable, 'some text');

  // now we can insert media as necessary
  await insertMedia(page);
  await page.isVisible(`.${richMediaClassName}`);

  await page.waitForSelector(`.ProseMirror .${richMediaClassName}`);
  return page;
}

BrowserTestCase(
  'Inserts a media single with alt text',
  { skip: ['edge', 'safari'] },
  async (client: any, testName: string) => {
    const page = await setupEditorWithMedia(client);

    // Make keydown to focus on the media
    // await page.keys(['ArrowDown']);
    // await page.click(exampleClaimBtn);
    await page.click(`.ProseMirror .${richMediaClassName}`);
    await page.waitForSelector(altTextButtonSelector);
    await page.waitForVisible(altTextButtonSelector);

    await page.click(altTextButtonSelector);

    await page.waitForSelector('input');
    await page.type('input', 'lol');
    await page.keys(['Enter']);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

// Skip the test. Will work on introducing this behaviour back again as part of https://product-fabric.atlassian.net/browse/ED-8673
BrowserTestCase(
  'Inserts can undo clearing the alt text using cmd+z',
  { skip: ['firefox', 'edge', 'chrome', 'safari'] },
  async (browser: any, testName: string) => {
    const page = await setupEditorWithMedia(browser);
    await page.keys(['ArrowUp']);

    await page.waitForSelector(altTextButtonSelector);
    await page.click(altTextButtonSelector);

    await page.waitForSelector(inputSelector);

    await page.type(inputSelector, 'alttext');

    const altTextInput = await page.$(inputSelector);
    let value1 = await altTextInput.getValue();
    expect(value1).toBe('alttext');

    const oldState = await page.$eval(editable, getDocFromElement);
    const oldAltText = oldState.content[1].content[0].attrs.alt;

    await page.execute(() => {
      (window as any).onChangeCounter = 0;
    });

    await page.waitForSelector(cancelBtnSelector);
    await page.waitForVisible(cancelBtnSelector);
    await page.click(cancelBtnSelector);

    const value2 = await altTextInput.getValue();
    expect(value2).toBe('');

    // await until alt text is updated in prosemirror state
    await page.waitUntil(async () => {
      const newState = await page.$eval(editable, getDocFromElement);
      const newAltText = newState.content[1].content[0].attrs.alt;
      return newAltText !== oldAltText;
    }, 'alt text did not change in prosemirror state');

    //await until editor onchage prop is called
    await page.waitUntil(async () => {
      const onChangeCounter = await browser.execute(() => {
        return (window as any).onChangeCounter;
      });
      return !!onChangeCounter;
    }, 'onChange history did not change');

    // make sure input is focused
    await altTextInput.click();
    await page.waitUntil(async () => {
      return await altTextInput.isFocused();
    }, 'Alt text input is not focused');

    // need to use setvalue here on input element for key combo to work reliably across browsers
    await altTextInput.setValue(['Control', 'z']);
    await page.waitUntil(async () => {
      const altTextInput = await page.$(inputSelector);
      return (await altTextInput.getValue()) === 'alttext';
    }, 'Does not undo after pressing Ctrl+z');

    await altTextInput.setValue(['Control', 'y']);
    await page.waitUntil(async () => {
      return (await altTextInput.getValue()) === '';
    }, 'Does not redo after pressing Ctrl+y');
  },
);
