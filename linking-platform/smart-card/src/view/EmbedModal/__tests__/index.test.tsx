import React, { useEffect } from 'react';

import * as jestExtendedMatchers from 'jest-extended';
import { IntlProvider } from 'react-intl';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as uuid } from 'uuid';

import FabricAnalyticsListeners from '@atlaskit/analytics-listeners/FabricAnalyticsListeners';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners/types';
import AnalyticsContext from '@atlaskit/analytics-next/AnalyticsContext';
import { flushPromises } from '@atlaskit/link-test-helpers/promise/flush-promises';
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing/skip-file-decorator';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render, waitFor } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';
import { within } from '@atlassian/testing-library/within';

import { useAnalyticsEvents } from '../../../common/analytics/generated/use-analytics-events';
import { ActionName } from '../../../index';
import { messages } from '../../../messages';
import * as startUfoExperienceModule from '../../../state/analytics/startUfoExperience';
import * as succeedUfoExperienceModule from '../../../state/analytics/succeedUfoExperience';
import type { InvokeClientActionProps } from '../../../state/hooks/use-invoke-client-action/types';
import { context } from '../../../utils/analytics/analytics';
import { SmartLinkAnalyticsContext } from '../../../utils/analytics/SmartLinkAnalyticsContext';
import { mocks } from '../../../utils/mocks';
import * as EmbedContent from '../components/embed-content';
import { MAX_MODAL_SIZE } from '../constants';
import EmbedModal from '../index';
import { EmbedModalSize } from '../types';

jest.mock('uuid', () => ({
	...jest.requireActual('uuid'),
	__esModule: true,
	v4: jest.fn().mockReturnValue('some-uuid-1'),
}));
// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

jest.mock('@atlaskit/link-provider/use-smart-link-context', () => ({
	...jest.requireActual('@atlaskit/link-provider/use-smart-link-context'),
	useSmartLinkContext: () => ({
		store: {
			getState: () => ({ 'test-url': mocks.analytics }),
			subscribe: jest.fn(),
		},
	}),
}));

expect.extend(jestExtendedMatchers);

const EXPERIENCE_TEST_ID = 'smart-link-action-invocation';

