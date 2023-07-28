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
  it('should display dropdowns correctly', async () => {
    const url = getURL('basic');
    const page = await setup(url);

    // click Create button
    await page.click('[data-testid="link-create-show"]');
    // Wait for Modal
    await page.waitForSelector('[data-testid="link-create-modal"]');
    // click on dropdown
    await page.click('#link-create-field-asyncSelect-name');
    // wait for list
    await page.waitForSelector('#react-select-2-option-0');

    const image = await page.screenshot({
      clip: { x: 0, y: 0, width: 800, height: 600 },
    });

    expect(image).toMatchProdImageSnapshot();
  });

  it('should display an error message when the component throws', async () => {
    const url = getURL('vr-error-boundary');
    const page = await setup(url);

    // click Create button
    await page.click('[data-testid="link-create-show"]');
    // Wait for Modal
    await page.waitForSelector('[data-testid="link-create-modal"]');
    // remove auto focus
    await page.click('[data-testid="link-create-error-boundary-ui"]');

    const image = await takeElementScreenShot(
      page,
      '[data-testid="link-create-modal"]',
    );

    expect(image).toMatchProdImageSnapshot();
  });

  it('should display an error message when network request fails', async () => {
    const url = getURL('vr-form-error');
    const page = await setup(url);

    // click Show Create button
    await page.click('[data-testid="link-create-show"]');
    // Wait for Modal
    await page.waitForSelector('[data-testid="link-create-modal"]');
    // Wait for Modal
    await page.waitForSelector('[data-testid="link-create-form-error"]');
    // remove auto focus
    await page.click('[data-testid="link-create-modal"]');

    const image = await takeElementScreenShot(
      page,
      '[data-testid="link-create-modal"]',
    );

    expect(image).toMatchProdImageSnapshot();
  });

  it('should display custom title when provided', async () => {
    const url = getURL('vr-modal-title');
    const page = await setup(url);

    // Wait for Modal
    await page.waitForSelector('[data-testid="link-create-modal"]');

    const image = await takeElementScreenShot(
      page,
      '[data-testid="link-create-modal"]',
    );

    expect(image).toMatchProdImageSnapshot();
  });
});
