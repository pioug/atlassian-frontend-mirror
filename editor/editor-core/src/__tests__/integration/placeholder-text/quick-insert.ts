import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  fullpage,
  getDocFromElement,
  quickInsert,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';

const placeholderInputSelector = 'input[placeholder="Add placeholder text"]';

BrowserTestCase(
  'quick-insert.ts: Insert placeholder text via quick insert',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTemplatePlaceholders: {
        allowInserting: true,
      },
    });

    await page.click(fullpage.placeholder);
    await quickInsert(page, 'Placeholder text');

    await page.isVisible(placeholderInputSelector);

    await page.type(
      placeholderInputSelector,
      'this text should be in the placeholder',
    );

    await page.keys(['Enter']);

    const doc = await page.$eval(editable, getDocFromElement);
    const content = doc.content[0];

    // On Windows Chrome, trailing space is added after the text (on macOS leading space is added)
    // Therefore a snapshot comparison can't be used
    expect(content).toMatchObject({
      content: [
        expect.objectContaining({
          attrs: expect.objectContaining({
            text: 'this text should be in the placeholder',
          }),
          type: 'placeholder',
        }),
      ],
      type: 'paragraph',
    });
  },
);
