import { ssr_hydrate } from '@atlaskit/elements-test-helpers';

const ExamplesPath = '../../../../examples';

describe.skip('server side rendering and hydration', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'error');
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test.each([
    ['00-custom-colors.tsx'],
    ['01-date-with-style.tsx'],
    ['02-custom-format.tsx'],
    ['03-dark-custom-colors.tsx'],
  ])('ssr("%s")', async (fileName: string) => {
    await ssr_hydrate(__dirname, `${ExamplesPath}/${fileName}`);

    // eslint-disable-next-line no-console
    expect(console.error).not.toBeCalled();
  });
});
