import React from 'react';

import FeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';
import { renderWithIntl } from '@atlaskit/link-test-helpers/react-testing-library';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act } from '@atlassian/testing-library/act';
import { screen } from '@atlassian/testing-library/screen';

import UnauthorizedView from '../index';

// Mock heavy sub-trees — we only care which top-level view renders
jest.mock('../../../../../state/hooks/use-rovo-config', () => ({
	__esModule: true,
	default: jest
		.fn()
		.mockReturnValue({ rovoOptions: { isRovoEnabled: false, isRovoLLMEnabled: false } }),
}));

const mockFireEvent = jest.fn();
jest.mock('../../../../../common/analytics/generated/use-analytics-events', () => ({
	useAnalyticsEvents: () => ({ fireEvent: mockFireEvent }),
}));

jest.mock('../../../components/ImageIcon', () => ({
	ImageIcon: ({ alt = '', src }: { alt?: string; src?: string }) => (
		<img alt={alt} src={src} data-testid="embed-frame-image-icon" />
	),
}));

const defaultProps: React.ComponentProps<typeof UnauthorizedView> = {
	url: 'https://example.com/private-page',
	context: {
		text: 'Figma',
		icon: undefined,
		image: undefined,
	},
	onAuthorize: jest.fn(),
};

const dualIconProps: React.ComponentProps<typeof UnauthorizedView> = {
	...defaultProps,
	context: {
		...defaultProps.context!,
		icon: <span data-testid="entity-icon" />,
		iconLabel: 'document',
		providerIcon: <span data-testid="provider-icon" />,
		providerIconLabel: 'Figma',
	},
};

describe('UnauthorizedViewGated', () => {
	let initializeSpy: jest.SpyInstance;
	let experimentSpy: jest.SpyInstance;

	beforeEach(() => {
		initializeSpy = jest.spyOn(FeatureGates, 'initializeCompleted').mockReturnValue(true);
		experimentSpy = jest.spyOn(FeatureGates, 'getExperimentValue').mockReturnValue(false);
		mockFireEvent.mockClear();
	});

	afterEach(() => {
		initializeSpy.mockRestore();
		experimentSpy.mockRestore();
	});

	describe('experiment gate OFF (isEnabled = false)', () => {
		it('renders the legacy UnauthorizedView when experiment is off', () => {
			renderWithIntl(<UnauthorizedView {...defaultProps} />);
			// Legacy view renders an unresolved-view structure, not a carousel
			expect(screen.queryByTestId('embed-card-unauthorized-view-carousel')).not.toBeInTheDocument();
		});

		it('renders the legacy icon in the embed frame header when the provider gate is off', () => {
			failGate('platform_lp_use_generator_icon_for_provider');

			renderWithIntl(<UnauthorizedView {...dualIconProps} />);

			expect(screen.getByTestId('entity-icon')).toBeInTheDocument();
			expect(screen.queryByTestId('provider-icon')).not.toBeInTheDocument();
		});

		it('renders the provider icon in the embed frame header when the provider gate is on', () => {
			passGate('platform_lp_use_generator_icon_for_provider');

			renderWithIntl(<UnauthorizedView {...dualIconProps} />);

			expect(screen.getByTestId('provider-icon')).toBeInTheDocument();
			expect(screen.queryByTestId('entity-icon')).not.toBeInTheDocument();
		});

		it('applies the provider icon label when the provider gate is on', () => {
			passGate('platform_lp_use_generator_icon_for_provider');

			renderWithIntl(
				<UnauthorizedView
					{...defaultProps}
					context={{
						...defaultProps.context!,
						icon: 'https://example.com/entity.png',
						iconLabel: 'document',
						providerIcon: 'https://example.com/provider.png',
						providerIconLabel: 'Figma',
					}}
				/>,
			);

			expect(screen.getByRole('img', { name: 'Figma' })).toHaveAttribute(
				'src',
				'https://example.com/provider.png',
			);
		});
	});

	describe('experiment gate ON (isEnabled = true)', () => {
		beforeEach(() => {
			experimentSpy.mockReturnValue(true);
		});

		it('renders the UnauthorizedCarouselView when experiment is on', () => {
			renderWithIntl(<UnauthorizedView {...defaultProps} />);
			expect(screen.getByTestId('embed-card-unauthorized-view-carousel')).toBeInTheDocument();
		});

		it('passes context text as the icon label to the carousel', () => {
			renderWithIntl(<UnauthorizedView {...defaultProps} />);
			const carousel = screen.getByTestId('embed-card-unauthorized-view-carousel');
			expect(carousel).toBeInTheDocument();
		});

		it('renders without a connect button when onAuthorize is not provided', () => {
			const { onAuthorize: _, ...propsWithoutAuthorize } = defaultProps;
			renderWithIntl(<UnauthorizedView {...propsWithoutAuthorize} />);
			expect(
				screen.queryByTestId('embed-card-unauthorized-view-carousel-slide-connect'),
			).not.toBeInTheDocument();
		});

		describe('analytics events', () => {
			const useRovoConfig = require('../../../../../state/hooks/use-rovo-config').default;
			beforeEach(() => {
				experimentSpy.mockReturnValue(true);
				// Enable Rovo so all 3 slides are present (Next button renders on non-last slides)
				useRovoConfig.mockReturnValue({
					rovoOptions: { isRovoEnabled: true, isRovoLLMEnabled: true },
					product: undefined,
				});
			});

			it('fires carouselConnect event with display and slideId when connect button is clicked', () => {
				renderWithIntl(<UnauthorizedView {...defaultProps} />);
				screen.getByTestId('embed-card-unauthorized-view-carousel-slide-connect').click();
				expect(mockFireEvent).toHaveBeenCalledWith(
					'ui.button.clicked.carouselConnect',
					expect.objectContaining({
						display: 'embed',
						slideId: 'smart-link-benefit',
					}),
				);
			});

			it('fires carouselNext event with display and slideId when "See next" is clicked', () => {
				renderWithIntl(<UnauthorizedView {...defaultProps} />);
				screen.getByTestId('embed-card-unauthorized-view-carousel-slide-next').click();
				expect(mockFireEvent).toHaveBeenCalledWith(
					'ui.button.clicked.carouselNext',
					expect.objectContaining({
						display: 'embed',
						slideId: 'smart-link-benefit',
					}),
				);
			});

			it('fires carouselNext with rovo-search-benefit slideId when on slide 2', () => {
				renderWithIntl(<UnauthorizedView {...defaultProps} />);
				// Click Next on slide 1 — fires carouselNext with 'smart-link-benefit' and navigates to slide 2
				act(() => {
					screen.getByTestId('embed-card-unauthorized-view-carousel-slide-next').click();
				});
				expect(mockFireEvent).toHaveBeenCalledWith(
					'ui.button.clicked.carouselNext',
					expect.objectContaining({ slideId: 'smart-link-benefit' }),
				);
				mockFireEvent.mockClear();
				// Now on slide 2 (rovo-search-benefit), click Next — fires carouselNext with 'rovo-search-benefit'
				act(() => {
					screen.getByTestId('embed-card-unauthorized-view-carousel-slide-next').click();
				});
				expect(mockFireEvent).toHaveBeenCalledWith(
					'ui.button.clicked.carouselNext',
					expect.objectContaining({ slideId: 'rovo-search-benefit' }),
				);
			});
		});
	});
});
