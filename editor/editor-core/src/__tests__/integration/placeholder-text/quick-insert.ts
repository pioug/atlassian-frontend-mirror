import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  fullpage,
  getDocFromElement,
  quickInsert,
} from '../_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';

const placeholderNodeSelector = '[data-placeholder]';

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

    await page.waitForSelector(placeholderNodeSelector);

    await page.type(editable, 'this text should be in the placeholder');

    const doc = await page.$eval(editable, getDocFromElement);
    const content = doc.content[0];

    // On Windows Chrome, trailing space is added after the text (on macOS leading space is added)
    // Therefore a snapshot comparison can't be used
    expect(content).toMatchObject({
      content: [
        expect.objectContaining({ type: 'placeholder' }),
        expect.objectContaining({
          text: expect.stringContaining(
            'this text should be in the placeholder',
          ),
          type: 'text',
        }),
      ],
      type: 'paragraph',
    });
  },
);
