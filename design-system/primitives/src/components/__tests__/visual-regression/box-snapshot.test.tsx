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

describe('Box customStyles', () => {
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

const responsiveBoxProps = ['border-width', 'display', 'padding'] as const;
describe('Responsive Box', () => {
  responsiveBoxProps.forEach(testId => {
    it.each([320, 600, 1024, 1500])(
      `With viewport width "%s": Should match production example for prop "${testId}"`,
      async (width: number) => {
        const url = getExampleUrl(
          'design-system',
          'primitives',
          'box-responsive',
          global.__BASEURL__,
        );
        const { page } = global;
        await page.setViewport({
          width,
          height: 1000,
        });
        await loadPage(page, url);

        const image = await takeElementScreenShot(
          page,
          `[data-testid="box-responsive-${testId}"]`,
        );
        expect(image).toMatchProdImageSnapshot();
      },
    );
  });
});
