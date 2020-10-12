import { ssr_hydrate } from '@atlaskit/elements-test-helpers';

describe('SSR - Task Inline ', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'error');
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('rendering and hydration are ok', async () => {
    await ssr_hydrate(__dirname, './samples/_task-inline.tsx');

    // eslint-disable-next-line no-console
    expect(console.error).not.toBeCalled();
  });
});
