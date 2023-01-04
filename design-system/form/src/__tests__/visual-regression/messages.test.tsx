import {
  getExampleUrl,
  loadExampleUrl,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('<Message />', () => {
  const url = getExampleUrl('design-system', 'form', 'messages');

  it('should render single line text correctly', async () => {
    const { page } = global;
    await loadExampleUrl(page, url);
    const selector = '[data-testid="messages--short"]';
    await page.waitForSelector(selector);
    const image = await takeElementScreenShot(page, selector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('should render multiline text correctly', async () => {
    const { page } = global;
    await loadExampleUrl(page, url);
    const selector = '[data-testid="messages--long"]';
    await page.waitForSelector(selector);
    const image = await takeElementScreenShot(page, selector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('should render inline elements correctly', async () => {
    const { page } = global;
    await loadExampleUrl(page, url);
    const selector = '[data-testid="messages--inline-content"]';
    await page.waitForSelector(selector);
    const image = await takeElementScreenShot(page, selector);
    expect(image).toMatchProdImageSnapshot();
  });
});
