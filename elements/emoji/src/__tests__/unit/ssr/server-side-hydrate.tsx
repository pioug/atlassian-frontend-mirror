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
    ['00-simple-emoji.tsx'],
    ['01-skin-tone-emoji-by-shortcut.tsx'],
    ['02-content-resourced-emoji.tsx'],
    ['11-emoji-preview-with-description.tsx'],
    ['12-emoji-preview-with-long-name-description-tone-selector.tsx'],
  ])('ssr("%s")', async (fileName: string) => {
    await ssr_hydrate(__dirname, `${ExamplesPath}/${fileName}`);

    // eslint-disable-next-line no-console
    expect(console.error).not.toBeCalled();
  });
});
