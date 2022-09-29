import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { KEY } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
import {
  fullpage,
  setProseMirrorTextSelection,
  getDocFromElement,
  editable,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import { annotationSelectors } from '../_utils';
import * as paragraphADF from '../__fixtures__/paragraph.adf.json';
import * as paragraphEmojiADF from '../__fixtures__/paragraph-with-emoji.adf.json';

const shortcutWindows = [KEY.CONTROL, KEY.ALT, 'c', KEY.CONTROL, KEY.ALT];
const shortcutMac = [KEY.META, KEY.ALT, 'c', KEY.META, KEY.ALT];

BrowserTestCase(
  `can open create dialogue from toolbar`,
  {},
  async (client: BrowserObject) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      defaultValue: paragraphADF,
      appearance: fullpage.appearance,
      annotationProviders: true,
    });

    await setProseMirrorTextSelection(page, { anchor: 5, head: 30 });
    await page.waitFor(annotationSelectors.floatingToolbarCreate);
    await page.click(annotationSelectors.floatingToolbarCreate);

    expect(await page.isExisting(annotationSelectors.component)).toBe(true);
  },
);

BrowserTestCase(
  `can create an annotation from the component`,
  {},
  async (client: BrowserObject, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      defaultValue: paragraphADF,
      appearance: fullpage.appearance,
      annotationProviders: true,
    });

    await setProseMirrorTextSelection(page, { anchor: 5, head: 30 });
    await page.waitFor(annotationSelectors.floatingToolbarCreate);
    await page.click(annotationSelectors.floatingToolbarCreate);

    await page.waitFor(annotationSelectors.component);
    await page.waitFor(annotationSelectors.componentSave);
    await page.click(annotationSelectors.componentSave);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `can create annotation dialogue from keyboard shortcut`,
  {},
  async (client: BrowserObject) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      defaultValue: paragraphADF,
      appearance: fullpage.appearance,
      annotationProviders: true,
    });

    const keys = page.isWindowsPlatform() ? shortcutWindows : shortcutMac;
    await setProseMirrorTextSelection(page, { anchor: 4, head: 11 });
    await page.waitFor(annotationSelectors.floatingToolbarCreate);
    await client.keys(keys);

    expect(await page.isExisting(annotationSelectors.component)).toBe(true);
  },
);
BrowserTestCase(
  `cannot create annotation dialogue from keyboard shortcut with inline selection`,
  {},
  async (client: BrowserObject) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      defaultValue: paragraphEmojiADF,
      appearance: fullpage.appearance,
      annotationProviders: true,
    });

    const keys = page.isWindowsPlatform() ? shortcutWindows : shortcutMac;
    // select text which includes emojis
    await setProseMirrorTextSelection(page, { anchor: 4, head: 17 });
    await page.waitFor(annotationSelectors.floatingToolbarCreate);
    await client.keys(keys);
    expect(await page.isExisting(annotationSelectors.component)).toBe(false);
  },
);
