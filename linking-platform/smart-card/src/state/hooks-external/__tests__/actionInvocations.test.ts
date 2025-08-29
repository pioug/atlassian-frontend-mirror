import { renderHook } from '@testing-library/react-hooks';

import { SmartCardProvider } from '@atlaskit/link-provider';

import {
	TEST_RESPONSE_WITH_DOWNLOAD,
	TEST_RESPONSE_WITH_PREVIEW,
	TEST_RESPONSE_WITH_VIEW,
	TEST_URL,
} from '../../../extractors/common/__mocks__/jsonld';
import { downloadUrl, openUrl } from '../../../utils';
import { EmbedModalSize } from '../../../view/EmbedModal/types';
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

jest.mock('@atlaskit/link-provider', () => ({
	SmartCardProvider: ({ children }: { children: React.ReactNode }) => children,
	useSmartLinkContext: jest.fn().mockReturnValue({
		isPreviewPanelAvailable: undefined,
		openPreviewPanel: undefined,
	}),
}));

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
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

		const { result } = renderHook(() => useSmartLinkActions({ url, appearance }), {
			wrapper: SmartCardProvider,
		});

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
		const { result } = renderHook(() => useSmartLinkActions({ url, appearance }), {
			wrapper: SmartCardProvider,
		});

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
		const { result } = renderHook(() => useSmartLinkActions({ url, appearance, origin }), {
			wrapper: SmartCardProvider,
		});
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

	it('should invoke preview method with expected parameters and action options with feature flag enabled', async () => {
		const details = TEST_RESPONSE_WITH_PREVIEW;

		const { fg } = require('@atlaskit/platform-feature-flags');
		fg.mockReturnValue(true);

		const state: CardState = {
			details,
			status: 'resolved',
		};

		jest.mocked(useSmartCardState).mockReturnValueOnce(state);
		const { result } = renderHook(
			() =>
				useSmartLinkActions({
					url,
					appearance,
					origin,
					actionOptions: { hide: false, previewAction: { size: EmbedModalSize.Small } },
				}),
			{
				wrapper: SmartCardProvider,
			},
		);
		const previewAction = result.current?.[0];
		await previewAction?.invoke();

		expect(openEmbedModal).toHaveBeenCalledWith(
			expect.objectContaining({
				size: EmbedModalSize.Small,
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
