import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import { ssr } from '@atlaskit/ssr';

// @ts-ignore - global usage
jest.spyOn(global.console, 'error').mockImplementation(() => {});

afterEach(() => {
  jest.resetAllMocks();
});

describe('ssr for motion', () => {
  it('should not throw when rendering any example on the server', async () => {
    const examples = await getExamplesFor('motion');

    const result: string[] = await Promise.all(
      examples.map((example: any) =>
        ssr(example.filePath)
          .then(() => undefined)
          .catch((err: string) => err),
      ),
    );

    expect(result.filter(Boolean).join('\n')).toEqual('');
  });

  it('should not log errors when rendering on the server', async () => {
    const examples = await getExamplesFor('motion');

    await Promise.all(
      examples.map((example: any) =>
        ssr(example.filePath).catch(() => undefined),
      ),
    );

    expect(
      // eslint-disable-next-line no-console
      (console.error as jest.Mock).mock.calls
        .map((call) => call.join(''))
        .join(''),
    ).toEqual('');
  });
});
