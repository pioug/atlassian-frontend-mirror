import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

async function waitForInlineCode(page: PuppeteerPage) {
  return page.waitForSelector('[data-testid="code-h1"]');
}

async function waitForCodeblock(page: PuppeteerPage) {
  return page.waitForSelector('[data-ds--code--code-block]');
}

describe('Snapshot Test', () => {
  it.each(['light', 'dark', 'none'] as const)(
    'Inline Code basic example should match production example (theme: %s)',
    async (theme) => {
      const url = getExampleUrl(
        'design-system',
        'code',
        'inline-code-basic',
        global.__BASEURL__,
        theme,
      );
      const { page } = global;
      await loadPage(page, url);
      await waitForInlineCode(page);
      const example = await page.waitForSelector('#inline-examples');
      const image = await example?.screenshot();

      expect(image).toMatchProdImageSnapshot();
    },
  );

  it('Inline Code (dark - legacy theming) basic example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'code',
      'inline-code-basic-dark',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForInlineCode(page);
    const example = await page.waitForSelector('#inline-examples');
    const image = await example?.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });

  it.each(['light', 'dark', 'none'] as const)(
    'CodeBlock basic example should match production example (theme: %s)',
    async (theme) => {
      const url = getExampleUrl(
        'design-system',
        'code',
        'code-block-basic',
        global.__BASEURL__,
        theme,
      );
      const { page } = global;
      await loadPage(page, url);
      await waitForCodeblock(page);
      const example = await page.waitForSelector('#examples > div');
      const image = await example?.screenshot();

      expect(image).toMatchProdImageSnapshot();
    },
  );

  it('CodeBlock (dark - legacy theming) basic example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'code',
      'code-block-dark-theme',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForCodeblock(page);
    const example = await page.waitForSelector('#examples > div');
    const image = await example?.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });

  it('SSR should match hydrated component', async () => {
    const url = getExampleUrl(
      'design-system',
      'code',
      'code-block-ssr',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForCodeblock(page);
    const example = await page.waitForSelector('#examples > div');
    const image = await example?.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });

  [
    'AppleScript',
    'Clojure',
    'Delphi',
    'Diff',
    'FoxPro',
    'Object Pascal',
    'QML',
    'Standard ML',
    'Visual Basic',
    'Cascading Style Sheets',
    'JSX',
    'No leaking styles',
  ].forEach((language) => {
    const exampleUrl = language.split(' ').join('-').toLowerCase();
    it(`${language} code example should match production example`, async () => {
      const url = getExampleUrl(
        'design-system',
        'code',
        exampleUrl,
        global.__BASEURL__,
      );
      const { page } = global;
      await loadPage(page, url);
      await waitForCodeblock(page);
      const example = await page.waitForSelector('#examples > div');
      const image = await example?.screenshot();

      expect(image).toMatchProdImageSnapshot();
    });
  });

  it('Empty CodeBlock example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'code',
      'code-block-empty',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForCodeblock(page);
    const example = await page.waitForSelector(
      '#examples [data-testid="empty-codeblocks"]',
    );
    const image = await example?.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });

  it('CodeBidiWarning basic example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'code',
      'code-bidi-characters',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector(
      '[data-testid="bidi-warning-renderedConditionalJs"]',
    );
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('CodeBlock highlighting lines with long lines wrapped should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'code',
      'code-block-highlighting-long-lines',
      global.__BASEURL__,
    );
    const { page } = global;
    await page.setViewport({ width: 450, height: 700 });
    await loadPage(page, url);
    await page.waitForSelector('[data-testid="highlight-long-lines"]');
    const image = await takeElementScreenShot(
      page,
      '[data-testid="highlight-long-lines"]',
    );
    expect(image).toMatchProdImageSnapshot();
  });

  it('CodeBlock syntax highlighting and line wrapping should not be impacted by testId', async () => {
    const url = getExampleUrl(
      'design-system',
      'code',
      'vr-python-test-id-and-wrapping',
      global.__BASEURL__,
    );
    const { page } = global;
    await page.setViewport({ width: 425, height: 900 });
    await loadPage(page, url);
    await page.waitForSelector(
      '[data-testid="testid-and-wrapping-with-python"]',
    );
    const image = await takeElementScreenShot(
      page,
      '[data-testid="testid-and-wrapping-with-python"]',
    );
    expect(image).toMatchProdImageSnapshot();
  });
});
