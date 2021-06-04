import { ssr_hydrate } from '@atlaskit/elements-test-helpers';

const ExamplesPath = '../../../../examples';
//TODO: Please remove the commented examples when https://product-fabric.atlassian.net/browse/FS-4164 is fixed.

describe.skip('server side rendering and hydration', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'error');
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test.each([
    ['00-single.tsx'],
    ['01-multi.tsx'],
    ['02-async-options-loading.tsx'],
    ['03-single-compact.tsx'],
    ['04-single-subtle.tsx'],
    ['05-single-subtle-and-compact.tsx'],
    ['06-multi-compact.tsx'],
    ['07-multi-with-default-values.tsx'],
    ['08-multi-with-fixed-values.tsx'],
    ['09-single-disabled.tsx'],
    ['11-watchers.tsx'],
    ['12-creatable-with-locale.tsx'],
  ])('ssr("%s")', async (fileName: string) => {
    await ssr_hydrate(__dirname, `${ExamplesPath}/${fileName}`);

    // eslint-disable-next-line no-console
    expect(console.error).not.toBeCalled();
  });

  test.skip.each([
    ['10-in-a-table-cell.tsx'], // depends on document (DOM)
  ])('ssr("%s")', async (fileName: string) => {
    await ssr_hydrate(__dirname, `${ExamplesPath}/${fileName}`);

    // eslint-disable-next-line no-console
    expect(console.error).not.toBeCalled();
  });
});
