import React from 'react';

import { IntlProvider } from 'react-intl';

import { mockExp } from '@atlassian/experiment-test-utils/mock-exp';
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

jest.mock('@atlaskit/link-extractors/extract-smart-link-provider', () => ({
	extractSmartLinkProvider: () => ({
		icon: 'https://example.com/google-drive-icon.png',
		text: 'Google Drive',
	}),
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

const renderModalHost = () =>
	render(
		<IntlProvider locale="en">
			<PreAuthValuePropositionModal
				url={testUrl}
				onFinished={mockOnFinished}
				onOpenChange={mockOnOpenChange}
			/>
		</IntlProvider>,
	);

describe('PreAuthValuePropositionModal', () => {
	beforeEach(() => {
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

	it('renders generic content with the backend provider name for an eligible link', async () => {
		mockExp('platform_sl_3p_preauth_value_modal', { variant: 'modal_text_only' });
		renderModalHost();

		expect(
			await screen.findByRole('heading', { name: 'Connect Google Drive' }),
		).toBeInTheDocument();
		const connectButton = screen.getByRole('button', { name: 'Connect Google Drive' });
		expect(connectButton).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
		expect(
			screen.getByText(/Rovo answers grounded in your Google Drive content/),
		).toBeInTheDocument();
		expect(
			screen.getByText(/across Google Drive and Atlassian content in one place/),
		).toBeInTheDocument();
		const embedBenefit = screen.getByText(/richer link previews without leaving your workflow/);
		expect(embedBenefit).toBeInTheDocument();
		expect(
			screen.getByTestId('pre-auth-value-proposition-modal-provider-icon-image'),
		).toHaveAttribute('src', 'https://example.com/google-drive-icon.png');
		const socialProof = screen.getByTestId('pre-auth-value-proposition-modal-social-proof');
		expect(socialProof).toHaveTextContent('45% of your team sees Google Drive previews');
		expect(socialProof.tagName).toBe('P');
		expect(
			embedBenefit.compareDocumentPosition(socialProof) & Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
		expect(
			socialProof.compareDocumentPosition(connectButton) & Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
		expect(
			screen.queryByTestId('pre-auth-value-proposition-modal-illustration'),
		).not.toBeInTheDocument();
		expect(mockRecordShow).toHaveBeenCalledWith('google-object-provider');
		await waitFor(() => {
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
		expect(
			screen.getByText(/Rovo answers grounded in your Google Drive content/),
		).toBeInTheDocument();
		expect(
			await screen.findByTestId('pre-auth-value-proposition-modal-illustration'),
		).toBeInTheDocument();
		expect(
			screen.getAllByTestId('pre-auth-value-proposition-modal-illustration-icon-image'),
		).toHaveLength(4);
		expect(mockRecordShow).toHaveBeenCalledWith('google-object-provider');
		await waitFor(() => {
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

		const socialProof = await screen.findByTestId('pre-auth-value-proposition-modal-social-proof');
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

		await user.click(await screen.findByTestId('pre-auth-value-proposition-modal--blanket'));

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
		expect(mockOnFinished).toHaveBeenCalledTimes(1);
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
