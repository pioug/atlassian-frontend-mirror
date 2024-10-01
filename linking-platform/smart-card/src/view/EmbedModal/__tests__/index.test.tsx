import * as jestExtendedMatchers from 'jest-extended';
import { flushPromises } from '@atlaskit/link-test-helpers';
import React, { useEffect } from 'react';
import { IntlProvider } from 'react-intl-next';
import {
	type RenderOptions,
	render,
	waitFor,
	waitForElementToBeRemoved,
	screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import uuid from 'uuid';
import { messages } from '../../../messages';
import { MAX_MODAL_SIZE } from '../constants';
import { mocks } from '../../../utils/mocks';
import { useSmartLinkAnalytics } from '../../../state/analytics/useSmartLinkAnalytics';
import EmbedModal from '../index';
import * as utils from '../../../utils';
import * as ufo from '../../../state/analytics/ufoExperiences';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { ANALYTICS_CHANNEL } from '../../../utils/analytics';

jest.mock('uuid', () => ({
	...jest.requireActual('uuid'),
	__esModule: true,
	default: jest.fn().mockReturnValue('some-uuid-1'),
}));
jest.mock('@atlaskit/link-provider', () => ({
	useSmartLinkContext: () => ({
		store: { getState: () => ({ 'test-url': mocks.analytics }) },
	}),
}));

expect.extend(jestExtendedMatchers);

const EXPERIENCE_TEST_ID = 'smart-link-action-invocation';

// These values should have been set in analytics context
const EXPECTED_COMMON_ATTRIBUTES = {
	componentName: 'smart-cards',
	definitionId: 'spaghetti-id',
	destinationProduct: 'spaghetti-product',
	destinationSubproduct: 'spaghetti-subproduct',
	extensionKey: 'spaghetti-key',
	location: 'test-location',
	packageName: '@atlaskit/fabric',
	packageVersion: '0.0.0',
	resourceType: 'spaghetti-resource',
	destinationObjectType: 'spaghetti-resource',
};

const ThrowError = () => {
	useEffect(() => {
		throw Error('Something went wrong.');
	}, []);
	return <span />;
};

describe('EmbedModal', () => {
	const testId = 'embed-modal';
	let mockWindowOpen: jest.Mock;
	const id = 'test-id';
	const location = 'test-location';
	const spy = jest.fn();

	const wrapper: RenderOptions['wrapper'] = ({ children }) => (
		<IntlProvider locale="en">
			<AnalyticsListener onEvent={spy} channel={ANALYTICS_CHANNEL}>
				{children}
			</AnalyticsListener>
		</IntlProvider>
	);

	const TestComponent = ({
		incomingProps,
	}: {
		incomingProps?: Partial<React.ComponentProps<typeof EmbedModal>>;
	}): JSX.Element => {
		const analyticsEvents = useSmartLinkAnalytics('test-url', id, location);
		return (
			<EmbedModal
				extensionKey="object-provider"
				iframeName="iframe-name"
				onClose={() => {}}
				showModal={true}
				testId={testId}
				{...incomingProps}
				analytics={analyticsEvents}
			/>
		);
	};

	const renderEmbedModal = (props?: Partial<React.ComponentProps<typeof EmbedModal>>) => {
		return render(<TestComponent incomingProps={props} />, { wrapper });
	};

	const expectModalSize = (modal: HTMLElement, size: string) => {
		// This check is not ideal but it is the only value on DS modal dialog
		// HTML element that indicates change in size of the component.
		expect(modal.getAttribute('style')).toContain(`--modal-dialog-width: ${size};`);
	};

	const expectModalMaxSize = (modal: HTMLElement) => expectModalSize(modal, MAX_MODAL_SIZE);

	const expectModalMinSize = (modal: HTMLElement) => expectModalSize(modal, '800px'); // This is DS modal dialog size for 'large'
	let user: ReturnType<typeof userEvent.setup>;

	beforeEach(() => {
		user = userEvent.setup();
		mockWindowOpen = jest.fn();
		global.open = mockWindowOpen;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('renders embed modal', async () => {
		renderEmbedModal();
		const modal = await screen.findByTestId(testId);
		expect(modal).toBeDefined();
	});

	it('renders embed modal without analytics', async () => {
		render(
			<IntlProvider locale="en">
				<EmbedModal iframeName="iframe-name" onClose={() => {}} showModal={true} testId={testId} />
			</IntlProvider>,
		);
		const modal = await screen.findByTestId(testId);
		expect(modal).toBeDefined();
	});

	it('renders a link info', async () => {
		const title = 'Link title';
		renderEmbedModal({
			title,
		});

		expect((await screen.findByTestId(`${testId}-title`)).textContent).toEqual(title);
	});

	it('renders an iframe', async () => {
		const iframeName = 'iframe-name';
		const src = 'https://link-url';
		renderEmbedModal({ iframeName, src });
		const iframe = await screen.findByTestId(`${testId}-embed`);

		expect(iframe).toBeDefined();
		expect(iframe.getAttribute('name')).toEqual(iframeName);
		expect(iframe.getAttribute('src')).toEqual(src);
		expect(iframe.getAttribute('sandbox')).toEqual(expect.any(String));
	});

	describe('with buttons', () => {
		it('closes modal and trigger close callback when clicking close button', async () => {
			const onClose = jest.fn();
			renderEmbedModal({
				onClose,
			});

			const button = await screen.findByTestId(`${testId}-close-button`);

			await userEvent.hover(button);

			expect(await screen.findByTestId(`${testId}-close-tooltip`)).toBeInTheDocument();

			const tooltip = await screen.findByTestId(`${testId}-close-tooltip`);
			expect(tooltip.textContent).toBe(messages.preview_close.defaultMessage);

			await user.click(button);
			await waitForElementToBeRemoved(() => screen.queryByTestId(testId));
			const modal = screen.queryByTestId(testId);
			expect(modal).not.toBeInTheDocument();
			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('resizes modal when clicking resize button', async () => {
			renderEmbedModal();
			const modal = await screen.findByTestId(testId);
			const button = await screen.findByTestId(`${testId}-resize-button`);

			// Resize to min size
			await userEvent.hover(button);

			expect(await screen.findByTestId(`${testId}-resize-tooltip`)).toBeInTheDocument();

			const minTooltip = await screen.findByTestId(`${testId}-resize-tooltip`);
			expect(minTooltip.textContent).toBe(messages.preview_min_size.defaultMessage);
			await user.click(button);
			expectModalMinSize(modal);

			// Resize to max size
			await userEvent.hover(button);
			expect(await screen.findByTestId(`${testId}-resize-tooltip`)).toBeInTheDocument();

			const maxTooltip = await screen.findByTestId(`${testId}-resize-tooltip`);
			expect(maxTooltip.textContent).toBe(messages.preview_max_size.defaultMessage);
			await user.click(button);
			expectModalMaxSize(modal);
		});

		describe('with url button', () => {
			it('renders url button', async () => {
				renderEmbedModal({
					url: 'https://link-url',
				});
				const button = await screen.findByTestId(`${testId}-url-button`);
				expect(button).toBeInTheDocument();

				await userEvent.hover(button);

				expect(await screen.findByTestId(`${testId}-url-tooltip`)).toBeInTheDocument();

				const tooltip = await screen.findByTestId(`${testId}-url-tooltip`);
				expect(tooltip.textContent).toBe(messages.viewOriginal.defaultMessage);
			});

			it('renders url button with provider name', async () => {
				renderEmbedModal({
					providerName: 'Confluence',
					url: 'https://link-url',
				});
				const button = await screen.findByTestId(`${testId}-url-button`);

				await userEvent.hover(button);
				expect(await screen.findByTestId(`${testId}-url-tooltip`)).toBeInTheDocument();

				const tooltip = await screen.findByTestId(`${testId}-url-tooltip`);
				expect(tooltip.textContent).toBe('View in Confluence');
			});

			it('trigger open url when clicking url button', async () => {
				const openUrlSpy = jest.spyOn(utils, 'openUrl');
				renderEmbedModal({
					url: 'https://link-url',
				});
				const button = await screen.findByTestId(`${testId}-url-button`);
				await user.click(button);
				await flushPromises();

				expect(openUrlSpy).toHaveBeenCalledTimes(1);
			});

			it('does not render url button when url is not provided', () => {
				renderEmbedModal();
				const button = screen.queryByTestId(`${testId}-url-button`);
				expect(button).not.toBeInTheDocument();
			});
		});

		describe('with download button', () => {
			it('renders download button', async () => {
				renderEmbedModal({
					download: 'https://download-url',
				});
				const button = await screen.findByTestId(`${testId}-download-button`);
				expect(button).toBeInTheDocument();

				await userEvent.hover(button);
				expect(await screen.findByTestId(`${testId}-download-tooltip`)).toBeInTheDocument();

				const tooltip = await screen.findByTestId(`${testId}-download-tooltip`);
				expect(tooltip.textContent).toBe(messages.download.defaultMessage);
			});

			it('triggers download when clicking download button', async () => {
				const downloadUrlSpy = jest.spyOn(utils, 'downloadUrl');
				const url = 'https://download-url';
				renderEmbedModal({
					download: url,
				});
				const button = await screen.findByTestId(`${testId}-download-button`);

				await userEvent.hover(button);
				expect(await screen.findByTestId(`${testId}-download-tooltip`)).toBeInTheDocument();

				const tooltip = await screen.findByTestId(`${testId}-download-tooltip`);
				expect(tooltip.textContent).toBe(messages.download.defaultMessage);

				await user.click(button);
				await flushPromises();

				expect(downloadUrlSpy).toHaveBeenCalledTimes(1);
			});

			it('does not render download button when download url is not provided', () => {
				renderEmbedModal();
				const button = screen.queryByTestId(`${testId}-download-button`);
				expect(button).not.toBeInTheDocument();
			});
		});
	});

	it('triggers open failed callback when modal content throws error', async () => {
		const onOpenFailed = jest.fn();
		renderEmbedModal({
			icon: { icon: <ThrowError /> },
			onOpenFailed,
		});
		expect(onOpenFailed).toHaveBeenCalledTimes(1);
	});

	describe('with analytics', () => {
		beforeEach(() => {
			jest.clearAllMocks();
			jest.restoreAllMocks();
			spy.mockClear();
		});

		it('dispatches analytics event on modal open', async () => {
			const onOpen = jest.fn();
			renderEmbedModal({
				onOpen,
				origin: 'smartLinkPreviewHoverCard',
			});
			await screen.findByTestId(testId);

			await waitFor(() => expect(onOpen).toHaveBeenCalledTimes(1));

			expect(spy).toHaveBeenCalledTimes(2);
			expect(spy).toHaveBeenNthCalledWith(
				1,
				expect.objectContaining({
					payload: {
						action: 'viewed',
						actionSubject: 'embedPreviewModal',
						name: 'embedPreviewModal',
						attributes: {
							...EXPECTED_COMMON_ATTRIBUTES,
							id,
							origin: 'smartLinkPreviewHoverCard',
							size: 'large',
						},
						eventType: 'screen',
					},
				}),
				ANALYTICS_CHANNEL,
			);
			expect(spy).toHaveBeenLastCalledWith(
				expect.objectContaining({
					payload: {
						action: 'renderSuccess',
						actionSubject: 'smartLink',
						attributes: {
							id,
							componentName: 'smart-cards',
							definitionId: 'spaghetti-id',
							display: 'embedPreview',
							destinationProduct: 'spaghetti-product',
							destinationSubproduct: 'spaghetti-subproduct',
							extensionKey: 'spaghetti-key',
							location,
							packageName: expect.any(String),
							packageVersion: expect.any(String),
							resourceType: 'spaghetti-resource',
							destinationObjectType: 'spaghetti-resource',
							status: 'resolved',
							canBeDatasource: false,
						},
						eventType: 'ui',
					},
				}),
				ANALYTICS_CHANNEL,
			);
		});

		it('dispatches analytics event on modal open failed', async () => {
			const onOpenFailed = jest.fn();
			renderEmbedModal({
				icon: { icon: <ThrowError /> },
				onOpenFailed,
			});

			await waitFor(() => expect(onOpenFailed).toHaveBeenCalledTimes(1));
			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: {
						action: 'renderFailed',
						actionSubject: 'smartLink',
						attributes: {
							...EXPECTED_COMMON_ATTRIBUTES,
							id,
							display: 'embedPreview',
							error: expect.any(Object),
							errorInfo: expect.any(Object),
						},
						eventType: 'ui',
					},
				}),
				ANALYTICS_CHANNEL,
			);
		});

		it('dispatches analytics event on modal close', async () => {
			const onClose = jest.fn();
			const onOpen = jest.fn();
			renderEmbedModal({
				onClose,
				onOpen,
				origin: 'smartLinkCard',
			});
			await waitFor(() => expect(onOpen).toHaveBeenCalledTimes(1));
			const button = await screen.findByTestId(`${testId}-close-button`);
			await user.click(button);
			await waitForElementToBeRemoved(() => screen.queryByTestId(testId));

			expect(onClose).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenLastCalledWith(
				expect.objectContaining({
					payload: {
						action: 'closed',
						actionSubject: 'modal',
						actionSubjectId: 'embedPreview',
						attributes: {
							...EXPECTED_COMMON_ATTRIBUTES,
							id,
							origin: 'smartLinkCard',
							previewTime: expect.any(Number),
							size: 'large',
						},
						eventType: 'ui',
					},
				}),
				ANALYTICS_CHANNEL,
			);
		});

		it('dispatches analytics event on resize modal', async () => {
			const onResize = jest.fn();
			renderEmbedModal({
				onResize,
				origin: 'smartLinkCard',
			});

			const button = await screen.findByTestId(`${testId}-resize-button`);
			await user.click(button);

			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: {
						action: 'clicked',
						actionSubject: 'button',
						actionSubjectId: 'embedPreviewResize',
						attributes: {
							...EXPECTED_COMMON_ATTRIBUTES,
							id,
							newSize: 'small',
							origin: 'smartLinkCard',
							previousSize: 'large',
						},
						eventType: 'ui',
					},
				}),
				ANALYTICS_CHANNEL,
			);
			expect(onResize).toHaveBeenCalledTimes(1);
		});

		it('dispatches analytics event on open url on a new tab', async () => {
			const ufoStartSpy = jest.spyOn(ufo, 'startUfoExperience');
			const ufoSucceedSpy = jest.spyOn(ufo, 'succeedUfoExperience');
			uuid.mockReturnValueOnce(EXPERIENCE_TEST_ID);

			renderEmbedModal({
				url: 'https://link-url',
			});

			// Wait for stable and clear all ufo experience calls right before act.
			await screen.findByTestId(testId);
			await flushPromises();
			ufoStartSpy.mockReset();
			ufoSucceedSpy.mockReset();

			const button = await screen.findByTestId(`${testId}-url-button`);
			await user.click(button);
			await flushPromises();

			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: {
						action: 'clicked',
						actionSubject: 'button',
						actionSubjectId: 'shortcutGoToLink',
						attributes: {
							...EXPECTED_COMMON_ATTRIBUTES,
							id,
							actionType: 'ViewAction',
							display: 'embedPreview',
						},
						eventType: 'ui',
					},
				}),
				ANALYTICS_CHANNEL,
			);
			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: {
						action: 'resolved',
						actionSubject: 'smartLinkAction',
						attributes: {
							...EXPECTED_COMMON_ATTRIBUTES,
							id,
							actionType: 'ViewAction',
							display: 'embedPreview',
						},
						eventType: 'operational',
					},
				}),
				ANALYTICS_CHANNEL,
			);

			expect(ufoStartSpy).toHaveBeenCalledTimes(1);
			expect(ufoStartSpy).toHaveBeenCalledWith('smart-link-action-invocation', EXPERIENCE_TEST_ID, {
				actionType: 'ViewAction',
				display: 'embedPreview',
				extensionKey: 'object-provider',
				invokeType: 'client',
			});
			expect(ufoSucceedSpy).toHaveBeenCalledTimes(1);
			expect(ufoSucceedSpy).toHaveBeenCalledWith(
				'smart-link-action-invocation',
				EXPERIENCE_TEST_ID,
			);
			expect(ufoStartSpy).toHaveBeenCalledBefore(ufoSucceedSpy as jest.Mock);
		});

		it('dispatches analytics event on download url', async () => {
			const ufoStartSpy = jest.spyOn(ufo, 'startUfoExperience');
			const ufoSucceedSpy = jest.spyOn(ufo, 'succeedUfoExperience');
			uuid.mockReturnValueOnce(EXPERIENCE_TEST_ID);
			const url = 'https://download-url';

			renderEmbedModal({
				download: url,
			});

			// Wait for stable and clear all ufo experience calls right before act.
			await screen.findByTestId(testId);
			await flushPromises();
			ufoStartSpy.mockReset();
			ufoSucceedSpy.mockReset();

			const button = await screen.findByTestId(`${testId}-download-button`);
			await user.click(button);
			await flushPromises();

			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: {
						action: 'clicked',
						actionSubject: 'button',
						actionSubjectId: 'downloadDocument',
						attributes: {
							...EXPECTED_COMMON_ATTRIBUTES,
							id,
							actionType: 'DownloadAction',
							display: 'embedPreview',
						},
						eventType: 'ui',
					},
				}),
				ANALYTICS_CHANNEL,
			);
			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: {
						action: 'resolved',
						actionSubject: 'smartLinkAction',
						attributes: {
							...EXPECTED_COMMON_ATTRIBUTES,
							id,
							actionType: 'DownloadAction',
							display: 'embedPreview',
						},
						eventType: 'operational',
					},
				}),
				ANALYTICS_CHANNEL,
			);
			expect(ufoStartSpy).toHaveBeenCalledTimes(1);
			expect(ufoStartSpy).toHaveBeenCalledWith('smart-link-action-invocation', EXPERIENCE_TEST_ID, {
				actionType: 'DownloadAction',
				display: 'embedPreview',
				extensionKey: 'object-provider',
				invokeType: 'client',
			});
			expect(ufoSucceedSpy).toHaveBeenCalledTimes(1);
			expect(ufoSucceedSpy).toHaveBeenCalledWith(
				'smart-link-action-invocation',
				EXPERIENCE_TEST_ID,
			);
			expect(ufoStartSpy).toHaveBeenCalledBefore(ufoSucceedSpy as jest.Mock);
		});
	});
});
