import {
  getExampleUrl,
  pageSelector,
} from '@atlaskit/visual-regression/helper';
import path from 'path';

async function setup() {
  const url = getExampleUrl(
    'media',
    'media-avatar-picker',
    'avatar-picker-with-viewport-debug',
    global.__BASEURL__,
  );

  const { page } = global;
  await page.goto(url);
  await page.waitForSelector(pageSelector);

  return { page };
}

describe('Media Picker', () => {
  it.skip('should render different UI states', async () => {
    const { page } = await setup();

    page.click('button');
    await page.waitForSelector('input[type="file"]');
    const chooserPromise = page.waitForFileChooser();
    await page.click('[data-testid="upload-button"]');

    // this is needed due to: https://github.com/puppeteer/puppeteer/issues/6040
    const fileChooser = await chooserPromise;
    const filePath = path.relative(
      process.cwd(),
      path.join(__dirname, './__fixtures__/landscape_4.jpg'),
    );
    await fileChooser.accept([filePath]);
    await new Promise((resolve) => setTimeout(resolve, 10_000));
    await page.waitForSelector('#image-container');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
