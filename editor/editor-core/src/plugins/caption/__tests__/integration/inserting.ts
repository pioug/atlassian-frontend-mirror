import { selectors } from '@atlaskit/renderer/src/__tests__/__helpers/page-objects/_media';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { waitForNumImages } from '../../../../__tests__/integration/media/_utils';
import {
  editable,
  getDocFromElement,
} from '../../../../__tests__/integration/_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import adf from './__fixtures__/one-image.adf';

BrowserTestCase(
  'inserting.ts: Inserts caption on click of placeholder',
  { skip: ['edge'] },
  async (
    client: Parameters<typeof goToEditorTestingWDExample>[0],
    testName: string,
  ) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      defaultValue: JSON.stringify(adf),
      media: {
        allowMediaSingle: true,
        featureFlags: {
          captions: true,
        },
      },
    });

    const [image] = await waitForNumImages(page, 1);

    await image.click();
    await page.remoteDOMClick(selectors.captionPlaceholder);

    expect(await page.isVisible(selectors.caption)).toBe(true);
    await page.keys(['h', 'e', 'l', 'l', 'o']);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc.content[0].content[1].content[0].text).toEqual('hello');
  },
);
