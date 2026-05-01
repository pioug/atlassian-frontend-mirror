import React from 'react';

import { render, screen } from '@testing-library/react';

import { ConditionalSpotlightTargetWrapper } from './index';

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
