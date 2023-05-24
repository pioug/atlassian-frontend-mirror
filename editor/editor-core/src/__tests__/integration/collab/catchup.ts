import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import WebdriverPage from '@atlaskit/webdriver-runner/wd-wrapper';
import { getExampleUrl as getWDExampleUrl } from '@atlaskit/webdriver-runner/utils/example';

const pmSelector = '.ProseMirror';

BrowserTestCase(
  'Should focus the editor when shouldFocus is true and disabled changes to false',
  // Skipped because this test isn't appropriate for pipelines
  {},
  async (client: any) => {
    const page = new WebdriverPage(client);
    const searchParams = new URLSearchParams();

    searchParams.append(
      'documentId',
      `testing-catchup-error-${page.getBrowserName()}`,
    );

    const url = getWDExampleUrl(
      'editor',
      'editor-core',
      'testing-collaborative-editing-catchup',
    )
      .concat('&')
      .concat(searchParams.toString());

    await page.goto(url);
    await page.waitForSelector(pmSelector);
    await page.teardownMockDate();

    await page.click('[data-testid="editor-collab_simulate-typing-button"]');

    await new Promise((resolve) => {
      setTimeout(async () => {
        await page.click('[data-testid="editor-collab_publish-button"]');
        resolve(null);
      }, 1000);
    });

    await new Promise((resolve) => {
      setTimeout(() => resolve(null), 20000);
    });

    const errorExists = await page.isExisting(
      '[data-testid="editor-collab__error-on-publishing"]',
    );
    expect(errorExists).toBe(false);
  },
);
