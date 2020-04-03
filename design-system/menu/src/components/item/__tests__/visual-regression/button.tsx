import {
  getExampleUrl,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

declare var global: any;

const buttonLink = "[data-testid='item-button']";
const buttonLinkAtScale = "[data-testid='item-button-at-scale']";
const buttonLinkAtScaleBeforeAfter =
  "[data-testid='item-button-at-scale-before-after']";
const buttonLinkDisabled = "[data-testid='item-button-disabled']";
const buttonLinkSelected = "[data-testid='item-button-selected']";
const buttonLinkBefore = "[data-testid='item-button-before']";
const buttonLinkAfter = "[data-testid='item-button-after']";
const buttonLinkBeforeAfter = "[data-testid='item-button-before-after']";
const buttonLinkDescription = "[data-testid='item-button-description']";

describe('<ButtonItem />', () => {
  const openExamplesAndWaitFor = async (selector: string) => {
    const url = getExampleUrl(
      'core',
      'menu',
      'item-variations',
      global.__BASEURL__,
    );
    const { page } = global;

    await page.goto(url);
    await page.waitForSelector(selector);
  };

  it('should match the default state', async () => {
    await openExamplesAndWaitFor(buttonLink);

    expect(
      await takeElementScreenShot(global.page, buttonLink),
    ).toMatchProdImageSnapshot();
  });

  it('should match the hovered state', async () => {
    await openExamplesAndWaitFor(buttonLink);

    await global.page.hover(buttonLink);

    expect(
      await takeElementScreenShot(global.page, buttonLink),
    ).toMatchProdImageSnapshot();
  });

  it('should match the clicked state', async () => {
    await openExamplesAndWaitFor(buttonLink);

    await global.page.hover(buttonLink);
    await global.page.mouse.down();

    expect(
      await takeElementScreenShot(global.page, buttonLink),
    ).toMatchProdImageSnapshot();
  });

  it('should match item with before element', async () => {
    await openExamplesAndWaitFor(buttonLinkBefore);

    expect(
      await takeElementScreenShot(global.page, buttonLinkBefore),
    ).toMatchProdImageSnapshot();
  });

  it('should match item with after element', async () => {
    await openExamplesAndWaitFor(buttonLinkAfter);

    expect(
      await takeElementScreenShot(global.page, buttonLinkAfter),
    ).toMatchProdImageSnapshot();
  });

  it('should match item with before & after element', async () => {
    await openExamplesAndWaitFor(buttonLinkBeforeAfter);

    expect(
      await takeElementScreenShot(global.page, buttonLinkBeforeAfter),
    ).toMatchProdImageSnapshot();
  });

  it('should match disabled item', async () => {
    await openExamplesAndWaitFor(buttonLinkDisabled);

    expect(
      await takeElementScreenShot(global.page, buttonLinkDisabled),
    ).toMatchProdImageSnapshot();
  });

  it('should match selected item', async () => {
    await openExamplesAndWaitFor(buttonLinkSelected);

    expect(
      await takeElementScreenShot(global.page, buttonLinkSelected),
    ).toMatchProdImageSnapshot();
  });

  it('should match item with description', async () => {
    await openExamplesAndWaitFor(buttonLinkDescription);

    expect(
      await takeElementScreenShot(global.page, buttonLinkDescription),
    ).toMatchProdImageSnapshot();
  });

  it('should match item with lots of text', async () => {
    await openExamplesAndWaitFor(buttonLinkAtScale);

    expect(
      await takeElementScreenShot(global.page, buttonLinkAtScale),
    ).toMatchProdImageSnapshot();
  });

  it('should match item with lots of text with before and after icon', async () => {
    await openExamplesAndWaitFor(buttonLinkAtScaleBeforeAfter);

    expect(
      await takeElementScreenShot(global.page, buttonLinkAtScaleBeforeAfter),
    ).toMatchProdImageSnapshot();
  });
});
