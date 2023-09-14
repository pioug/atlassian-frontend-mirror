import { selectors } from '@atlaskit/renderer/src/__tests__/__helpers/page-objects/_media';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { waitForNumImages } from '@atlaskit/editor-test-helpers/integration/media';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  editable,
  getDocFromElement,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import adf from './__fixtures__/one-image.adf';

BrowserTestCase(
  'inserting.ts: Inserts caption on click of placeholder',
  {},
  async (
    client: Parameters<typeof goToEditorTestingWDExample>[0],
    _testName: string,
  ) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      defaultValue: JSON.stringify(adf),
      media: {
        allowMediaSingle: true,
        allowCaptions: true,
      },
    });

    const [image] = await waitForNumImages(page, 1);

    await image.click();
    await page.click(selectors.captionPlaceholder);

    expect(await page.isVisible(selectors.caption)).toBe(true);
    await page.keys(['h', 'e', 'l', 'l', 'o']);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc.content[0].content[1].content[0].text).toEqual('hello');
  },
);
