import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  getDocFromElement,
  insertMention,
  editable,
  lozenge as mentionId,
  fullpage,
} from '../_helpers';
import { codeBlockSelectors } from '../../__helpers/page-objects/_code-block';
import { mentionSearch } from '../../__helpers/page-objects/_mention';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '../../__helpers/testing-example-helpers';
import { selectors } from './../../__helpers/page-objects/_editor';

// add the button click on the right toolbar
BrowserTestCase(
  'mention-3.ts: user can click ToolbarMentionPicker and see mention',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await page.waitForSelector('[aria-label="Mention"]');
    await page.click('[aria-label="Mention"]');
    await page.waitForSelector(mentionId);
    await page.click(mentionId);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'mention-3.ts: should not insert on space if multiple exact nickname match',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await mentionSearch(page, 'gill');
    await page.isVisible('[data-mention-name=pgill]');
    await page.isVisible('[data-mention-name=jjackson]');
    await page.keys(' some text '.split(''));
    const doc = await page.$eval(editable, getDocFromElement);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'mention-3.ts: inserted if space on single match',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await mentionSearch(page, 'Carolyn');
    await page.isVisible('[data-mention-name=Caprice]');
    // Wait until there is only one mention left in picker.
    await page.waitUntil(async () => {
      const mentionsInPicker = await page.$$(
        `${selectors.typeaheadPopup} [data-mention-name]`,
      );
      return mentionsInPicker.length === 1;
    });
    await page.keys(' text '.split(''));
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'mention-3.ts: user should not see mention inside inline code',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await page.type(editable, '`this is inline code ');
    await insertMention(page, 'Carolyn');
    // Remove weird space after the mention
    await page.keys('Backspace');
    await page.type(editable, '`');
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'mention-3.ts: user should not see mention inside a code block',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await page.type(editable, ['``', '`']);
    await page.waitForSelector(codeBlockSelectors.code);
    await page.type(editable, ['this is a code block ', '@Caro']);
    await page.keys(['Return']);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'mention-3.ts: users with same first name should not be selected if space',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await mentionSearch(page, 'alica');
    await page.isVisible('[data-mention-name=awoods]');
    await page.isVisible('[data-mention-name=Fatima]');
    await page.keys(' some text'.split(''));
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
