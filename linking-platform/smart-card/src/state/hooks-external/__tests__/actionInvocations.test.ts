import { renderHook } from '@testing-library/react-hooks';

import { ffTest } from '@atlassian/feature-flags-test-utils/src';

import {
	TEST_NAME,
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

jest.mock('../../analytics', () => ({
	useSmartLinkAnalytics: jest.fn(),
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

// used by old hook
jest.mock('../../actions', () => ({
	useSmartCardActions: jest.fn().mockImplementation(() => ({
		invoke: jest.fn(async (opts) => {
			await opts.action.promise();
		}),
	})),
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

		// await downloadAction?.invoke();
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

		expect(openEmbedModal).toHaveBeenCalledWith({
			analytics: undefined,
			byline: undefined,
			download: undefined,
			extensionKey: 'object-provider',
			icon: expect.objectContaining({
				url: TEST_URL,
			}),
			isSupportTheming: false,
			isTrusted: true,
			link: TEST_URL,
			onClose: expect.any(Function),
			origin,
			providerName: undefined,
			showModal: true,
			src: TEST_URL,
			testId: undefined,
			title: TEST_NAME,
			url: TEST_URL,
		});
	});

	ffTest.on('smart-card-use-refactored-usesmartlinkactions', '', () => {
		it('should invoke download method with expected parameters', async () => {
			const details = TEST_RESPONSE_WITH_DOWNLOAD;

			const state: CardState = {
				details,
				status: 'resolved',
			};

			jest.mocked(useSmartCardState).mockReturnValueOnce(state);

			const { result } = renderHook(() => useSmartLinkActions({ url, appearance }));

			const downloadAction = result.current?.[0];
			downloadAction?.invoke();

			// await downloadAction?.invoke();
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

			expect(openEmbedModal).toHaveBeenCalledWith({
				analytics: undefined,
				byline: undefined,
				download: undefined,
				extensionKey: 'object-provider',
				icon: expect.objectContaining({
					url: TEST_URL,
				}),
				isSupportTheming: false,
				isTrusted: true,
				link: TEST_URL,
				onClose: expect.any(Function),
				origin,
				providerName: undefined,
				showModal: true,
				src: TEST_URL,
				testId: undefined,
				title: TEST_NAME,
				url: TEST_URL,
			});
		});
	});
});
