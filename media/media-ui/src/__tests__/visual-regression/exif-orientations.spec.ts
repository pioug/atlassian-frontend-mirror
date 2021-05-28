import {
  getExampleUrl,
  pageSelector,
} from '@atlaskit/visual-regression/helper';

async function setup(url: string) {
  const { page } = global;
  await page.goto(url);
  await page.waitForSelector(pageSelector);
  const image = await page.screenshot();
  return { image };
}

describe('MediaImage Exif', () => {
  it('should render images with Exif orientation correctly', async () => {
    const url = getExampleUrl(
      'media',
      'media-ui',
      'exif-orientations-vr',
      global.__BASEURL__,
    );
    const { image } = await setup(url);
    expect(image).toMatchProdImageSnapshot();
  });
});
