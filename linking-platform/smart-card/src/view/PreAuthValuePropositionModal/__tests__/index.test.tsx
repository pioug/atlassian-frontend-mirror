import React from 'react';

import { envType } from '@atlassiansox/analytics-web-client/analytics-web-types';
import { act, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { extractSmartLinkProvider } from '@atlaskit/link-extractors/extract-smart-link-provider';
import { createChoreographedContent } from '@atlaskit/link-provider/create-choreographed-content';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import type { SmartLinkChoreographer } from '@atlaskit/link-provider/types';
import type { ModalDialogProps } from '@atlaskit/modal-dialog/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { mockExp } from '@atlassian/experiment-test-utils/mock-exp';
import { wasExperimentExposed } from '@atlassian/experiment-test-utils/was-experiment-exposed';
import { ProductIds } from '@atlassian/ipm-choreographer/constants';
import { choreographerFactory } from '@atlassian/ipm-choreographer/factory';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';
import { waitFor } from '@atlassian/testing-library/wait-for';

import useSocialProof from '../../../state/hooks/use-social-proof';
import { useSmartLink } from '../../../state/hooks/useSmartLink';
import { preAuthValuePropositionModalService } from '../../../state/services/pre-auth-value-proposition-modal';
import { mockUnauthorisedResponse } from '../../HoverCard/__tests__/__mocks__/mocks';
import { PreAuthValuePropositionModal } from '../index';

const mockAuthorize = jest.fn();
const mockFireEvent = jest.fn();
const mockOnFinished = jest.fn();
const mockOnOpenChange = jest.fn();
const mockHasReachedShowLimit = jest.spyOn(
	preAuthValuePropositionModalService,
	'hasReachedShowLimit',
);
const mockRecordShow = jest.spyOn(preAuthValuePropositionModalService, 'recordShow');
const testUrl = 'https://drive.google.com/file/test';
const experiment = 'platform_sl_3p_preauth_value_modal';
let mockChoreographer: SmartLinkChoreographer | undefined;
let mockDeferOpenComplete = false;
let mockOpenComplete: ModalDialogProps['onOpenComplete'];
let host: ReturnType<typeof choreographerFactory>;
let other: ReturnType<typeof choreographerFactory>;
jest.mock('@atlassiansox/analytics-web-client/client', () => ({
	__esModule: true,
	default: jest.fn(() => ({ sendOperationalEvent: jest.fn() })),
}));

// Keep the real modal and interactions, but allow tests to hold its entrance completion.
jest.mock('@atlaskit/modal-dialog/modal-dialog', () => {
	const { default: Modal } = jest.requireActual<
		typeof import('@atlaskit/modal-dialog/modal-dialog')
	>('@atlaskit/modal-dialog/modal-dialog');
	return {
		__esModule: true,
		default: (props: ModalDialogProps) => {
			mockOpenComplete = props.onOpenComplete;
			return (
				<Modal
					{...props}
					onOpenComplete={mockDeferOpenComplete ? undefined : props.onOpenComplete}
				/>
			);
		},
	};
});

jest.mock('@atlaskit/link-extractors/extract-smart-link-provider', () => ({
	extractSmartLinkProvider: jest.fn(),
}));

jest.mock('../../../common/analytics/generated/use-analytics-events', () => ({
	useAnalyticsEvents: () => ({ fireEvent: mockFireEvent }),
}));

jest.mock('../../../utils/analytics/SmartLinkAnalyticsContext', () => ({
	SmartLinkAnalyticsContext: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../../../state/hooks/use-social-proof', () => ({
	__esModule: true,
	default: jest.fn(),
}));

jest.mock('../../../state/hooks/useSmartLink', () => ({
	useSmartLink: jest.fn(),
}));

const mockUseSocialProof = jest.mocked(useSocialProof);
const mockUseSmartLink = jest.mocked(useSmartLink);

const ModalHost = () => (
	<IntlProvider locale="en">
		<SmartCardProvider choreographer={mockChoreographer}>
			<PreAuthValuePropositionModal
				url={testUrl}
				onFinished={mockOnFinished}
				onOpenChange={mockOnOpenChange}
			/>
		</SmartCardProvider>
	</IntlProvider>
);

const renderModalHost = () => render(<ModalHost />);

const setProviderKey = (key: string | undefined) => {
	const current = mockUseSmartLink('test', testUrl, 'inline');
	mockUseSmartLink.mockReturnValue({
		...current,
		state: {
			...current.state,
			details: {
				...mockUnauthorisedResponse,
				meta: { ...mockUnauthorisedResponse.meta, key },
			},
		},
	});
};

describe('PreAuthValuePropositionModal', () => {
	beforeEach(() => {
		host = choreographerFactory(ProductIds.JIRA, envType.LOCAL);
		other = choreographerFactory(ProductIds.POST_OFFICE, envType.LOCAL);
		other.plugin.on('competing-nudge', { start: () => true, stop: () => true });
		mockChoreographer = createChoreographedContent(host.useChoreographer);
		jest.mocked(extractSmartLinkProvider).mockReturnValue({
			icon: 'https://example.com/google-drive-icon.png',
			text: 'Google Drive',
		});
		mockDeferOpenComplete = false;
		mockOpenComplete = undefined;
		mockHasReachedShowLimit.mockReturnValue(false);
		mockUseSocialProof.mockReturnValue({
			connectedPct: 45,
			isEnabled: true,
			isLoading: false,
		});
		mockUseSmartLink.mockReturnValue({
			actions: {
				authorize: mockAuthorize,
				invoke: jest.fn(),
				loadMetadata: jest.fn(),
				register: jest.fn(),
				reload: jest.fn(),
			},
			config: { authFlow: 'oauth2' },
			error: null,
			isPreviewPanelAvailable: undefined,
			isPreviewRestricted: undefined,
			openPreviewPanel: undefined,
			renderers: undefined,
			state: {
				status: 'unauthorized',
				details: mockUnauthorisedResponse,
			},
		});
		mockAuthorize.mockClear();
		mockFireEvent.mockClear();
		mockRecordShow.mockClear();
		mockOnFinished.mockClear();
		mockOnOpenChange.mockClear();
	});

	afterEach(async () => {
		cleanup();
		await act(async () => {});
		host.plugin.destroy();
		other.plugin.destroy();
	});

	describe('modal content and interactions', () => {
		it('renders generic content with the backend provider name for an eligible link', async () => {
			mockExp('platform_sl_3p_preauth_value_modal', { variant: 'modal_text_only' });
			renderModalHost();

			expect(
				await screen.findByRole('heading', { name: 'Connect Google Drive' }),
			).toBeInTheDocument();
			const connectButton = screen.getByRole('button', { name: 'Connect Google Drive' });
			expect(connectButton).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
			const searchBenefit = screen.getByText(
				/across Google Drive and Atlassian content in one place/,
			);
			const answersBenefit = screen.getByText(/answers grounded in your Google Drive context/);
			const previewBenefit = screen.getByText(/richer link previews without leaving your workflow/);
			expect(searchBenefit).toHaveTextContent(
				'Search across Google Drive and Atlassian content in one place',
			);
			expect(answersBenefit).toHaveTextContent('Get answers grounded in your Google Drive context');
			expect(previewBenefit).toHaveTextContent(
				'See richer link previews without leaving your workflow',
			);
			expect(screen.getByText('Search', { selector: 'strong' }).parentElement).toBe(searchBenefit);
			expect(screen.getByText('Get', { selector: 'strong' }).parentElement).toBe(answersBenefit);
			expect(screen.getByText('See', { selector: 'strong' }).parentElement).toBe(previewBenefit);
			expect(
				searchBenefit.compareDocumentPosition(answersBenefit) & Node.DOCUMENT_POSITION_FOLLOWING,
			).toBeTruthy();
			expect(
				answersBenefit.compareDocumentPosition(previewBenefit) & Node.DOCUMENT_POSITION_FOLLOWING,
			).toBeTruthy();
			expect(
				screen.getByTestId('pre-auth-value-proposition-modal-provider-icon-image'),
			).toHaveAttribute('src', 'https://example.com/google-drive-icon.png');
			const socialProof = screen.getByTestId('pre-auth-value-proposition-modal-social-proof');
			expect(socialProof).toHaveTextContent('45% of your team sees Google Drive previews');
			expect(socialProof.tagName).toBe('P');
			expect(
				previewBenefit.compareDocumentPosition(socialProof) & Node.DOCUMENT_POSITION_FOLLOWING,
			).toBeTruthy();
			expect(
				socialProof.compareDocumentPosition(connectButton) & Node.DOCUMENT_POSITION_FOLLOWING,
			).toBeTruthy();
			expect(
				screen.queryByTestId('pre-auth-value-proposition-modal-illustration'),
			).not.toBeInTheDocument();
			await waitFor(() => {
				expect(mockRecordShow).toHaveBeenCalledWith('google-object-provider');
				expect(mockFireEvent).toHaveBeenCalledWith('ui.modal.opened.preAuthValueProposition', {});
			});
		});

		it('renders the same copy with the illustration for the modal_with_image variant', async () => {
			mockExp('platform_sl_3p_preauth_value_modal', { variant: 'modal_with_image' });
			const { baseElement } = renderModalHost();

			expect(
				await screen.findByRole('heading', { name: 'Connect Google Drive' }),
			).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Connect Google Drive' })).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
			expect(screen.getByText(/answers grounded in your Google Drive context/)).toHaveTextContent(
				'Get answers grounded in your Google Drive context',
			);
			expect(
				await screen.findByTestId('pre-auth-value-proposition-modal-illustration'),
			).toBeInTheDocument();
			expect(
				screen.getAllByTestId('pre-auth-value-proposition-modal-illustration-icon-image'),
			).toHaveLength(4);
			await waitFor(() => {
				expect(mockRecordShow).toHaveBeenCalledWith('google-object-provider');
				expect(mockFireEvent).toHaveBeenCalledWith('ui.modal.opened.preAuthValueProposition', {});
			});
			await expect(baseElement).toBeAccessible();
		});

		it.each(['modal_text_only', 'modal_with_image'])(
			'notifies when the %s modal opens and unmounts',
			async (variant) => {
				mockExp('platform_sl_3p_preauth_value_modal', { variant });
				const { unmount } = renderModalHost();
				await screen.findByTestId('pre-auth-value-proposition-modal');
				expect(mockOnOpenChange).toHaveBeenLastCalledWith(true);

				unmount();
				expect(mockOnOpenChange).toHaveBeenLastCalledWith(false);
			},
		);

		it('notifies when the modal is closed', async () => {
			mockExp('platform_sl_3p_preauth_value_modal', { variant: 'modal_text_only' });
			const user = userEvent.setup();
			renderModalHost();
			await user.click(await screen.findByRole('button', { name: 'Close' }));
			expect(mockOnOpenChange).toHaveBeenLastCalledWith(false);
		});

		it('renders low-adoption social proof as standalone text', async () => {
			mockExp('platform_sl_3p_preauth_value_modal', { variant: 'modal_text_only' });
			mockUseSocialProof.mockReturnValue({
				connectedPct: 10,
				isEnabled: true,
				isLoading: false,
			});
			renderModalHost();

			const socialProof = await screen.findByTestId(
				'pre-auth-value-proposition-modal-social-proof',
			);
			expect(socialProof).toHaveTextContent('Your team sees richer Google Drive previews');
			expect(socialProof.tagName).toBe('P');
		});

		it('does not show social proof when personalization data is unavailable', async () => {
			mockExp('platform_sl_3p_preauth_value_modal', { variant: 'modal_text_only' });
			mockUseSocialProof.mockReturnValue({
				connectedPct: undefined,
				isEnabled: false,
				isLoading: false,
			});
			renderModalHost();

			await screen.findByTestId('pre-auth-value-proposition-modal');
			expect(
				screen.queryByTestId('pre-auth-value-proposition-modal-social-proof'),
			).not.toBeInTheDocument();
		});

		it('should capture and report a11y violations', async () => {
			mockExp('platform_sl_3p_preauth_value_modal', { variant: 'modal_text_only' });
			const { baseElement } = renderModalHost();

			await screen.findByTestId('pre-auth-value-proposition-modal');
			await expect(baseElement).toBeAccessible();
		});

		it('starts the existing Smart Link authorization action when Connect is clicked', async () => {
			mockExp('platform_sl_3p_preauth_value_modal', { variant: 'modal_text_only' });
			const user = userEvent.setup();
			renderModalHost();

			await user.click(await screen.findByRole('button', { name: 'Connect Google Drive' }));

			expect(mockAuthorize).toHaveBeenCalledWith('inline');
			expect(mockFireEvent).toHaveBeenCalledWith('track.applicationAccount.authStarted', {});
			expect(mockFireEvent).not.toHaveBeenCalledWith(
				'ui.modal.closed.preAuthValueProposition',
				expect.anything(),
			);
			expect(mockOnFinished).toHaveBeenCalledTimes(1);
		});

		it('fires a closed event with the button close method when Close is clicked', async () => {
			mockExp('platform_sl_3p_preauth_value_modal', { variant: 'modal_text_only' });
			const user = userEvent.setup();
			renderModalHost();

			await user.click(await screen.findByRole('button', { name: 'Close' }));

			expect(mockFireEvent).toHaveBeenCalledWith('ui.modal.closed.preAuthValueProposition', {
				closeMethod: 'button',
				dwellTime: expect.any(Number),
			});
			expect(mockOnFinished).toHaveBeenCalledTimes(1);
		});

		it('fires a closed event with the escape close method when Escape is pressed', async () => {
			mockExp('platform_sl_3p_preauth_value_modal', { variant: 'modal_text_only' });
			const user = userEvent.setup();
			renderModalHost();

			await screen.findByRole('heading', { name: 'Connect Google Drive' });
			await user.keyboard('{Escape}');

			await waitFor(() => {
				expect(mockFireEvent).toHaveBeenCalledWith('ui.modal.closed.preAuthValueProposition', {
					closeMethod: 'escape',
					dwellTime: expect.any(Number),
				});
			});
			expect(mockOnFinished).toHaveBeenCalledTimes(1);
		});

		it('fires a closed event with the overlay close method when the blanket is clicked', async () => {
			mockExp('platform_sl_3p_preauth_value_modal', { variant: 'modal_text_only' });
			const user = userEvent.setup();
			renderModalHost();

			// Legacy renders a blanket. The top-layer `<dialog>` gets the click on its `::backdrop`.
			await user.click(
				await screen.findByTestId(
					fg('platform-dst-top-layer')
						? 'pre-auth-value-proposition-modal'
						: 'pre-auth-value-proposition-modal--blanket',
				),
			);

			await waitFor(() => {
				expect(mockFireEvent).toHaveBeenCalledWith('ui.modal.closed.preAuthValueProposition', {
					closeMethod: 'overlay',
					dwellTime: expect.any(Number),
				});
			});
			expect(mockOnFinished).toHaveBeenCalledTimes(1);
		});

		it('does not render for the experiment control cohort', async () => {
			mockExp('platform_sl_3p_preauth_value_modal', { variant: 'control' });
			renderModalHost();

			await waitFor(() => {
				expect(screen.queryByTestId('pre-auth-value-proposition-modal')).not.toBeInTheDocument();
			});
			expect(mockRecordShow).not.toHaveBeenCalled();
			await waitFor(() => expect(mockOnFinished).toHaveBeenCalledTimes(1));
			expect(mockOnOpenChange).not.toHaveBeenCalled();
		});

		it('does not render after the provider has reached the show limit', async () => {
			mockHasReachedShowLimit.mockReturnValue(true);
			renderModalHost();

			await waitFor(() => {
				expect(screen.queryByTestId('pre-auth-value-proposition-modal')).not.toBeInTheDocument();
			});
			expect(mockRecordShow).not.toHaveBeenCalled();
			expect(mockOnFinished).toHaveBeenCalledTimes(1);
		});
	});

	describe('provider eligibility', () => {
		it.each([
			['Google Drive', 'google-object-provider'],
			['SharePoint', 'onedrive-object-provider'],
			['OneDrive', 'onedrive-object-provider'],
			['Slack', 'slack-object-provider'],
			['GitHub', 'github-object-provider'],
		])('allows %s using its resolved provider key', async (name, key) => {
			mockExp(experiment, { variant: 'modal_text_only' });
			setProviderKey(key);
			jest.mocked(extractSmartLinkProvider).mockReturnValue({ text: name });
			renderModalHost();

			await screen.findByRole('heading', { name: `Connect ${name}` });
			expect(wasExperimentExposed(experiment)).toBe(true);
			await waitFor(() => expect(mockRecordShow).toHaveBeenCalledWith(key));
		});

		it.each([
			'box-object-provider',
			'jira-object-provider',
			'confluence-object-provider',
			'unknown-object-provider',
			'onedrive-object-provider-v2',
			'slack-object-provider-vnext',
			'',
			undefined,
		])('excludes %s even with an allowed display name and URL', async (key) => {
			mockExp(experiment, { variant: 'modal_text_only' });
			setProviderKey(key);
			const start = jest.spyOn(host.plugin, 'startMessage');
			renderModalHost();

			await waitFor(() => expect(mockOnFinished).toHaveBeenCalledTimes(1));
			expect(start).not.toHaveBeenCalled();
			expect(wasExperimentExposed(experiment)).toBe(false);
			expect(mockRecordShow).not.toHaveBeenCalled();
			expect(mockFireEvent).not.toHaveBeenCalled();
			expect(mockOnOpenChange).not.toHaveBeenCalled();
			expect(mockAuthorize).not.toHaveBeenCalled();
			expect(screen.queryByTestId('pre-auth-value-proposition-modal')).not.toBeInTheDocument();
			start.mockRestore();
		});

		it('releases permission when the provider becomes excluded before opening completes', async () => {
			mockExp(experiment, { variant: 'modal_text_only' });
			mockDeferOpenComplete = true;
			const view = renderModalHost();
			await screen.findByRole('heading', { name: 'Connect Google Drive' });
			const completeOpening = mockOpenComplete;

			setProviderKey('box-object-provider');
			view.rerender(<ModalHost />);
			act(() => completeOpening?.(document.body, true));
			await waitFor(() => expect(mockOnFinished).toHaveBeenCalledTimes(1));
			expect(screen.queryByTestId('pre-auth-value-proposition-modal')).not.toBeInTheDocument();
			expect(mockRecordShow).not.toHaveBeenCalled();
			expect(mockFireEvent).not.toHaveBeenCalled();
			expect(mockOnOpenChange).toHaveBeenLastCalledWith(false);
			expect(await other.plugin.startMessage('competing-nudge')).toBe('started');
		});
	});

	describe('host choreography', () => {
		it.each(['modal_text_only', 'modal_with_image'])(
			'shows %s only with permission and records one impression',
			async (variant) => {
				mockExp(experiment, { variant });
				const view = renderModalHost();
				await screen.findByRole('heading', { name: 'Connect Google Drive' });
				await waitFor(() => expect(mockRecordShow).toHaveBeenCalledTimes(1));
				expect(wasExperimentExposed(experiment)).toBe(true);
				expect(mockOnOpenChange).toHaveBeenLastCalledWith(true);
				expect(await other.plugin.startMessage('competing-nudge')).toBe('blocked');
				view.unmount();
				await act(async () => {});
				expect(await other.plugin.startMessage('competing-nudge')).toBe('started');
				expect(mockOnOpenChange).toHaveBeenLastCalledWith(false);
				expect(mockFireEvent).not.toHaveBeenCalledWith(
					'ui.modal.closed.preAuthValueProposition',
					expect.anything(),
				);
			},
		);

		it('drops blocked attempts without experiment exposure, toolbar suppression or frequency writes', async () => {
			await other.plugin.startMessage('competing-nudge');
			renderModalHost();
			await waitFor(() => expect(mockOnFinished).toHaveBeenCalledTimes(1));
			expect(wasExperimentExposed(experiment)).toBe(false);
			expect(mockRecordShow).not.toHaveBeenCalled();
			expect(mockOnOpenChange).not.toHaveBeenCalled();
			expect(mockFireEvent).not.toHaveBeenCalled();
			expect(screen.queryByTestId('pre-auth-value-proposition-modal')).not.toBeInTheDocument();
		});

		it.each(['control', 'unknown'])(
			'exposes %s at offer then declines without consuming the slot',
			async (variant) => {
				mockExp(experiment, { variant });
				renderModalHost();
				await waitFor(() => expect(mockOnFinished).toHaveBeenCalledTimes(1));
				expect(wasExperimentExposed(experiment)).toBe(true);
				expect(mockRecordShow).not.toHaveBeenCalled();
				expect(mockOnOpenChange).not.toHaveBeenCalled();
				expect(await other.plugin.startMessage('competing-nudge')).toBe('started');
			},
		);

		it('fails closed when the host adapter is unavailable', async () => {
			mockChoreographer = undefined;
			renderModalHost();
			await waitFor(() => expect(mockOnFinished).toHaveBeenCalledTimes(1));
			expect(wasExperimentExposed(experiment)).toBe(false);
			expect(mockRecordShow).not.toHaveBeenCalled();
		});

		it.each(['capped', 'unauthorized-without-auth', 'resolved', 'pending'] as const)(
			'does not request a slot for %s',
			async (reason) => {
				if (reason === 'capped') {
					mockHasReachedShowLimit.mockReturnValue(true);
				} else {
					const current = mockUseSmartLink('test', testUrl, 'inline');
					mockUseSmartLink.mockReturnValue({
						...current,
						...(reason === 'unauthorized-without-auth'
							? { config: { authFlow: 'disabled' as const } }
							: { state: { ...current.state, status: reason } }),
					});
				}
				const start = jest.spyOn(host.plugin, 'startMessage');
				renderModalHost();
				await act(async () => {});
				expect(start).not.toHaveBeenCalled();
				expect(wasExperimentExposed(experiment)).toBe(false);
				expect(mockRecordShow).not.toHaveBeenCalled();
				start.mockRestore();
			},
		);

		it.each(['cap', 'unmount', 'excluded-provider', 'unknown-provider'])(
			'does not expose a delayed offer after %s',
			async (change) => {
				let resolveFirst!: (value: boolean) => void;
				other.plugin.on('competing-nudge', {
					start: () =>
						new Promise<boolean>((resolve) => {
							resolveFirst = resolve;
						}),
				});
				const pending = other.plugin.startMessage('competing-nudge');
				const view = renderModalHost();
				await act(async () => {});
				expect(wasExperimentExposed(experiment)).toBe(false);
				if (change === 'cap') {
					mockHasReachedShowLimit.mockReturnValue(true);
				} else if (change === 'unmount') {
					view.unmount();
				} else {
					setProviderKey(change === 'excluded-provider' ? 'box-object-provider' : undefined);
					view.rerender(<ModalHost />);
				}
				await act(async () => {
					resolveFirst(false);
					await pending;
				});
				expect(wasExperimentExposed(experiment)).toBe(false);
				expect(mockRecordShow).not.toHaveBeenCalled();
				expect(screen.queryByTestId('pre-auth-value-proposition-modal')).not.toBeInTheDocument();
			},
		);

		it.each(['button', 'escape', 'overlay', 'connect'])(
			'counts an early %s interaction before entrance completion exactly once',
			async (action) => {
				mockExp(experiment, { variant: 'modal_text_only' });
				mockDeferOpenComplete = true;
				const user = userEvent.setup();
				renderModalHost();
				await screen.findByRole('heading', { name: 'Connect Google Drive' });
				const completeOpening = mockOpenComplete;
				expect(mockRecordShow).not.toHaveBeenCalled();
				expect(mockFireEvent).not.toHaveBeenCalledWith(
					'ui.modal.opened.preAuthValueProposition',
					{},
				);
				if (action === 'escape') {
					await user.keyboard('{Escape}');
				} else if (action === 'overlay') {
					await user.click(
						screen.getByTestId(
							fg('platform-dst-top-layer')
								? 'pre-auth-value-proposition-modal'
								: 'pre-auth-value-proposition-modal--blanket',
						),
					);
				} else {
					await user.click(
						screen.getByRole('button', {
							name: action === 'connect' ? 'Connect Google Drive' : 'Close',
						}),
					);
				}
				expect(mockOnFinished).toHaveBeenCalledTimes(1);
				expect(mockRecordShow).toHaveBeenCalledTimes(1);
				expect(mockRecordShow).toHaveBeenCalledWith('google-object-provider');
				act(() => completeOpening?.(document.body, true));
				expect(mockRecordShow).toHaveBeenCalledTimes(1);
				await act(async () => {});
				expect(await other.plugin.startMessage('competing-nudge')).toBe('started');
			},
		);

		it.each(['button', 'escape', 'overlay', 'connect'])(
			'releases the slot on %s without coordinator double-counting',
			async (action) => {
				mockExp(experiment, { variant: 'modal_text_only' });
				const user = userEvent.setup();
				renderModalHost();
				await screen.findByRole('heading', { name: 'Connect Google Drive' });
				await waitFor(() => expect(mockRecordShow).toHaveBeenCalledTimes(1));
				if (action === 'button') {
					await user.click(screen.getByRole('button', { name: 'Close' }));
				} else if (action === 'escape') {
					await user.keyboard('{Escape}');
				} else if (action === 'connect') {
					await user.click(screen.getByRole('button', { name: 'Connect Google Drive' }));
				} else {
					await user.click(
						screen.getByTestId(
							fg('platform-dst-top-layer')
								? 'pre-auth-value-proposition-modal'
								: 'pre-auth-value-proposition-modal--blanket',
						),
					);
				}
				await waitFor(() => expect(mockOnFinished).toHaveBeenCalledTimes(1));
				await act(async () => {});
				expect(await other.plugin.startMessage('competing-nudge')).toBe('started');
				expect(mockFireEvent).not.toHaveBeenCalledWith(
					'ui.modal.closed.preAuthValueProposition',
					expect.objectContaining({ closeMethod: 'coordinator' }),
				);
				if (action === 'connect') {
					expect(mockAuthorize).toHaveBeenCalledTimes(1);
					expect(mockAuthorize).toHaveBeenCalledWith('inline');
				} else {
					expect(mockFireEvent).toHaveBeenCalledWith(
						'ui.modal.closed.preAuthValueProposition',
						expect.objectContaining({ closeMethod: action }),
					);
				}
			},
		);

		it('closes on host withdrawal with a coordinator reason', async () => {
			mockExp(experiment, { variant: 'modal_text_only' });
			const start = jest.spyOn(host.plugin, 'startMessage');
			renderModalHost();
			await waitFor(() => expect(mockRecordShow).toHaveBeenCalledTimes(1));
			await act(async () => {
				await host.plugin.stopMessage(start.mock.calls[0][0]);
			});
			expect(screen.queryByTestId('pre-auth-value-proposition-modal')).not.toBeInTheDocument();
			expect(mockFireEvent).toHaveBeenCalledWith(
				'ui.modal.closed.preAuthValueProposition',
				expect.objectContaining({ closeMethod: 'coordinator' }),
			);
			expect(mockOnFinished).toHaveBeenCalledTimes(1);
			expect(mockOnOpenChange).toHaveBeenLastCalledWith(false);
			start.mockRestore();
		});
	});
});
