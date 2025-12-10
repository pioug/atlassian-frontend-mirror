import React from 'react';

import { render, screen } from '@testing-library/react';

import { withFeatureFlaggedComponent } from './with-feature-flagged-component';

// Mock Components
const ComponentOld = () => <div data-testid="component-old">Component Old</div>;
const ComponentNext = () => <div data-testid="component-next">Component Next</div>;

describe('withFeatureFlag HOC', () => {
	it('renders ComponentA when featureFlag is true', async () => {
		const FeatureFlaggedComponent = withFeatureFlaggedComponent(
			ComponentOld,
			ComponentNext,
			() => true,
		);
		render(<FeatureFlaggedComponent />);
		expect(screen.getByTestId('component-next')).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	it('renders ComponentB when featureFlag is false', async () => {
		const FeatureFlaggedComponent = withFeatureFlaggedComponent(
			ComponentOld,
			ComponentNext,
			() => false,
		);
		render(<FeatureFlaggedComponent />);
		expect(screen.getByTestId('component-old')).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});
});
