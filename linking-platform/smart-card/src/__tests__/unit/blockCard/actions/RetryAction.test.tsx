import { RetryAction } from '../../../../view/BlockCard/actions/RetryAction';
import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';

describe('RetryAction', () => {
	it('sets up a handler which triggers on promise execution', async () => {
		const handler = jest.fn().mockReturnValue('action invoked');
		const action = RetryAction(handler);
		expect(action).toEqual({
			id: 'try-again',
			text: expect.any(Object),
			promise: expect.any(Function),
		});

		const { container } = renderWithIntl(action.text);
		expect(container.textContent).toBe('Try again');

		const handlerExecutor = action.promise;
		await expect(handlerExecutor()).resolves.toBe('action invoked');
		expect(handler).toHaveBeenCalledTimes(1);
		expect(handler).toHaveBeenCalledWith();
	});
});
