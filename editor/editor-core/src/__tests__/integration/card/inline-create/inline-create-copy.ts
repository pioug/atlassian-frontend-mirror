import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  getDocFromElement,
  editable,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
type ClientType = Parameters<typeof goToEditorTestingWDExample>[0];
import * as inlineCardAdf from '../_fixtures_/inline-card.adf.json';
import { waitForInlineCardSelection } from '@atlaskit/media-integration-test-helpers';

// FIXME: This test was automatically skipped due to failure on 02/02/2023: https://product-fabric.atlassian.net/browse/ED-16751
BrowserTestCase(
  'card: copy-paste within editor should work',
  {
    // skip: ['safari'],
    skip: ['*'],
  },
  async (client: ClientType, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
      defaultValue: JSON.stringify(inlineCardAdf),
      smartLinks: {},
    });

    // Wait for the inline link.
    await waitForInlineCardSelection(page);

    // Copy the link.
    await page.copy();
    await page.keys(['ArrowRight']);

    // Type some text.
    await page.type(editable, ' have another one ');
    await page.paste();

    // Type some more text.
    await page.type(editable, 'now you have two!');

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
