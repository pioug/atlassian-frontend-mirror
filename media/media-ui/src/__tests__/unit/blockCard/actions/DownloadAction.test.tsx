let mockDownloadUrl = jest.fn();
jest.mock('@atlaskit/media-common', () => ({
  downloadUrl: (...args: any) => mockDownloadUrl(...args),
}));

import { mockUrl } from '../../../__mocks__/get-resolved-props';
import { DownloadAction } from '../../../../BlockCard/actions/DownloadAction';
import { renderWithIntl } from '../../../__utils__/render';

describe('DownloadAction', () => {
  beforeEach(() => {
    mockDownloadUrl = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('bails out when no URL provided', async () => {
    const action = DownloadAction({ url: undefined });
    expect(action).toEqual({
      id: 'download-content',
      text: expect.any(Object),
      promise: expect.any(Function),
    });

    const { container } = renderWithIntl(action.text);
    expect(container.textContent).toBe('Download');

    const handlerExecutor = action.promise;
    await expect(handlerExecutor()).resolves.toBe(undefined);
    expect(mockDownloadUrl).toBeCalledTimes(0);
  });

  it('attempts download from provided url', async () => {
    const url = mockUrl;
    const action = DownloadAction({ url });
    expect(action).toEqual({
      id: 'download-content',
      text: expect.any(Object),
      promise: expect.any(Function),
    });

    const { container } = renderWithIntl(action.text);
    expect(container.textContent).toBe('Download');

    const handlerExecutor = action.promise;
    await expect(handlerExecutor()).resolves.toBe(undefined);
    expect(mockDownloadUrl).toBeCalledTimes(1);
    expect(mockDownloadUrl).toBeCalledWith(mockUrl);
  });
});
