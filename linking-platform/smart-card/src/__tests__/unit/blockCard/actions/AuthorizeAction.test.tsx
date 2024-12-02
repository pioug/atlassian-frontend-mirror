import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';

import { AuthorizeAction } from '../../../../view/BlockCard';

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
		expect(container).toHaveTextContent('Connect');

		const handlerExecutor = action.promise;
		await expect(handlerExecutor()).resolves.toBe('action invoked');
		expect(handler).toHaveBeenCalledTimes(1);
		expect(handler).toHaveBeenCalledWith();
	});
});
