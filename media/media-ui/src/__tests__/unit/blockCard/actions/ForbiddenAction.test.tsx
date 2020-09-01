import { ForbiddenAction } from '../../../../BlockCard';
import { renderWithIntl } from '../../../__utils__/render';

describe('ForbiddenAction', () => {
  it('sets up a handler which triggers on promise execution', async () => {
    const handler = jest.fn().mockReturnValue('action invoked');
    const action = ForbiddenAction(handler);
    expect(action).toEqual({
      id: 'connect-other-account',
      text: expect.any(Object),
      promise: expect.any(Function),
      buttonAppearance: 'default',
    });

    const { container } = renderWithIntl(action.text);
    expect(container.textContent).toBe('Try another account');

    const handlerExecutor = action.promise;
    await expect(handlerExecutor()).resolves.toBe('action invoked');
    expect(handler).toBeCalledTimes(1);
    expect(handler).toBeCalledWith();
  });
});
