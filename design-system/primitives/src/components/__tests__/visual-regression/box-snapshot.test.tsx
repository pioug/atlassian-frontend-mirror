import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Box', () => {
  [
    'borderColor',
    'backgroundColor',
    'background-and-padding',
    'background-and-paddingBlock',
    'background-and-paddingInline',
    'shadow',
    'layer',
  ].forEach(selector => {
    it(`example with ${selector} should match snapshot`, async () => {
      const url = getExampleUrl(
        'design-system',
        'primitives',
        'box',
        global.__BASEURL__,
        'light',
      );
      const { page } = global;

      await loadPage(page, url);

      const image = await takeElementScreenShot(
        page,
        `[data-testid="box-with-${selector}"]`,
      );
      expect(image).toMatchProdImageSnapshot();
    });
  });
});

describe('Box padding', () => {
  const paddingTypes = [
    'padding',
    'paddingBlock',
    'paddingBlockStart',
    'paddingBlockEnd',
    'paddingInline',
    'paddingInlineStart',
    'paddingInlineEnd',
  ];

  paddingTypes.forEach(paddingType => {
    it(`example with ${paddingType} should match snapshot`, async () => {
      const url = getExampleUrl(
        'design-system',
        'primitives',
        'box-padding',
        global.__BASEURL__,
        'light',
      );
      const { page } = global;
      await loadPage(page, url);
      const image = await takeElementScreenShot(
        page,
        `[data-testid="box-with-background-and-${paddingType}"]`,
      );
      expect(image).toMatchProdImageSnapshot();
    });
  });

  it(`example with multiple padding values should match snapshot`, async () => {
    const url = getExampleUrl(
      'design-system',
      'primitives',
      'box-padding',
      global.__BASEURL__,
      'light',
    );
    const { page } = global;
    await loadPage(page, url);
    const image = await takeElementScreenShot(
      page,
      `[data-testid="box-with-background-and-overlapping-padding-props"]`,
    );
    expect(image).toMatchProdImageSnapshot();
  });
});

describe('Box color', () => {
  it(`example with backgroundColor should match snapshot`, async () => {
    const url = getExampleUrl(
      'design-system',
      'primitives',
      'box-color',
      global.__BASEURL__,
      'light',
    );
    const { page } = global;
    await loadPage(page, url);

    const image = await takeElementScreenShot(
      page,
      '[data-testid="box-with-backgroundColor"]',
    );
    expect(image).toMatchProdImageSnapshot();
  });

  it(`example with color should match snapshot`, async () => {
    const url = getExampleUrl(
      'design-system',
      'primitives',
      'box-color',
      global.__BASEURL__,
      'light',
    );
    const { page } = global;
    await loadPage(page, url);

    const image = await takeElementScreenShot(
      page,
      '[data-testid="box-with-color"]',
    );
    expect(image).toMatchProdImageSnapshot();
  });
});

describe('Box style', () => {
  it(`example with custom width should match snapshot`, async () => {
    const url = getExampleUrl(
      'design-system',
      'primitives',
      'box-custom-styles',
      global.__BASEURL__,
      'light',
    );
    const { page } = global;
    await loadPage(page, url);

    const image = await takeElementScreenShot(
      page,
      '[data-testid="box-custom-width"]',
    );
    expect(image).toMatchProdImageSnapshot();
  });

  it(`example with custom padding should match snapshot`, async () => {
    const url = getExampleUrl(
      'design-system',
      'primitives',
      'box-custom-styles',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);

    const image = await takeElementScreenShot(
      page,
      '[data-testid="box-custom-padding"]',
    );
    expect(image).toMatchProdImageSnapshot();
  });
});
