let mockViewUrl = jest.fn();

import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';

import { ViewAction } from '../../../../view/BlockCard/actions/ViewAction';
import { mockUrl } from '../../../__mocks__/get-resolved-props';

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
		expect(container).toHaveTextContent('View');

		const handlerExecutor = action.promise;
		await expect(handlerExecutor()).resolves.toBe(undefined);
		expect(mockViewUrl).toHaveBeenCalledTimes(0);
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
		expect(container).toHaveTextContent('View');

		const handlerExecutor = action.promise;
		await expect(handlerExecutor()).resolves.toBe(undefined);
		expect(mockViewUrl).toHaveBeenCalledTimes(1);
		expect(mockViewUrl).toHaveBeenCalledWith(mockUrl, '_blank', 'noopener=yes');
	});
});
