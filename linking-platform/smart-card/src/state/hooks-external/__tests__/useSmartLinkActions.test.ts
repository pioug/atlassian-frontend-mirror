import { type JsonLd } from '@atlaskit/json-ld-types';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { renderHook } from '@atlassian/testing-library';

import { extractInvokePreviewAction } from '../../../extractors/action/extract-invoke-preview-action';
import { extractInvokeViewAction } from '../../../extractors/action/extract-invoke-view-action';
import { mocks } from '../../../utils/mocks';
import { EmbedModalSize } from '../../../view/EmbedModal/types';
import useInvokeClientAction from '../../hooks/use-invoke-client-action';
import useResolve from '../../hooks/use-resolve';
import { useSmartLinkCrossProductUrlWrapperGated } from '../../hooks/use-smart-link-cross-product-url-wrapper';
import { useSmartCardState } from '../../store';
import { type CardState } from '../../types';
import { useSmartLinkActions } from '../useSmartLinkActions';

jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn(),
}));

jest.mock('../../analytics', () => ({
	failUfoExperience: jest.fn(),
	startUfoExperience: jest.fn(),
	succeedUfoExperience: jest.fn(),
}));

jest.mock('../../store', () => ({
	useSmartCardState: jest.fn(),
}));

jest.mock('../../hooks/use-invoke-client-action', () => ({
	__esModule: true,
	default: jest.fn(),
}));

jest.mock('@atlaskit/link-provider', () => ({
	useSmartLinkContext: jest.fn(),
}));

jest.mock('../../../extractors/action/extract-invoke-preview-action', () => ({
	extractInvokePreviewAction: jest.fn(),
}));

jest.mock('../../../extractors/action/extract-invoke-view-action', () => ({
	extractInvokeViewAction: jest.fn(),
}));

jest.mock('../../hooks/use-smart-link-cross-product-url-wrapper', () => ({
	useSmartLinkCrossProductUrlWrapperGated: jest.fn(),
}));

jest.mock('../../hooks/use-resolve', () => ({
	__esModule: true,
	default: jest.fn(),
}));

const url = 'https://start.atlassian.com';
const appearance = 'block';

const mockNoActions = () => {
	const details = { ...mocks.success };
	(details.data as JsonLd.Data.BaseData).preview = undefined;
	(details.data as JsonLd.Data.BaseData)['schema:potentialAction'] = undefined;

	const state: CardState = { details, status: 'resolved' };

	(useSmartCardState as jest.Mock).mockReturnValue(state);

	// Mock extractors to return undefined when there are no actions
	(extractInvokeViewAction as jest.Mock).mockReturnValue(undefined);
	(extractInvokePreviewAction as jest.Mock).mockReturnValue(undefined);
};

const mockWithActions = () => {
	const mockInvokeClientAction = jest.fn();
	(useInvokeClientAction as jest.Mock).mockReturnValue(mockInvokeClientAction);

	const state: CardState = { details: mocks.success, status: 'resolved' };

	(useSmartCardState as jest.Mock).mockReturnValue(state);

	(useSmartLinkCrossProductUrlWrapperGated as jest.Mock).mockReturnValue(
		(url: string) => `${url}?xpc=1`,
	);

	// Mock extractInvokeViewAction to return a valid result
	(extractInvokeViewAction as jest.Mock).mockReturnValue({
		actionFn: jest.fn(),
		actionSubjectId: 'shortcutGoToLink',
		actionType: 'ViewAction',
		display: 'block',
		extensionKey: 'object-provider',
		id: 'test-id',
	});

	// Mock extractInvokePreviewAction to return a valid result
	(extractInvokePreviewAction as jest.Mock).mockReturnValue({
		invokeAction: {
			actionFn: jest.fn(),
			actionSubjectId: 'invokePreviewScreen',
			actionType: 'PreviewAction',
			display: 'block',
			extensionKey: 'object-provider',
			id: 'test-id',
			size: EmbedModalSize.Small,
		},
		hasPreviewPanel: false,
	});

	return mockInvokeClientAction;
};

