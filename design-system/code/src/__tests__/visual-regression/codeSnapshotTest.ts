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
  it('Inline code basic example should match production example', async () => {
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
  it('Code block example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'code',
      'code-block-basic',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForCodeblock(page);
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });
});
