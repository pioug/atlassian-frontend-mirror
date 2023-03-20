import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import {
  fullpage,
  quickInsert,
  setProseMirrorTextSelection,
} from '@atlaskit/editor-test-helpers/integration/helpers';

BrowserTestCase(
  `Input query should insert dummy input if theres no query`,
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await setProseMirrorTextSelection(page, { anchor: 1, head: 1 });

    await quickInsert(page, '', false);

    expect(await page.$('input')).toBeTruthy();
  },
);

BrowserTestCase(
  `Input query should maintain same text size as parent p tag`,
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await setProseMirrorTextSelection(page, { anchor: 1, head: 1 });

    await quickInsert(page, '', false);

    const pElement = await page.$('p');
    const pElementFontSize = await pElement.getCSSProperty('font-size');
    const inputQuery = await page.$('input');
    const inputQueryFontSize = await inputQuery.getCSSProperty('font-size');

    expect(pElementFontSize.value).toEqual(inputQueryFontSize.value);
  },
);

BrowserTestCase(
  `Input query carat should maintain same color as typeahead decoration`,
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await setProseMirrorTextSelection(page, { anchor: 1, head: 1 });

    await quickInsert(page, '', false);

    const input = await page.$('input');
    const inputCaretColor = await input.getCSSProperty('caret-color');
    const mark = await page.$('mark');
    const markColor = await mark.getCSSProperty('color');

    expect(inputCaretColor?.parsed?.hex).toEqual(markColor?.parsed?.hex);
  },
);
