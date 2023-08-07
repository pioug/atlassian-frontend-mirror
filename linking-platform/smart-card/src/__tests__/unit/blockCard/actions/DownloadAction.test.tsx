let mockDownloadUrl = jest.fn();
jest.mock('../../../../utils', () => ({
  // @ts-ignore This is an object
  ...jest.requireActual('../../../../utils'),
  downloadUrl: async (...args: any) => mockDownloadUrl(...args),
}));

import { mockUrl } from '../../../__mocks__/get-resolved-props';
import { DownloadAction } from '../../../../view/BlockCard/actions/DownloadAction';
import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';

describe('DownloadAction', () => {
  beforeEach(() => {
    mockDownloadUrl = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
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
