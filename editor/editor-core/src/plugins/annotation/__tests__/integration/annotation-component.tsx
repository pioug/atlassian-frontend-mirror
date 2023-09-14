import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import type { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { KEY } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
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

// FIXME: This test was automatically skipped due to failure on 17/08/2023: https://product-fabric.atlassian.net/browse/ED-19558
BrowserTestCase(
  `can open create dialogue from toolbar`,
  {
    skip: ['*'],
  },
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

// FIXME: This test was automatically skipped due to failure on 17/08/2023: https://product-fabric.atlassian.net/browse/ED-19559
BrowserTestCase(
  `can create an annotation from the component`,
  {
    skip: ['*'],
  },
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

// FIXME: This test was automatically skipped due to failure on 17/08/2023: https://product-fabric.atlassian.net/browse/ED-19560
BrowserTestCase(
  `can create annotation dialogue from keyboard shortcut`,
  {
    skip: ['*'],
  },
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
// FIXME: This test was automatically skipped due to failure on 17/08/2023: https://product-fabric.atlassian.net/browse/ED-19561
BrowserTestCase(
  `cannot create annotation dialogue from keyboard shortcut with inline selection`,
  {
    skip: ['*'],
  },
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
