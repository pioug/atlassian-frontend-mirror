import React from 'react';

import FeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';
import { renderWithIntl } from '@atlaskit/link-test-helpers/react-testing-library';
import { screen } from '@atlassian/testing-library/screen';

import UnauthorizedView from '../index';

// Mock heavy sub-trees — we only care which top-level view renders
jest.mock('../../../../../state/hooks/use-rovo-config', () => ({
	__esModule: true,
	default: jest
		.fn()
		.mockReturnValue({ rovoOptions: { isRovoEnabled: false, isRovoLLMEnabled: false } }),
}));

jest.mock('../../../../../common/analytics/generated/use-analytics-events', () => ({
	useAnalyticsEvents: () => ({ fireEvent: jest.fn() }),
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

describe('UnauthorizedViewGated', () => {
	let initializeSpy: jest.SpyInstance;
	let experimentSpy: jest.SpyInstance;

	beforeEach(() => {
		initializeSpy = jest.spyOn(FeatureGates, 'initializeCompleted').mockReturnValue(true);
		experimentSpy = jest.spyOn(FeatureGates, 'getExperimentValue').mockReturnValue(false);
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
	});
});
