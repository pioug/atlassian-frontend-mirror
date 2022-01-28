import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const rootSelector = '[data-testid="uncontrolled-rating--root"]';
const emptyItemSelector = '[data-testid="uncontrolled-rating--input-empty"]';
const ratingItemSelector = (index: number) =>
  `[data-testid="uncontrolled-rating--${index}--label"]`;

describe('star rating', () => {
  it('should start with nothing checked', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'rating',
      'uncontrolled',
      __BASEURL__,
    );

    await loadPage(page, url);

    expect(
      await takeElementScreenShot(page, rootSelector),
    ).toMatchProdImageSnapshot();
  });

  it('should hover over three stars', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'rating',
      'uncontrolled',
      __BASEURL__,
    );
    await loadPage(page, url);

    await page.hover(ratingItemSelector(2));

    expect(
      await takeElementScreenShot(page, rootSelector),
    ).toMatchProdImageSnapshot();
  });

  it('should start select two stars', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'rating',
      'uncontrolled',
      __BASEURL__,
    );
    await loadPage(page, url);

    await page.click(ratingItemSelector(1));

    expect(
      await takeElementScreenShot(page, rootSelector),
    ).toMatchProdImageSnapshot();
  });

  it('should select three stars using keyboard', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'rating',
      'uncontrolled',
      __BASEURL__,
    );
    await loadPage(page, url);

    await page.focus(emptyItemSelector);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    expect(
      await takeElementScreenShot(page, rootSelector),
    ).toMatchProdImageSnapshot();
  });
});