const mockLifecycle = () => {
	const pendingState: CardState = { status: 'pending' };
	const resolvingState: CardState = { status: 'resolving' };
	const resolvedState: CardState = {
		details: mocks.success,
		status: 'resolved',
	};

	(useSmartCardState as jest.Mock)
		.mockImplementationOnce(() => pendingState)
		.mockImplementationOnce(() => resolvingState)
		.mockImplementationOnce(() => resolvedState);

	// Mock extractors for the resolved state
	(extractInvokeViewAction as jest.Mock).mockReturnValue({
		actionFn: jest.fn(),
		actionSubjectId: 'shortcutGoToLink',
		actionType: 'ViewAction',
		display: 'block',
		extensionKey: 'object-provider',
		id: 'test-id',
	});
	(extractInvokePreviewAction as jest.Mock).mockReturnValue({
		invokeAction: {
			actionFn: jest.fn(),
			actionSubjectId: 'invokePreviewScreen',
			actionType: 'PreviewAction',
			display: 'block',
			extensionKey: 'object-provider',
			id: 'test-id',
		},
		hasPreviewPanel: false,
	});
};

describe(useSmartLinkActions.name, () => {
	beforeEach(() => {
		// Default mock for the cross-product URL wrapper (identity function)
		(useSmartLinkCrossProductUrlWrapperGated as jest.Mock).mockReturnValue((u: string) => u);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('returns list of actions when data available', () => {
		(useSmartLinkContext as jest.Mock).mockReturnValue({
			isPreviewPanelAvailable: undefined,
			openPreviewPanel: undefined,
		});
		mockWithActions();

		const result = renderHook(() => useSmartLinkActions({ url, appearance }));

		expect(result.current).toHaveLength(3);
	});

	it('returns server-based action', () => {
		(useSmartLinkContext as jest.Mock).mockReturnValue({
			isPreviewPanelAvailable: undefined,
			openPreviewPanel: undefined,
		});
		mockWithActions();

		const result = renderHook(() => useSmartLinkActions({ url, appearance }));

		expect(result.current?.[0]).toMatchObject({ id: 'download-content' });
	});

	it('returns client-based action', () => {
		(useSmartLinkContext as jest.Mock).mockReturnValue({
			isPreviewPanelAvailable: undefined,
			openPreviewPanel: undefined,
		});
		mockWithActions();

		const result = renderHook(() => useSmartLinkActions({ url, appearance }));

		expect(result.current?.[2]).toMatchObject({ id: 'preview-content' });
	});

	it('invokes correct promise on trigger of action (first)', async () => {
		(useSmartLinkContext as jest.Mock).mockReturnValue({
			isPreviewPanelAvailable: undefined,
			openPreviewPanel: undefined,
		});
		const actionHandler = mockWithActions();

		const result = renderHook(() => useSmartLinkActions({ url, appearance }));

		await result.current?.[0].invoke();

		expect(actionHandler).toHaveBeenCalledTimes(1);
	});

	it('invokes correct promise on trigger of action (second)', async () => {
		(useSmartLinkContext as jest.Mock).mockReturnValue({
			isPreviewPanelAvailable: undefined,
			openPreviewPanel: undefined,
		});
		const actionHandler = mockWithActions();

		const result = renderHook(() => useSmartLinkActions({ url, appearance }));

		await result.current?.[1].invoke();
		expect(actionHandler).toHaveBeenCalledTimes(1);
	});

	it('returns no actions when actionOptions.hide is true', () => {
		(useSmartLinkContext as jest.Mock).mockReturnValue({
			isPreviewPanelAvailable: undefined,
			openPreviewPanel: undefined,
		});
		mockWithActions();

		const result = renderHook(() =>
			useSmartLinkActions({
				url,
				appearance,
				actionOptions: { hide: true },
			}),
		);

		expect(result.current).toEqual([]);
	});

	it('returns preview action with size when actionOptions.previewAction.size is provided', () => {
		(useSmartLinkContext as jest.Mock).mockReturnValue({
			isPreviewPanelAvailable: undefined,
			openPreviewPanel: undefined,
		});
		mockWithActions();

		const result = renderHook(() =>
			useSmartLinkActions({
				url,
				appearance,
				actionOptions: {
					hide: false,
					previewAction: {
						size: EmbedModalSize.Small,
					},
				},
			}),
		);

		expect(result.current).toEqual([
			expect.objectContaining({
				id: 'download-content',
				invoke: expect.any(Function),
			}),
			expect.objectContaining({
				id: 'view-content',
				invoke: expect.any(Function),
			}),
			expect.objectContaining({
				id: 'preview-content',
				invoke: expect.any(Function),
			}),
		]);
	});

	it('returns isBlanketHidden when actionOptions.previewAction.hideBlanket is provided', () => {
		(useSmartLinkContext as jest.Mock).mockReturnValue({
			isPreviewPanelAvailable: undefined,
			openPreviewPanel: undefined,
		});
		mockWithActions();

		const result = renderHook(() =>
			useSmartLinkActions({
				url,
				appearance,
				actionOptions: {
					hide: false,
					previewAction: {
						size: EmbedModalSize.Small,
						hideBlanket: true,
					},
				},
			}),
		);

		expect(result.current).toEqual([
			expect.objectContaining({
				id: 'download-content',
				invoke: expect.any(Function),
			}),
			expect.objectContaining({
				id: 'view-content',
				invoke: expect.any(Function),
			}),
			expect.objectContaining({
				id: 'preview-content',
				invoke: expect.any(Function),
			}),
		]);
	});

	it('returns actions as expected when useSmartCardState changes', () => {
		(useSmartLinkContext as jest.Mock).mockReturnValue({
			isPreviewPanelAvailable: undefined,
			openPreviewPanel: undefined,
		});
		mockLifecycle();

		const result = renderHook(() => useSmartLinkActions({ url, appearance }));

		// pending state
		expect(result.current).toEqual([]);
		result.update();

		// resolving state
		expect(result.current).toEqual([]);
		result.update();

		// resolved state
		expect(result.current).toHaveLength(3);
	});

	it('returns empty list when no data available', () => {
		(useSmartLinkContext as jest.Mock).mockReturnValue({
			isPreviewPanelAvailable: undefined,
			openPreviewPanel: undefined,
		});
		mockNoActions();

		const result = renderHook(() => useSmartLinkActions({ url, appearance }));

		expect(result.current).toEqual([]);
	});

	describe('preview panel integration', () => {
		it('should pass through preview panel parameters from context when available', () => {
			const mockIsPreviewPanelAvailable = jest.fn().mockReturnValue(true);
			const mockOpenPreviewPanel = jest.fn();

			(useSmartLinkContext as jest.Mock).mockReturnValue({
				isPreviewPanelAvailable: mockIsPreviewPanelAvailable,
				openPreviewPanel: mockOpenPreviewPanel,
			});

			mockWithActions();

			const result = renderHook(() => useSmartLinkActions({ url, appearance }));

			// Just verify that the hook returns some actions when preview panel is available
			expect(result.current.length).toBeGreaterThan(0);
		});

		it('should handle preview panel parameters when preview panel is not available', () => {
			const mockIsPreviewPanelAvailable = jest.fn().mockReturnValue(false);

			(useSmartLinkContext as jest.Mock).mockReturnValue({
				isPreviewPanelAvailable: mockIsPreviewPanelAvailable,
				openPreviewPanel: undefined,
			});

			mockWithActions();

			const result = renderHook(() => useSmartLinkActions({ url, appearance }));

			// Just verify that the hook returns some actions when preview panel is not available
			expect(result.current.length).toBeGreaterThan(0);
		});

		it('should handle undefined preview panel parameters from context', () => {
			(useSmartLinkContext as jest.Mock).mockReturnValue({
				isPreviewPanelAvailable: undefined,
				openPreviewPanel: undefined,
			});

			mockWithActions();

			const result = renderHook(() => useSmartLinkActions({ url, appearance }));

			// Just verify that the hook returns some actions when parameters are undefined
			expect(result.current.length).toBeGreaterThan(0);
		});

		it('should handle null preview panel parameters from context', () => {
			(useSmartLinkContext as jest.Mock).mockReturnValue({
				isPreviewPanelAvailable: null,
				openPreviewPanel: null,
			});

			mockWithActions();

			const result = renderHook(() => useSmartLinkActions({ url, appearance }));

			// Just verify that the hook returns some actions when parameters are null
			expect(result.current.length).toBeGreaterThan(0);
		});

		it('should pass through origin parameter when provided', () => {
			const mockIsPreviewPanelAvailable = jest.fn().mockReturnValue(true);
			const mockOpenPreviewPanel = jest.fn();

			(useSmartLinkContext as jest.Mock).mockReturnValue({
				isPreviewPanelAvailable: mockIsPreviewPanelAvailable,
				openPreviewPanel: mockOpenPreviewPanel,
			});

			mockWithActions();

			const result = renderHook(() =>
				useSmartLinkActions({
					url,
					appearance,
					origin: 'smartLinkCard',
				}),
			);

			// Just verify that the hook returns some actions when origin is provided
			expect(result.current.length).toBeGreaterThan(0);
		});
	});

	describe('platform_smartlink_xpc_url_wrapping', () => {
		const setup = () => {
			(useSmartLinkContext as jest.Mock).mockReturnValue({
				isPreviewPanelAvailable: undefined,
				openPreviewPanel: undefined,
			});
			mockWithActions();
		};

		ffTest.on('platform_smartlink_xpc_url_wrapping', 'gate is on', () => {
			it('passes transformUrl to extractInvokeViewAction', () => {
				setup();
				renderHook(() => useSmartLinkActions({ url, appearance }));

				expect(extractInvokeViewAction).toHaveBeenCalledWith(
					expect.objectContaining({
						transformUrl: expect.any(Function),
					}),
				);
			});

			it('passes transformUrl to extractInvokePreviewAction', () => {
				setup();
				renderHook(() => useSmartLinkActions({ url, appearance }));

				expect(extractInvokePreviewAction).toHaveBeenCalledWith(
					expect.objectContaining({
						transformUrl: expect.any(Function),
					}),
				);
			});

			it('transformUrl calls appendCrossProductAnalyticsParams with the url', () => {
				setup();
				renderHook(() => useSmartLinkActions({ url, appearance }));

				const callArgs = (extractInvokeViewAction as jest.Mock).mock.calls[0][0];
				const transformedUrl = callArgs.transformUrl(url);

				expect(transformedUrl).toBe(`${url}?xpc=1`);
			});
		});

		ffTest.off('platform_smartlink_xpc_url_wrapping', 'gate is off', () => {
			it('does not pass transformUrl to extractInvokeViewAction', () => {
				setup();
				renderHook(() => useSmartLinkActions({ url, appearance }));

				expect(extractInvokeViewAction).toHaveBeenCalledWith(
					expect.not.objectContaining({
						transformUrl: expect.any(Function),
					}),
				);
			});

			it('does not pass transformUrl to extractInvokePreviewAction', () => {
				setup();
				renderHook(() => useSmartLinkActions({ url, appearance }));

				expect(extractInvokePreviewAction).toHaveBeenCalledWith(
					expect.not.objectContaining({
						transformUrl: expect.any(Function),
					}),
				);
			});
		});
	});

	describe('prefetch functionality', () => {
		beforeEach(() => {
			// Reset the experiment mock before each test
			const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
			(expValEquals as jest.Mock).mockReturnValue(false);
		});

		it('should call resolve when experiment is enabled, prefetch is true, and linkState.details is not available', () => {
			const mockResolve = jest.fn();
			const useResolve = require('../../hooks/use-resolve').default;
			(useResolve as jest.Mock).mockReturnValue(mockResolve);

			const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
			(expValEquals as jest.Mock).mockReturnValue(true);

			const pendingState: CardState = { status: 'pending' };
			(useSmartCardState as jest.Mock).mockReturnValue(pendingState);

			(useSmartLinkContext as jest.Mock).mockReturnValue({
				isPreviewPanelAvailable: undefined,
				openPreviewPanel: undefined,
			});

			renderHook(() =>
				useSmartLinkActions({
					url,
					appearance,
					prefetch: true,
				}),
			);

			expect(expValEquals as jest.Mock).toHaveBeenCalledWith(
				'platform_hover_card_preview_panel',
				'cohort',
				'test',
			);
			expect(mockResolve).toHaveBeenCalledWith(url);
		});

		it('should not call resolve when experiment is disabled even if prefetch is true and linkState.details is not available', () => {
			const mockResolve = jest.fn();
			const useResolve = require('../../hooks/use-resolve').default;
			(useResolve as jest.Mock).mockReturnValue(mockResolve);

			const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
			(expValEquals as jest.Mock).mockReturnValue(false);

			const pendingState: CardState = { status: 'pending' };
			(useSmartCardState as jest.Mock).mockReturnValue(pendingState);

			(useSmartLinkContext as jest.Mock).mockReturnValue({
				isPreviewPanelAvailable: undefined,
				openPreviewPanel: undefined,
			});

			renderHook(() =>
				useSmartLinkActions({
					url,
					appearance,
					prefetch: true,
				}),
			);

			expect(expValEquals as jest.Mock).toHaveBeenCalledWith(
				'platform_hover_card_preview_panel',
				'cohort',
				'test',
			);
			expect(mockResolve).not.toHaveBeenCalled();
		});

		it('should not call resolve when experiment is enabled but prefetch is false', () => {
			const mockResolve = jest.fn();
			const useResolve = require('../../hooks/use-resolve').default;
			(useResolve as jest.Mock).mockReturnValue(mockResolve);

			const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
			(expValEquals as jest.Mock).mockReturnValue(true);

			const pendingState: CardState = { status: 'pending' };
			(useSmartCardState as jest.Mock).mockReturnValue(pendingState);

			(useSmartLinkContext as jest.Mock).mockReturnValue({
				isPreviewPanelAvailable: undefined,
				openPreviewPanel: undefined,
			});

			renderHook(() =>
				useSmartLinkActions({
					url,
					appearance,
					prefetch: false,
				}),
			);

			expect(expValEquals as jest.Mock).toHaveBeenCalledWith(
				'platform_hover_card_preview_panel',
				'cohort',
				'test',
			);
			expect(mockResolve).not.toHaveBeenCalled();
		});

		it('should not call resolve when experiment is enabled, prefetch is true, but linkState.details already exists', () => {
			const mockResolve = jest.fn();
			const useResolve = require('../../hooks/use-resolve').default;
			(useResolve as jest.Mock).mockReturnValue(mockResolve);

			const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
			(expValEquals as jest.Mock).mockReturnValue(true);

			const resolvedState: CardState = { details: mocks.success, status: 'resolved' };
			(useSmartCardState as jest.Mock).mockReturnValue(resolvedState);

			(useSmartLinkContext as jest.Mock).mockReturnValue({
				isPreviewPanelAvailable: undefined,
				openPreviewPanel: undefined,
			});

			renderHook(() =>
				useSmartLinkActions({
					url,
					appearance,
					prefetch: true,
				}),
			);

			expect(expValEquals as jest.Mock).toHaveBeenCalledWith(
				'platform_hover_card_preview_panel',
				'cohort',
				'test',
			);
			expect(mockResolve).not.toHaveBeenCalled();
		});

		it('should not call resolve when experiment is enabled, prefetch is undefined, and linkState.details is not available', () => {
			const mockResolve = jest.fn();
			const useResolve = require('../../hooks/use-resolve').default;
			(useResolve as jest.Mock).mockReturnValue(mockResolve);

			const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
			(expValEquals as jest.Mock).mockReturnValue(true);

			const pendingState: CardState = { status: 'pending' };
			(useSmartCardState as jest.Mock).mockReturnValue(pendingState);

			(useSmartLinkContext as jest.Mock).mockReturnValue({
				isPreviewPanelAvailable: undefined,
				openPreviewPanel: undefined,
			});

			renderHook(() =>
				useSmartLinkActions({
					url,
					appearance,
					// prefetch is undefined (default behavior)
				}),
			);

			expect(expValEquals as jest.Mock).toHaveBeenCalledWith(
				'platform_hover_card_preview_panel',
				'cohort',
				'test',
			);
			expect(mockResolve).not.toHaveBeenCalled();
		});

		it('should call resolve when all conditions are met: experiment enabled, prefetch true, no details', () => {
			const mockResolve = jest.fn();
			const useResolve = require('../../hooks/use-resolve').default;
			(useResolve as jest.Mock).mockReturnValue(mockResolve);

			const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
			(expValEquals as jest.Mock).mockReturnValue(true);

			const pendingState: CardState = { status: 'pending' };
			(useSmartCardState as jest.Mock).mockReturnValue(pendingState);

			(useSmartLinkContext as jest.Mock).mockReturnValue({
				isPreviewPanelAvailable: undefined,
				openPreviewPanel: undefined,
			});

			renderHook(() =>
				useSmartLinkActions({
					url,
					appearance,
					prefetch: true,
				}),
			);

			expect(expValEquals as jest.Mock).toHaveBeenCalledWith(
				'platform_hover_card_preview_panel',
				'cohort',
				'test',
			);
			expect(mockResolve).toHaveBeenCalledWith(url);
		});

		it('should not call resolve when experiment is true but prefetch is true and linkState.details is already available', () => {
			const mockResolve = jest.fn();
			const useResolve = require('../../hooks/use-resolve').default;
			(useResolve as jest.Mock).mockReturnValue(mockResolve);

			const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
			(expValEquals as jest.Mock).mockReturnValue(true);

			const resolvedState: CardState = { details: mocks.success, status: 'resolved' };
			(useSmartCardState as jest.Mock).mockReturnValue(resolvedState);

			(useSmartLinkContext as jest.Mock).mockReturnValue({
				isPreviewPanelAvailable: undefined,
				openPreviewPanel: undefined,
			});

			renderHook(() =>
				useSmartLinkActions({
					url,
					appearance,
					prefetch: true,
				}),
			);

			expect(expValEquals as jest.Mock).toHaveBeenCalledWith(
				'platform_hover_card_preview_panel',
				'cohort',
				'test',
			);
			expect(mockResolve).not.toHaveBeenCalled();
		});

		it('should not call resolve when prefetch is false', () => {
			const mockResolve = jest.fn();
			(useResolve as jest.Mock).mockReturnValue(mockResolve);

			// Mock linkState with no details (pending state)
			const pendingState: CardState = { status: 'pending' };
			(useSmartCardState as jest.Mock).mockReturnValue(pendingState);

			(useSmartLinkContext as jest.Mock).mockReturnValue({
				isPreviewPanelAvailable: undefined,
				openPreviewPanel: undefined,
			});

			renderHook(() =>
				useSmartLinkActions({
					url,
					appearance,
					prefetch: false,
				}),
			);

			expect(mockResolve).not.toHaveBeenCalled();
		});

		it('should not call resolve when prefetch is undefined', () => {
			const mockResolve = jest.fn();
			const useResolve = require('../../hooks/use-resolve').default;
			(useResolve as jest.Mock).mockReturnValue(mockResolve);

			// Mock linkState with no details (pending state)
			const pendingState: CardState = { status: 'pending' };
			(useSmartCardState as jest.Mock).mockReturnValue(pendingState);

			(useSmartLinkContext as jest.Mock).mockReturnValue({
				isPreviewPanelAvailable: undefined,
				openPreviewPanel: undefined,
			});

			renderHook(() =>
				useSmartLinkActions({
					url,
					appearance,
					// prefetch is undefined (default behavior)
				}),
			);

			expect(mockResolve).not.toHaveBeenCalled();
		});
	});
});
