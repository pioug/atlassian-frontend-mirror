import { ffTest } from '@atlassian/feature-flags-test-utils';

import { CardAction } from '../../../constants';
import * as utils from '../../../utils';
import { TEST_RESPONSE, TEST_RESPONSE_WITH_VIEW, TEST_URL } from '../../common/__mocks__/jsonld';
import { extractInvokeViewAction } from '../extract-invoke-view-action';

describe('extractInvokeViewAction', () => {
	it('returns view action', async () => {
		const action = extractInvokeViewAction({
			appearance: 'block',
			id: 'test-id',
			response: TEST_RESPONSE_WITH_VIEW,
		});

		expect(action).toEqual({
			actionFn: expect.any(Function),
			actionSubjectId: 'shortcutGoToLink',
			actionType: 'ViewAction',
			display: 'block',
			extensionKey: 'object-provider',
			id: 'test-id',
		});
	});

	it('triggers open url', async () => {
		const openUrl = jest.spyOn(utils, 'openUrl').mockResolvedValue(undefined);
		const action = extractInvokeViewAction({
			appearance: 'block',
			id: 'test-id',
			response: TEST_RESPONSE_WITH_VIEW,
		});

		await action?.actionFn();

		expect(openUrl).toHaveBeenCalledWith(TEST_URL);
	});

	it('should not return view action if excluded', () => {
		const action = extractInvokeViewAction({
			actionOptions: {
				hide: false,
				exclude: [CardAction.ViewAction],
			},
			appearance: 'block',
			id: 'test-id',
			response: TEST_RESPONSE_WITH_VIEW,
		});

		expect(action).toBeUndefined();
	});

	it('should not return view action if not in jsonld', () => {
		const action = extractInvokeViewAction({
			appearance: 'block',
			id: 'test-id',
			response: TEST_RESPONSE,
		});

		expect(action).toBeUndefined();
	});

	it('should return view action if not in jsonld but force is true', () => {
		const action = extractInvokeViewAction(
			{
				appearance: 'block',
				id: 'test-id',
				response: TEST_RESPONSE,
			},
			true,
		);

		expect(action).toEqual({
			actionFn: expect.any(Function),
			actionSubjectId: 'shortcutGoToLink',
			actionType: 'ViewAction',
			display: 'block',
			extensionKey: 'object-provider',
			id: 'test-id',
		});
	});

	describe('platform_smartlink_xpc_url_wrapping', () => {
		ffTest.on('platform_smartlink_xpc_url_wrapping', 'gate is on', () => {
			it('calls transformUrl and opens transformed URL', async () => {
				const openUrl = jest.spyOn(utils, 'openUrl').mockResolvedValue(undefined);
				const transformUrl = jest.fn().mockReturnValue(`${TEST_URL}?xpc=1`);

				const action = extractInvokeViewAction({
					appearance: 'block',
					id: 'test-id',
					response: TEST_RESPONSE_WITH_VIEW,
					transformUrl,
				});

				await action?.actionFn();

				expect(transformUrl).toHaveBeenCalledWith(TEST_URL);
				expect(openUrl).toHaveBeenCalledWith(`${TEST_URL}?xpc=1`);
			});

			it('falls back to original url if transformUrl returns undefined', async () => {
				const openUrl = jest.spyOn(utils, 'openUrl').mockResolvedValue(undefined);
				const transformUrl = jest.fn().mockReturnValue(undefined);

				const action = extractInvokeViewAction({
					appearance: 'block',
					id: 'test-id',
					response: TEST_RESPONSE_WITH_VIEW,
					transformUrl,
				});

				await action?.actionFn();

				expect(openUrl).toHaveBeenCalledWith(TEST_URL);
			});
		});

		ffTest.off('platform_smartlink_xpc_url_wrapping', 'gate is off', () => {
			it('does not call transformUrl and opens original URL', async () => {
				const openUrl = jest.spyOn(utils, 'openUrl').mockResolvedValue(undefined);
				const transformUrl = jest.fn().mockReturnValue(`${TEST_URL}?xpc=1`);

				const action = extractInvokeViewAction({
					appearance: 'block',
					id: 'test-id',
					response: TEST_RESPONSE_WITH_VIEW,
					transformUrl,
				});

				await action?.actionFn();

				expect(transformUrl).not.toHaveBeenCalled();
				expect(openUrl).toHaveBeenCalledWith(TEST_URL);
			});
		});
	});
});
