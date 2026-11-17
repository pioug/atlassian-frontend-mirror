import React from 'react';

import { renderWithIntl } from '@atlaskit/link-test-helpers/react-testing-library';
import { screen } from '@atlassian/testing-library/screen';

import UnauthorizedView from '../index';

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

describe('UnauthorizedView', () => {
	it('renders the standard unauthorized view', () => {
		renderWithIntl(<UnauthorizedView {...defaultProps} />);
		expect(screen.queryByTestId('embed-card-unauthorized-view-carousel')).not.toBeInTheDocument();
	});

	it('renders the provider icon in the embed frame header', () => {
		renderWithIntl(<UnauthorizedView {...dualIconProps} />);

		expect(screen.getByTestId('provider-icon')).toBeInTheDocument();
		expect(screen.queryByTestId('entity-icon')).not.toBeInTheDocument();
	});

	it('applies the provider icon label', () => {
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
