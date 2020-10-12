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
    ['00-simple-mention-item.tsx'],
    ['01-mention-item.tsx'],
    ['07-dark-simple-mention.tsx'],
    ['07-simple-mention.tsx'],
    ['08-resourced-mention-on-n20-background.tsx'],
  ])('ssr("%s")', async (fileName: string) => {
    await ssr_hydrate(__dirname, `${ExamplesPath}/${fileName}`);

    // eslint-disable-next-line no-console
    expect(console.error).not.toBeCalled();
  });
});
