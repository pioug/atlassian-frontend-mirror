import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
} from '@atlaskit/visual-regression/helper';

async function waitForInlineCode(page: PuppeteerPage) {
  return page.waitForSelector('[data-testid="code-h1"]');
}

async function waitForCodeblock(page: PuppeteerPage) {
  return page.waitForSelector('[data-ds--code--code-block]');
}

describe('Snapshot Test', () => {
  it('Inline Code basic example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'code',
      'inline-code-basic',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForInlineCode(page);
    const example = await page.waitForSelector('#inline-examples');
    const image = await example?.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });
  it('Inline Code (dark) basic example should match production example', async () => {
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
  it('CodeBlock example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'code',
      'code-block-basic',
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
});
