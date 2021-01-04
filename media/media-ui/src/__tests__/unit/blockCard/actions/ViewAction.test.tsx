let mockViewUrl = jest.fn();

import { mockUrl } from '../../../__mocks__/get-resolved-props';
import { ViewAction } from '../../../../BlockCard/actions/ViewAction';
import { renderWithIntl } from '../../../__utils__/render';

describe('ViewAction', () => {
  beforeEach(() => {
    mockViewUrl = jest.fn();
    window.open = mockViewUrl;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('bails out when no URL provided', async () => {
    const action = ViewAction({ url: undefined });
    expect(action).toEqual({
      id: 'view-content',
      text: expect.any(Object),
      promise: expect.any(Function),
    });

    const { container } = renderWithIntl(action.text);
    expect(container.textContent).toBe('View');

    const handlerExecutor = action.promise;
    await expect(handlerExecutor()).resolves.toBe(undefined);
    expect(mockViewUrl).toBeCalledTimes(0);
  });

  it('attempts to navigate to provided url', async () => {
    const url = mockUrl;
    const action = ViewAction({ url });
    expect(action).toEqual({
      id: 'view-content',
      text: expect.any(Object),
      promise: expect.any(Function),
    });

    const { container } = renderWithIntl(action.text);
    expect(container.textContent).toBe('View');

    const handlerExecutor = action.promise;
    await expect(handlerExecutor()).resolves.toBe(undefined);
    expect(mockViewUrl).toBeCalledTimes(1);
    expect(mockViewUrl).toBeCalledWith(mockUrl, '_blank', 'noopener=yes');
  });
});
