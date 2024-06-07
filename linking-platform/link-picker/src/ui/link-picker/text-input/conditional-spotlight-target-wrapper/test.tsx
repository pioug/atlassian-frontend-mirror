import React from 'react';

import { render, screen } from '@testing-library/react';

import { ConditionalSpotlightTargetWrapper } from './index';

jest.mock('@atlaskit/onboarding', () => ({
	SpotlightTarget: ({ children }: { children: React.ReactElement }) => {
		return <>wrapped children: {children}</>;
	},
}));
describe('ConditionalSpotlightTargetWrapper', () => {
	it('should wrap children with a SpotlightTarget when a `spotlightTargetName` prop is set', () => {
		render(
			<ConditionalSpotlightTargetWrapper spotlightTargetName="some-spotlight-target">
				<>some child</>
			</ConditionalSpotlightTargetWrapper>,
		);
		expect(screen.getByText('wrapped children: some child')).toBeDefined();
	});

	it('should not wrap children with a SpotlightTarget when a `spotlightTargetName` prop is not set', () => {
		render(
			<ConditionalSpotlightTargetWrapper>
				<>some child</>
			</ConditionalSpotlightTargetWrapper>,
		);
		expect(screen.getByText('some child')).toBeDefined();
		expect(screen.queryByText('wrapped children: some child')).toBeNull();
	});
});
