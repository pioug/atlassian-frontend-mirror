import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  getDocFromElement,
  editable,
  insertMedia,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { Appearance } from '@atlaskit/editor-test-helpers/vr-utils/base-utils';

BrowserTestCase(
  `list: insert a media single inside a bullet list`,
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: Appearance.fullPage,
      media: {
        allowMediaSingle: true,
      },
    });
    await page.click('[aria-label="Lists"]');
    await page.waitForSelector('[aria-label="Bullet list"]');
    await page.click('[aria-label="Bullet list"]');
    await page.type(editable, '*');

    await insertMedia(page);
    expect(await page.isVisible('[data-testid="media-file-card-view"]')).toBe(
      true,
    );

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `list: insert a media single inside a numbered list`,
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: Appearance.fullPage,
      media: {
        allowMediaSingle: true,
      },
    });
    await page.click('[aria-label="Lists"]');
    await page.waitForSelector('[aria-label="Numbered list"');
    await page.click('[aria-label="Numbered list"');
    await page.type(editable, '*');

    await insertMedia(page);
    expect(await page.isVisible('[data-testid="media-file-card-view"]')).toBe(
      true,
    );

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
