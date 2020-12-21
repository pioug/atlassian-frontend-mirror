import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import { KEY } from '../../../../__tests__/__helpers/page-objects/_keyboard';
import {
  fullpage,
  setProseMirrorTextSelection,
  getDocFromElement,
  editable,
} from '../../../../__tests__/integration/_helpers';
import { annotationSelectors } from '../_utils';
import * as paragraphADF from '../__fixtures__/paragraph.adf.json';
import * as paragraphEmojiADF from '../__fixtures__/paragraph-with-emoji.adf.json';

const shortcutWindows = [KEY.CONTROL, KEY.ALT, 'c', KEY.CONTROL, KEY.ALT];
const shortcutMac = [KEY.META, KEY.ALT, 'c', KEY.META, KEY.ALT];

BrowserTestCase(
  `can open create dialogue from toolbar`,
  { skip: ['edge'] },
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
  { skip: ['edge'] },
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
  { skip: ['edge'] },
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
  { skip: ['edge'] },
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
