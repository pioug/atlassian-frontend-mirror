import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getDocFromElement, editable } from '../../_helpers';

import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../__helpers/testing-example-helpers';
import * as cardFatalAdf from '../_fixtures_/inline-card-adf.fatal.json';

// FIXME: This test was automatically skipped due to failure on 8/24/2021: https://product-fabric.atlassian.net/browse/ED-13659
BrowserTestCase(
  `card: pasting a fatal error link should turn to href in adf`,
  {
    // skip: ['safari', 'edge'],
    skip: ['*'],
  },
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
      defaultValue: JSON.stringify(cardFatalAdf),
      smartLinks: {},
    });

    // Assert that it falls back to regular blue link in browser
    const linkSelector = `a[href$="fatal"]`;
    await page.waitForSelector(linkSelector);
    await page.click(linkSelector);
    await page.waitForSelector('button[aria-label="Edit link"]');
    // Expect the dropdown menu to not be visible
    await page.waitForSelector(
      'span[aria-label="Expand dropdown menu"]',
      undefined,
      true,
    );

    // Assert that we have regular blue link in ADF
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
