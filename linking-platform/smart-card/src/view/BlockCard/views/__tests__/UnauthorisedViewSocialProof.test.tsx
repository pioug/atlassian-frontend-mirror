/**
 * TODO: remove when social-proof-3p-unauth-block-fg is cleaned up
 */
import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import type { CardState } from '@atlaskit/linking-common/store';
import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { waitFor } from '@atlassian/testing-library/testing-library/react';

// Mock the hook — all experiment logic is tested in the hook's own test file.
const mockUseSocialProofExperiment = jest.fn();
const mockGetSocialProofExperimentMeta = jest.fn();
jest.mock('../../../../state/hooks/use-social-proof-experiment', () => ({
	__esModule: true,
	default: (...args: unknown[]) => mockUseSocialProofExperiment(...args),
	getSocialProofExperimentMeta: (...args: unknown[]) => mockGetSocialProofExperimentMeta(...args),
}));

import type { SocialProofExperiment } from '../../../../state/hooks/use-social-proof-experiment';
import { mocks } from '../../../../utils/mocks';
import UnauthorisedView from '../UnauthorisedView';

const defaultHookResult: SocialProofExperiment = {
	isTreatment: false,
	tier: 'low',
	connectedPct: undefined,
	isLoading: false,
};

describe('UnauthorisedView social proof experiment', () => {
	const url = 'https://some.url';
	const descriptionTestId = 'smart-block-unauthorized-view-content';

	const cardStateWithProviderKey = (): CardState =>
		({
			status: 'unauthorized',
			details: {
				...mocks.unauthorized,
				meta: {
					...mocks.unauthorized.meta,
					tenantId: 'test-tenant',
					key: '3P',
				},
				data: {
					...mocks.unauthorized.data,
					generator: {
						'@type': 'Application',
						icon: { '@type': 'Image', url: 'https://some.icon.url' },
						name: '3P',
					},
				},
			},
		}) as CardState;

	const renderComponent = (props?: Partial<React.ComponentProps<typeof UnauthorisedView>>) =>
		renderWithIntl(
			<SmartCardProvider>
				<UnauthorisedView
					cardState={cardStateWithProviderKey()}
					onAuthorize={() => {}}
					url={url}
					{...props}
				/>
			</SmartCardProvider>,
		);

	beforeEach(() => {
		mockUseSocialProofExperiment.mockReturnValue(defaultHookResult);
		mockGetSocialProofExperimentMeta.mockReturnValue({
			social_proof_3p_unauth_block_exp: { isEligible: false },
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('social-proof-3p-unauth-block-fg is off FG off', () => {
		it('renders default content without social proof', async () => {
			failGate('social-proof-3p-unauth-block-fg');

			renderComponent();

			const description = await screen.findByTestId(descriptionTestId);
			expect(description).toHaveTextContent(/Turn your URLs into rich, interactive previews\./i);
			expect(screen.queryByTestId('smart-block-social-proof-message')).not.toBeInTheDocument();
			expect(mockUseSocialProofExperiment).not.toHaveBeenCalled();
			expect(mockGetSocialProofExperimentMeta).not.toHaveBeenCalled();
		});
	});

	describe('social-proof-3p-unauth-block-fg is on FG on', () => {
		it('renders social proof message for treatment with not-low tier', async () => {
			passGate('social-proof-3p-unauth-block-fg');

			mockUseSocialProofExperiment.mockReturnValue({
				isTreatment: true,
				tier: 'not-low',
				connectedPct: 45,
				isLoading: false,
			} satisfies SocialProofExperiment);

			renderComponent();

			await waitFor(() => {
				const socialProofEl = screen.getByTestId('smart-block-social-proof-message');
				expect(socialProofEl).toHaveTextContent(/45%/);
			});

			const socialProofEl = screen.getByTestId('smart-block-social-proof-message');
			expect(socialProofEl).toHaveTextContent(/3P/);
		});

		it('renders default content when hook returns isTreatment=false (cold cache)', async () => {
			passGate('social-proof-3p-unauth-block-fg');

			mockUseSocialProofExperiment.mockReturnValue(defaultHookResult);

			renderComponent();

			const description = await screen.findByTestId(descriptionTestId);
			expect(description).toHaveTextContent(/Turn your URLs into rich, interactive previews\./i);
			expect(screen.queryByTestId('smart-block-social-proof-message')).not.toBeInTheDocument();
		});

		it('renders default content when hook returns isTreatment=false (experiment off)', async () => {
			passGate('social-proof-3p-unauth-block-fg');

			mockUseSocialProofExperiment.mockReturnValue({
				isTreatment: false,
				tier: 'not-low',
				connectedPct: 45,
				isLoading: false,
			} satisfies SocialProofExperiment);

			renderComponent();

			const description = await screen.findByTestId(descriptionTestId);
			expect(description).toHaveTextContent(/Turn your URLs into rich, interactive previews\./i);
			expect(screen.queryByTestId('smart-block-social-proof-message')).not.toBeInTheDocument();
		});
	});
});
