import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
} from '@atlaskit/visual-regression/helper';

async function waitForInlineCode(page: PuppeteerPage) {
  await page.waitForSelector('code > .token');
  await page.waitForSelector('code > .token,operator');
  await page.waitForSelector('code > .token,punctuation');
}

async function waitForCodeblock(page: PuppeteerPage) {
  await waitForInlineCode(page);
  await page.waitForSelector('code > .react-syntax-highlighter-line-number');
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
    const image = await page.screenshot();

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
    const image = await page.screenshot({ fullPage: true });

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
    const image = await page.screenshot({ fullPage: true });

    expect(image).toMatchProdImageSnapshot();
  });
  it('AppleScript code example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'code',
      'applescript',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForCodeblock(page);
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });
  it('Clojure code example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'code',
      'clojure',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForCodeblock(page);
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });
  it('Delphi code example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'code',
      'delphi',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForCodeblock(page);
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });
  it('Diff code example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'code',
      'diff',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForCodeblock(page);
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });
  it('FoxPro code example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'code',
      'foxpro',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForCodeblock(page);
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });
  it('Object Pascal code example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'code',
      'object-pascal',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForCodeblock(page);
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });
  it('QML code example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'code',
      'qml',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForCodeblock(page);
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });
  it('Standard ML code example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'code',
      'standard-ml',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForCodeblock(page);
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });
  it('Visual Basic code example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'code',
      'visual-basic',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForCodeblock(page);
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });
  it('CSS code example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'code',
      'cascading-style-sheets',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForCodeblock(page);
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });
  it('Javascript code example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'code',
      'jsx',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForCodeblock(page);
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });
});
