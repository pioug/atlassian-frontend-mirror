import { AuthorizeAction } from '../../../../BlockCard';
import { renderWithIntl } from '../../../__utils__/render';

describe('AuthorizeAction', () => {
  it('sets up a handler which triggers on promise execution', async () => {
    const handler = jest.fn().mockReturnValue('action invoked');
    const action = AuthorizeAction(handler);
    expect(action).toEqual({
      id: 'connect-account',
      text: expect.any(Object),
      promise: expect.any(Function),
      buttonAppearance: 'default',
    });

    const { container } = renderWithIntl(action.text);
    expect(container.textContent).toBe('Connect');

    const handlerExecutor = action.promise;
    await expect(handlerExecutor()).resolves.toBe('action invoked');
    expect(handler).toBeCalledTimes(1);
    expect(handler).toBeCalledWith();
  });
});
