import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';

import { ForbiddenAction } from '../../../../view/BlockCard';

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
		expect(handler).toHaveBeenCalledTimes(1);
		expect(handler).toHaveBeenCalledWith();
	});
});
