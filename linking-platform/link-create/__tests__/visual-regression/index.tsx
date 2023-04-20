import {
  disableAllAnimations,
  disableAllTransitions,
  disableScrollBehavior,
  getExampleUrl,
  loadPage,
  LoadPageOptions,
  pageSelector,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

export function getURL(testName: string): string {
  return getExampleUrl(
    'linking-platform',
    'link-create',
    testName,
    global.__BASEURL__,
  );
}

export async function setup(url: string, options: LoadPageOptions = {}) {
  const { page } = global;
  await loadPage(page, url, {
    reloadSameUrl: true,
    ...options,
    allowedSideEffects: {
      tooltips: true,
      ...(options.allowedSideEffects ?? {}),
    },
  });
  await page.waitForSelector(pageSelector);

  // disable animations in TextField
  await disableAllAnimations(page);
  await disableAllTransitions(page);
  await disableScrollBehavior(page);
  return page;
}

describe('link-create', () => {
  it('should display an error message when the component throws', async () => {
    const url = getURL('error-boundary');
    const page = await setup(url);

    // click Create button
    await page.click('[data-testid="link-create-show"]');
    // Wait for Modal
    await page.waitForSelector('[data-testid="link-create"]');
    // remove auto focus
    await page.click('[data-testid="link-create-error-boundary-ui"]');

    const image = await takeElementScreenShot(
      page,
      '[data-testid="link-create"]',
    );

    expect(image).toMatchProdImageSnapshot();
  });
});
