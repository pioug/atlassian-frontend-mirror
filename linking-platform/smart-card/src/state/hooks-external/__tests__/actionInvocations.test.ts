import { renderHook } from '@testing-library/react-hooks';

import {
	TEST_RESPONSE_WITH_DOWNLOAD,
	TEST_RESPONSE_WITH_PREVIEW,
	TEST_RESPONSE_WITH_VIEW,
	TEST_URL,
} from '../../../extractors/common/__mocks__/jsonld';
import { downloadUrl, openUrl } from '../../../utils';
import { openEmbedModal } from '../../../view/EmbedModal/utils';
import { useSmartCardState } from '../../store';
import { type CardState } from '../../types';
import { useSmartLinkActions } from '../useSmartLinkActions';

const url = 'https://start.atlassian.com';
const appearance = 'block';
const origin = 'smartLinkCard';

jest.mock('../../store', () => ({
	useSmartCardState: jest.fn(),
}));

// used directly by refactored hook
jest.mock('../../hooks/use-invoke-client-action', () => ({
	__esModule: true,
	default: jest.fn().mockReturnValue(
		jest.fn(async (opts) => {
			await opts.actionFn();
		}),
	),
}));

// mock downloadUrl and openUrl for download and view actions
jest.mock('../../../utils', () => ({
	downloadUrl: jest.fn(),
	openUrl: jest.fn(),
}));

// mock openEmbedModal url for preview action
jest.mock('../../../view/EmbedModal/utils', () => ({
	openEmbedModal: jest.fn(),
}));

describe('actions', () => {
	it('should invoke download method with expected parameters', async () => {
		const details = TEST_RESPONSE_WITH_DOWNLOAD;

		const state: CardState = {
			details,
			status: 'resolved',
		};

		jest.mocked(useSmartCardState).mockReturnValueOnce(state);

		const { result } = renderHook(() => useSmartLinkActions({ url, appearance }));

		const downloadAction = result.current?.[0];
		await downloadAction?.invoke();

		expect(downloadUrl).toHaveBeenCalledWith(TEST_URL);
	});

	it('should invoke view method with expected parameters', async () => {
		const details = TEST_RESPONSE_WITH_VIEW;

		const state: CardState = {
			details,
			status: 'resolved',
		};

		jest.mocked(useSmartCardState).mockReturnValueOnce(state);
		const { result } = renderHook(() => useSmartLinkActions({ url, appearance }));

		const viewAction = result.current?.[0];
		await viewAction?.invoke();

		// await downloadAction?.invoke();
		expect(openUrl).toHaveBeenCalledWith(TEST_URL);
	});

	it('should invoke preview method with expected parameters', async () => {
		const details = TEST_RESPONSE_WITH_PREVIEW;

		const state: CardState = {
			details,
			status: 'resolved',
		};

		jest.mocked(useSmartCardState).mockReturnValueOnce(state);
		const { result } = renderHook(() => useSmartLinkActions({ url, appearance, origin }));
		const previewAction = result.current?.[0];
		await previewAction?.invoke();

		expect(openEmbedModal).toHaveBeenCalledWith(
			expect.objectContaining({
				extensionKey: 'object-provider',
				invokeDownloadAction: undefined,
				invokeViewAction: expect.objectContaining({
					actionFn: expect.any(Function),
					actionSubjectId: 'shortcutGoToLink',
					actionType: 'ViewAction',
					definitionId: undefined,
					display: 'block',
					extensionKey: 'object-provider',
					resourceType: undefined,
				}),
				isSupportTheming: false,
				isTrusted: true,
				linkIcon: {
					label: 'my name',
					url: TEST_URL,
					render: undefined,
				},
				providerName: undefined,
				onClose: undefined,
				origin: 'smartLinkCard',
				src: TEST_URL,
				title: 'my name',
				url: TEST_URL,
			}),
		);
	});
});
