import {
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

type Options = {
  viewport: {
    width: number;
    height: number;
  };
};

const verifyElementIn = (url: string, options?: Options) => async (
  selector: string,
  interact?: () => Promise<void>,
) => {
  const { page } = global;

  if (options?.viewport) {
    await page.setViewport(options.viewport);
  }

  await loadPage(page, url);
  await page.waitForSelector(selector);

  if (interact) {
    await interact();
  }

  expect(
    await takeElementScreenShot(page, selector),
  ).toMatchProdImageSnapshot();
};

const hover = (selector: string): (() => Promise<void>) => {
  return async () => {
    const { page } = global;
    await page.hover(selector);
  };
};

const mouseDown = (selector: string): (() => Promise<void>) => {
  return async () => {
    const { page } = global;
    await page.hover(selector);
    await page.mouse.down();
  };
};

const click = (selector: string): (() => Promise<void>) => {
  return async () => {
    const { page } = global;
    await page.click(selector);
  };
};

const focus = (selector: string): (() => Promise<void>) => {
  return async () => {
    const { page } = global;
    await page.focus(selector);
  };
};

export { click, focus, hover, mouseDown, verifyElementIn };