// These values should have been set in analytics context
const EXPECTED_COMMON_ATTRIBUTES = {
	componentName: 'smart-cards',
	definitionId: 'spaghetti-id',
	destinationObjectType: 'spaghetti-resource',
	destinationProduct: 'spaghetti-product',
	destinationSubproduct: 'spaghetti-subproduct',
	extensionKey: 'spaghetti-key',
	packageName: '@product/platform',
	packageVersion: '0.0.0',
	resourceType: 'spaghetti-resource',
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
	const spy = jest.fn();

	const mockAnalyticsClient = {
		sendUIEvent: jest.fn().mockResolvedValue(undefined),
		sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
		sendTrackEvent: jest.fn().mockResolvedValue(undefined),
		sendScreenEvent: jest.fn().mockResolvedValue(undefined),
	} satisfies AnalyticsWebClient;

	const invokeViewAction: InvokeClientActionProps = {
		actionFn: jest.fn().mockResolvedValue(undefined),
		actionSubjectId: 'shortcutGoToLink',
		actionType: 'ViewAction',
		definitionId: 'spaghetti-id',
		display: 'embedPreview',
		extensionKey: 'spaghetti-key',
		id: 'test-id',
		resourceType: 'spaghetti-resource',
	};

	const invokeDownloadAction: InvokeClientActionProps = {
		actionFn: jest.fn().mockResolvedValue(undefined),
		actionSubjectId: 'downloadDocument',
		actionType: ActionName.DownloadAction,
		definitionId: 'spaghetti-id',
		display: 'embedPreview',
		extensionKey: 'spaghetti-key',
		id: 'test-id',
		resourceType: 'spaghetti-resource',
	};

	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<IntlProvider locale="en">
			<FabricAnalyticsListeners client={mockAnalyticsClient}>
				<AnalyticsContext data={{ attributes: context }}>
					<SmartLinkAnalyticsContext url="test-url" id={id}>
						{children}
					</SmartLinkAnalyticsContext>
				</AnalyticsContext>
			</FabricAnalyticsListeners>
		</IntlProvider>
	);

	const TestComponent = ({
		incomingProps,
	}: {
		incomingProps?: Partial<React.ComponentProps<typeof EmbedModal>>;
	}): JSX.Element => {
		const { fireEvent } = useAnalyticsEvents();

		return (
			<EmbedModal
				extensionKey="spaghetti-key"
				fireEvent={fireEvent}
				id={id}
				iframeName="iframe-name"
				onClose={() => {}}
				showModal={true}
				testId={testId}
				{...incomingProps}
			/>
		);
	};

	const renderEmbedModal = (props?: Partial<React.ComponentProps<typeof EmbedModal>>) => {
		return render(<TestComponent incomingProps={props} />, { wrapper });
	};

	const expectModalSize = (modal: HTMLElement, size: string) => {
		// This check is not ideal but it is the only value on DS modal dialog
		// HTML element that indicates change in size of the component.
		// The top-layer modal sets it on the surface inside the `<dialog>`, and resolves a
		// percentage against the legacy positioner width.
		const isTopLayer = fg('platform-dst-top-layer');
		const surface = isTopLayer
			? // eslint-disable-next-line testing-library/no-node-access -- The surface has no role or test ID.
				modal.querySelector('[style*="--modal-dialog-width"]')
			: modal;
		const expectedSize =
			isTopLayer && size.endsWith('%') ? `calc(${parseFloat(size)} * (100vw - 120px) / 100)` : size;
		expect(surface?.getAttribute('style')).toContain(`--modal-dialog-width: ${expectedSize};`);
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

	it('should render with size', () => {
		renderEmbedModal({ size: EmbedModalSize.Small });
		const modal = screen.getByTestId(testId);
		expectModalMinSize(modal);
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<IntlProvider locale="en">
				<EmbedModal iframeName="iframe-name" onClose={() => {}} showModal={true} testId={testId} />
			</IntlProvider>,
		);

		await expect(container).toBeAccessible();
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

		expect(await screen.findByTestId(`${testId}-title`)).toHaveTextContent(title);
	});

	describe('modal title (platform_dst-modal_title)', () => {
		const title = 'Link title';

		it('keeps the h2 heading and names the dialog with label when the gate is off', async () => {
			failGate('platform_dst-modal_title');
			renderEmbedModal({ title });

			const heading = await screen.findByTestId(`${testId}-title`);
			expect(heading.tagName).toBe('H2');
			expect(heading).toHaveTextContent(title);
			expect(screen.getByRole('dialog', { name: title })).toHaveAttribute('aria-label', title);
			expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
		});

		it('wraps the title in ModalTitle and names the dialog by it when the gate is on', async () => {
			passGate('platform_dst-modal_title');
			renderEmbedModal({ title });

			const heading = await screen.findByTestId(`${testId}-title`);
			expect(heading.tagName).toBe('SPAN');
			expect(heading).toHaveTextContent(title);
			expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();

			const dialog = screen.getByRole('dialog', { name: title });
			expect(dialog).not.toHaveAttribute('aria-label');
			expect(dialog).toHaveAttribute('aria-labelledby');
		});
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

			const button = await screen.findByTestId(`${testId}--close-button`);

			await userEvent.hover(button);

			expect(await screen.findByTestId(`${testId}-close-tooltip`)).toBeInTheDocument();

			const tooltip = await screen.findByTestId(`${testId}-close-tooltip`);
			expect(tooltip.textContent).toBe(messages.preview_close.defaultMessage);

			await user.click(button);
			await waitFor(() => expect(screen.queryByTestId(testId)).not.toBeInTheDocument());
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
				renderEmbedModal({ invokeViewAction });
				const button = await screen.findByTestId(`${testId}-url-button`);
				expect(button).toBeInTheDocument();

				await userEvent.hover(button);

				expect(await screen.findByTestId(`${testId}-url-tooltip`)).toBeInTheDocument();

				const tooltip = await screen.findByTestId(`${testId}-url-tooltip`);
				expect(tooltip.textContent).toBe(messages.viewOriginal.defaultMessage);
			});

			it('renders url button with provider name', async () => {
				renderEmbedModal({
					invokeViewAction,
					providerName: 'Confluence',
				});
				const button = await screen.findByTestId(`${testId}-url-button`);

				await userEvent.hover(button);
				expect(await screen.findByTestId(`${testId}-url-tooltip`)).toBeInTheDocument();

				const tooltip = await screen.findByTestId(`${testId}-url-tooltip`);
				expect(tooltip).toHaveTextContent('View in Confluence');
			});

			it('does not render url button when url is not provided', () => {
				renderEmbedModal();
				const button = screen.queryByTestId(`${testId}-url-button`);
				expect(button).not.toBeInTheDocument();
			});
		});

		describe('with download button', () => {
			it('renders download button', async () => {
				renderEmbedModal({ invokeDownloadAction });
				const button = await screen.findByTestId(`${testId}-download-button`);
				expect(button).toBeInTheDocument();

				await userEvent.hover(button);
				expect(await screen.findByTestId(`${testId}-download-tooltip`)).toBeInTheDocument();

				const tooltip = await screen.findByTestId(`${testId}-download-tooltip`);
				expect(tooltip.textContent).toBe(messages.download.defaultMessage);
			});

			it('does not render download button when download url is not provided', () => {
				renderEmbedModal();
				const button = screen.queryByTestId(`${testId}-download-button`);
				expect(button).not.toBeInTheDocument();
			});
		});
	});

	describe('when Escape is pressed', () => {
		// Simulates a layered component underneath the modal (e.g. a drawer) that closes on Escape
		// through a `window` keydown listener, like `@atlaskit/layering`'s `useCloseOnEscapePress`.
		let underlyingLayerOnEscape: jest.Mock;
		const handleUnderlyingLayerKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				underlyingLayerOnEscape();
			}
		};

		beforeEach(() => {
			underlyingLayerOnEscape = jest.fn();
			window.addEventListener('keydown', handleUnderlyingLayerKeyDown);
		});

		afterEach(() => {
			window.removeEventListener('keydown', handleUnderlyingLayerKeyDown);
		});

		it('closes only the modal and not the layer underneath when platform_sl_embed_modal_escape_isolation is enabled', async () => {
			passGate('platform_sl_embed_modal_escape_isolation');
			const onClose = jest.fn();
			renderEmbedModal({ onClose });
			await screen.findByTestId(testId);

			await user.keyboard('{Escape}');
			await waitFor(() => expect(screen.queryByTestId(testId)).not.toBeInTheDocument());

			expect(onClose).toHaveBeenCalledTimes(1);
			expect(underlyingLayerOnEscape).not.toHaveBeenCalled();
		});

		it('lets Escape reach the layer underneath once the modal has closed when platform_sl_embed_modal_escape_isolation is enabled', async () => {
			passGate('platform_sl_embed_modal_escape_isolation');
			renderEmbedModal();
			await screen.findByTestId(testId);

			await user.keyboard('{Escape}');
			await waitFor(() => expect(screen.queryByTestId(testId)).not.toBeInTheDocument());
			await user.keyboard('{Escape}');

			expect(underlyingLayerOnEscape).toHaveBeenCalledTimes(1);
		});

		describe('with a modal dialog opened on top of the modal', () => {
			// A modal dialog opened from the page underneath after the preview (e.g. a Share dialog). It is
			// rendered in a separate React root, like the page that opens it.
			const renderForegroundModal = (onClose: () => void) =>
				render(
					<ModalDialog onClose={onClose} label="Share">
						<button type="button">Share</button>
					</ModalDialog>,
				);

			it('lets the modal dialog on top handle Escape when platform_sl_embed_modal_escape_isolation is enabled', async () => {
				passGate('platform_sl_embed_modal_escape_isolation');
				const onClose = jest.fn();
				const foregroundOnClose = jest.fn();
				renderEmbedModal({ onClose, invokeViewAction });
				await screen.findByTestId(testId);

				renderForegroundModal(foregroundOnClose);
				await screen.findByRole('button', { name: 'Share' });
				// Even if the key press comes from inside the preview (e.g. focus did not move to the modal on
				// top), the modal on top owns Escape. The preview is hidden from assistive technology while it
				// is behind another modal.
				const previewButton = within(screen.getByTestId(testId)).getAllByRole('button', {
					hidden: true,
				})[0];
				previewButton.dispatchEvent(
					new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
				);

				expect(foregroundOnClose).toHaveBeenCalledTimes(1);
				expect(screen.getByTestId(testId)).toBeInTheDocument();
				expect(onClose).not.toHaveBeenCalled();
			});

			it('handles Escape again once the modal dialog on top has closed when platform_sl_embed_modal_escape_isolation is enabled', async () => {
				passGate('platform_sl_embed_modal_escape_isolation');
				const onClose = jest.fn();
				renderEmbedModal({ onClose, invokeViewAction });
				await screen.findByTestId(testId);

				const { unmount } = renderForegroundModal(jest.fn());
				await screen.findByRole('button', { name: 'Share' });
				unmount();
				within(screen.getByTestId(testId)).getAllByRole('button')[0].focus();
				await user.keyboard('{Escape}');
				await waitFor(() => expect(screen.queryByTestId(testId)).not.toBeInTheDocument());

				expect(onClose).toHaveBeenCalledTimes(1);
				expect(underlyingLayerOnEscape).not.toHaveBeenCalled();
			});
		});

		describe('with a non-modal layer on top of the modal that holds focus', () => {
			// A layer that is not a modal dialog, so it is not in the modal dialog stack. It holds focus
			// and claims Escape before `window` bubble listeners run.
			let foregroundDialog: HTMLElement;
			let foregroundOnEscape: jest.Mock;

			beforeEach(() => {
				foregroundOnEscape = jest.fn();
				foregroundDialog = document.createElement('div');
				foregroundDialog.setAttribute('role', 'dialog');
				foregroundDialog.setAttribute('data-no-focus-lock', 'true');
				const button = document.createElement('button');
				button.textContent = 'Share';
				foregroundDialog.appendChild(button);
				foregroundDialog.addEventListener('keydown', (event) => {
					if (event.key === 'Escape') {
						event.stopPropagation();
						foregroundOnEscape();
					}
				});
				document.body.appendChild(foregroundDialog);
			});

			afterEach(() => {
				foregroundDialog.remove();
			});

			it('lets the layer on top handle Escape when platform_sl_embed_modal_escape_isolation is enabled', async () => {
				passGate('platform_sl_embed_modal_escape_isolation');
				const onClose = jest.fn();
				renderEmbedModal({ onClose });
				await screen.findByTestId(testId);

				within(foregroundDialog).getByRole('button', { name: 'Share' }).focus();
				await user.keyboard('{Escape}');

				expect(foregroundOnEscape).toHaveBeenCalledTimes(1);
				expect(screen.getByTestId(testId)).toBeInTheDocument();
				expect(onClose).not.toHaveBeenCalled();
			});

			it('does not claim Escape when focus falls back to the body after leaving the modal when platform_sl_embed_modal_escape_isolation is enabled', async () => {
				passGate('platform_sl_embed_modal_escape_isolation');
				renderEmbedModal();
				await screen.findByTestId(testId);

				within(foregroundDialog).getByRole('button', { name: 'Share' }).focus();
				foregroundDialog.remove();
				await user.keyboard('{Escape}');

				expect(underlyingLayerOnEscape).toHaveBeenCalledTimes(1);
			});
		});

		it('closes only the modal when focus falls back to the body after being in the modal when platform_sl_embed_modal_escape_isolation is enabled', async () => {
			passGate('platform_sl_embed_modal_escape_isolation');
			const onClose = jest.fn();
			renderEmbedModal({ onClose, invokeViewAction });
			await screen.findByTestId(testId);

			const modal = screen.getByTestId(testId);
			within(modal).getAllByRole('button')[0].focus();
			(document.activeElement as HTMLElement | null)?.blur();
			await user.keyboard('{Escape}');
			await waitFor(() => expect(screen.queryByTestId(testId)).not.toBeInTheDocument());

			expect(onClose).toHaveBeenCalledTimes(1);
			expect(underlyingLayerOnEscape).not.toHaveBeenCalled();
		});

		it('closes the modal and the layer underneath when platform_sl_embed_modal_escape_isolation is disabled', async () => {
			failGate('platform_sl_embed_modal_escape_isolation');
			const onClose = jest.fn();
			renderEmbedModal({ onClose });
			await screen.findByTestId(testId);

			await user.keyboard('{Escape}');
			await waitFor(() => expect(screen.queryByTestId(testId)).not.toBeInTheDocument());

			expect(onClose).toHaveBeenCalledTimes(1);
			expect(underlyingLayerOnEscape).toHaveBeenCalledTimes(1);
		});
	});

	it('triggers open failed callback when modal content throws error', async () => {
		const onOpenFailed = jest.fn();
		const spy = jest.spyOn(EmbedContent, 'default').mockReturnValue(<ThrowError />);

		renderEmbedModal({ onOpenFailed });
		expect(onOpenFailed).toHaveBeenCalledTimes(1);

		spy.mockRestore();
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

			expect(mockAnalyticsClient.sendScreenEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'viewed',
					attributes: expect.objectContaining({
						...EXPECTED_COMMON_ATTRIBUTES,
						id,
						origin: 'smartLinkPreviewHoverCard',
						size: 'large',
					}),
					name: 'embedPreviewModal',
					tags: ['media'],
				}),
			);

			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenLastCalledWith(
				expect.objectContaining({
					action: 'renderSuccess',
					actionSubject: 'smartLink',
					attributes: expect.objectContaining({
						id,
						componentName: 'smart-cards',
						definitionId: 'spaghetti-id',
						display: 'embedPreview',
						destinationProduct: 'spaghetti-product',
						destinationSubproduct: 'spaghetti-subproduct',
						extensionKey: 'spaghetti-key',
						packageName: expect.any(String),
						packageVersion: expect.any(String),
						resourceType: 'spaghetti-resource',
						destinationObjectType: 'spaghetti-resource',
						status: 'resolved',
						canBeDatasource: false,
					}),
					tags: ['media'],
				}),
			);
		});

		it('dispatches analytics event on modal open failed', async () => {
			const spy = jest.spyOn(EmbedContent, 'default').mockReturnValue(<ThrowError />);
			const onOpenFailed = jest.fn();
			renderEmbedModal({ onOpenFailed });

			await waitFor(() => expect(onOpenFailed).toHaveBeenCalledTimes(1));
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'renderFailed',
					actionSubject: 'smartLink',
					attributes: expect.objectContaining({
						...EXPECTED_COMMON_ATTRIBUTES,
						id,
						display: 'embedPreview',
						error: expect.any(Object),
						errorInfo: expect.any(Object),
					}),
					tags: ['media'],
				}),
			);
			spy.mockRestore();
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
			const button = await screen.findByTestId(`${testId}--close-button`);
			await user.click(button);
			await waitFor(() => expect(screen.queryByTestId(testId)).not.toBeInTheDocument());

			expect(onClose).toHaveBeenCalledTimes(1);
			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenLastCalledWith(
				expect.objectContaining({
					action: 'closed',
					actionSubject: 'modal',
					actionSubjectId: 'embedPreview',
					attributes: expect.objectContaining({
						...EXPECTED_COMMON_ATTRIBUTES,
						id,
						origin: 'smartLinkCard',
						previewTime: expect.any(Number),
						size: 'large',
					}),
					tags: ['media'],
				}),
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

			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'embedPreviewResize',
					attributes: expect.objectContaining({
						...EXPECTED_COMMON_ATTRIBUTES,
						id,
						newSize: 'small',
						origin: 'smartLinkCard',
						previousSize: 'large',
					}),
					tags: ['media'],
				}),
			);
			expect(onResize).toHaveBeenCalledTimes(1);
		});

		it('dispatches analytics event on open url on a new tab', async () => {
			const ufoStartSpy = jest.spyOn(startUfoExperienceModule, 'startUfoExperience');
			const ufoSucceedSpy = jest.spyOn(succeedUfoExperienceModule, 'succeedUfoExperience');
			uuid.mockReturnValueOnce(EXPERIENCE_TEST_ID);

			renderEmbedModal({ invokeViewAction, url: 'https://link-url' });

			// Wait for stable and clear all ufo experience calls right before act.
			await screen.findByTestId(testId);
			await flushPromises();
			ufoStartSpy.mockReset();
			ufoSucceedSpy.mockReset();

			const button = await screen.findByTestId(`${testId}-url-button`);
			await user.click(button);
			await flushPromises();

			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'shortcutGoToLink',
					attributes: expect.objectContaining({
						...EXPECTED_COMMON_ATTRIBUTES,
						id,
						actionType: 'ViewAction',
						display: 'embedPreview',
					}),
					tags: ['media'],
				}),
			);

			expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'visited',
					actionSubject: 'smartLink',
					attributes: expect.objectContaining({
						id,
						display: 'embedPreview',
					}),
					tags: ['media'],
				}),
			);
			expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'resolved',
					actionSubject: 'smartLinkAction',
					attributes: expect.objectContaining({
						...EXPECTED_COMMON_ATTRIBUTES,
						id,
						actionType: 'ViewAction',
						display: 'embedPreview',
					}),
					tags: ['media'],
				}),
			);

			expect(ufoStartSpy).toHaveBeenCalledTimes(1);
			expect(ufoStartSpy).toHaveBeenCalledWith('smart-link-action-invocation', EXPERIENCE_TEST_ID, {
				actionType: 'ViewAction',
				display: 'embedPreview',
				extensionKey: 'spaghetti-key',
				invokeType: 'client',
			});
			expect(ufoSucceedSpy).toHaveBeenCalledTimes(1);
			expect(ufoSucceedSpy).toHaveBeenCalledWith(
				'smart-link-action-invocation',
				EXPERIENCE_TEST_ID,
			);
			expect(ufoStartSpy).toHaveBeenCalledBefore(ufoSucceedSpy as jest.Mock);
		});

		it('dispatches track.smartLink.visited event on resize', async () => {
			const onResize = jest.fn();
			renderEmbedModal({
				invokeViewAction,
				onResize,
				origin: 'smartLinkCard',
			});

			const button = await screen.findByTestId(`${testId}-resize-button`);
			await user.click(button);

			expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'visited',
					actionSubject: 'smartLink',
					attributes: expect.objectContaining({
						...EXPECTED_COMMON_ATTRIBUTES,
						id,
						display: 'embedPreview',
					}),
					tags: ['media'],
				}),
			);
		});

		it('does not dispatch track.smartLink.visited event on resize when invokeViewAction is not provided', async () => {
			const onResize = jest.fn();
			renderEmbedModal({
				onResize,
				origin: 'smartLinkCard',
			});

			const button = await screen.findByTestId(`${testId}-resize-button`);
			await user.click(button);

			expect(mockAnalyticsClient.sendTrackEvent).not.toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'visited',
					actionSubject: 'smartLink',
				}),
			);
		});

		it('dispatches analytics event on download url', async () => {
			const ufoStartSpy = jest.spyOn(startUfoExperienceModule, 'startUfoExperience');
			const ufoSucceedSpy = jest.spyOn(succeedUfoExperienceModule, 'succeedUfoExperience');
			uuid.mockReturnValueOnce(EXPERIENCE_TEST_ID);
			const url = 'https://download-url';

			renderEmbedModal({
				invokeDownloadAction,
				url: url,
			});

			// Wait for stable and clear all ufo experience calls right before act.
			await screen.findByTestId(testId);
			await flushPromises();
			ufoStartSpy.mockReset();
			ufoSucceedSpy.mockReset();

			const button = await screen.findByTestId(`${testId}-download-button`);
			await user.click(button);
			await flushPromises();

			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'downloadDocument',
					attributes: expect.objectContaining({
						...EXPECTED_COMMON_ATTRIBUTES,
						id,
						actionType: 'DownloadAction',
						display: 'embedPreview',
					}),
					tags: ['media'],
				}),
			);
			expect(mockAnalyticsClient.sendOperationalEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'resolved',
					actionSubject: 'smartLinkAction',
					attributes: expect.objectContaining({
						...EXPECTED_COMMON_ATTRIBUTES,
						id,
						actionType: 'DownloadAction',
						display: 'embedPreview',
					}),
					tags: ['media'],
				}),
			);
			expect(ufoStartSpy).toHaveBeenCalledTimes(1);
			expect(ufoStartSpy).toHaveBeenCalledWith('smart-link-action-invocation', EXPERIENCE_TEST_ID, {
				actionType: 'DownloadAction',
				display: 'embedPreview',
				extensionKey: 'spaghetti-key',
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

	describe('a11y', () => {
		it('should should capture and report a11y violations', async () => {
			const { container } = renderEmbedModal({ invokeViewAction, invokeDownloadAction });

			await expect(container).toBeAccessible();
		});

		it.each([
			['Close full screen', EmbedModalSize.Large],
			['View full screen', EmbedModalSize.Small],
			['View Original'],
			['Download'],
		])(
			'should render both button text and aria-label for %s button',
			(buttonText: string, size = EmbedModalSize.Large) => {
				renderEmbedModal({ invokeViewAction, invokeDownloadAction, size });

				expect(screen.queryByText(buttonText)).toBeInTheDocument();
				expect(screen.queryByLabelText(buttonText)).not.toBeInTheDocument();
			},
		);

		it('should have list for action items', async () => {
			renderEmbedModal({ invokeViewAction, invokeDownloadAction });

			const list = await screen.findByRole('list');

			expect(list).toBeInTheDocument();
			expect(within(list).queryAllByRole('button').length).toBe(3);
		});
	});
});
