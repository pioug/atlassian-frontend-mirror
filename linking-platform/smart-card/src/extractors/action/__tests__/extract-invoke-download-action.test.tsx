import { CardAction } from '../../../index';
import * as utils from '../../../utils';
import {
	TEST_RESPONSE,
	TEST_RESPONSE_WITH_DOWNLOAD,
	TEST_URL,
} from '../../common/__mocks__/jsonld';
import { extractInvokeDownloadAction } from '../extract-invoke-download-action';

describe('extractInvokeDownloadAction', () => {
	it('returns download action', async () => {
		const action = extractInvokeDownloadAction({
			appearance: 'block',
			id: 'test-id',
			response: TEST_RESPONSE_WITH_DOWNLOAD,
		});

		expect(action).toEqual({
			actionFn: expect.any(Function),
			actionSubjectId: 'downloadDocument',
			actionType: 'DownloadAction',
			display: 'block',
			extensionKey: 'object-provider',
			id: 'test-id',
		});
	});

	it('triggers download url', async () => {
		const downloadUrl = jest.spyOn(utils, 'downloadUrl').mockResolvedValue(undefined);
		const action = extractInvokeDownloadAction({
			appearance: 'block',
			id: 'test-id',
			response: TEST_RESPONSE_WITH_DOWNLOAD,
		});

		await action?.actionFn();

		expect(downloadUrl).toHaveBeenCalledWith(TEST_URL);
	});

	it('does not return download action if excluded', () => {
		const action = extractInvokeDownloadAction({
			actionOptions: {
				hide: false,
				exclude: [CardAction.DownloadAction],
			},
			appearance: 'block',
			id: 'test-id',
			response: TEST_RESPONSE_WITH_DOWNLOAD,
		});

		expect(action).toBeUndefined();
	});

	it('does not return download action if not in jsonld', () => {
		const action = extractInvokeDownloadAction({
			appearance: 'block',
			id: 'test-id',
			response: TEST_RESPONSE,
		});

		expect(action).toBeUndefined();
	});
});
