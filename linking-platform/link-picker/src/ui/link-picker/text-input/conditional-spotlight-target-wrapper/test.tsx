import React from 'react';

import { render, screen } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { ConditionalSpotlightTargetWrapper } from './index';

jest.mock('@atlaskit/onboarding', () => ({
	SpotlightTarget: ({ children }: { children: React.ReactElement }) => {
		return <>wrapped children: {children}</>;
	},
}));

jest.mock('@atlaskit/spotlight', () => ({
	PopoverProvider: ({ children }: { children: React.ReactElement }) => <>{children}</>,
	PopoverTarget: ({ children }: { children: React.ReactElement }) => (
		<>spotlight wrapped children: {children}</>
	),
}));

describe('ConditionalSpotlightTargetWrapper', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<ConditionalSpotlightTargetWrapper spotlightTargetName="some-spotlight-target">
				<>some child</>
			</ConditionalSpotlightTargetWrapper>,
		);

		await expect(container).toBeAccessible();
	});

	describe('when navx-4548-migrate-to-atlaskit-spotlight feature flag is disabled', () => {
		ffTest.off('navx-4548-migrate-to-atlaskit-spotlight', '', () => {
			it('should wrap children with a SpotlightTarget from @atlaskit/onboarding when a `spotlightTargetName` prop is set', () => {
				render(
					<ConditionalSpotlightTargetWrapper spotlightTargetName="some-spotlight-target">
						<>some child</>
					</ConditionalSpotlightTargetWrapper>,
				);
				expect(screen.getByText('wrapped children: some child')).toBeDefined();
				expect(screen.queryByText('spotlight wrapped children: some child')).toBeNull();
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
	});

	describe('when navx-4548-migrate-to-atlaskit-spotlight feature flag is enabled', () => {
		ffTest.on('navx-4548-migrate-to-atlaskit-spotlight', '', () => {
			it('should wrap children with a PopoverTarget from @atlaskit/spotlight when a `spotlightTargetName` prop is set', () => {
				render(
					<ConditionalSpotlightTargetWrapper spotlightTargetName="some-spotlight-target">
						<>some child</>
					</ConditionalSpotlightTargetWrapper>,
				);
				expect(screen.getByText('spotlight wrapped children: some child')).toBeDefined();
				expect(screen.queryByText('wrapped children: some child')).toBeNull();
			});

			it('should not wrap children with a PopoverTarget when a `spotlightTargetName` prop is not set', () => {
				render(
					<ConditionalSpotlightTargetWrapper>
						<>some child</>
					</ConditionalSpotlightTargetWrapper>,
				);
				expect(screen.getByText('some child')).toBeDefined();
				expect(screen.queryByText('spotlight wrapped children: some child')).toBeNull();
			});
		});
	});
});
