import { getExamplesFor, ssr } from '@atlaskit/ssr';

// @ts-ignore - global usage
jest.spyOn(global.console, 'error').mockImplementation(() => {});

afterEach(() => {
  jest.resetAllMocks();
});

describe('ssr for emoji', () => {
  it('should not throw when rendering any example on the server', async () => {
    const examples = await getExamplesFor('emoji');

    const result: string[] = await Promise.all(
      examples.map((example: any) =>
        ssr(example.filePath)
          .then(() => undefined)
          .catch((err: string) => `${example.filePath} ${err}`),
      ),
    );

    expect(result.filter(Boolean).join('\n')).toEqual('');
  });

  it('should not log errors when rendering emoji on the server', async () => {
    const examples = await getExamplesFor('emoji');

    await Promise.all(
      examples.map((example: any) =>
        ssr(example.filePath).catch(() => undefined),
      ),
    );

    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledTimes(0);

    expect(
      // eslint-disable-next-line no-console
      (console.error as jest.Mock).mock.calls
        .map((call) => call.join(''))
        .join(''),
    ).toEqual('');
  });
});
