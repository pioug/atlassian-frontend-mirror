import React from 'react';

import { render, screen } from '@atlassian/testing-library';

import { TeamsAnchor } from '../../../src/ui/TeamsAnchor';
import {
	TeamsNavigationProvider,
	useTeamsNavigationContext,
} from '../../../src/ui/TeamsNavigationProvider';
import { createMockContext } from '../test-utils';

function ContextEntryPointDisplay() {
	const { contextEntryPoint } = useTeamsNavigationContext();
	return <span data-testid="entry-point">{contextEntryPoint ?? ''}</span>;
}

test('should be accessible', async () => {
	const { container } = render(
		<TeamsNavigationProvider value={createMockContext({})}>
			<TeamsAnchor href="team/123" intent="navigation">
				Link
			</TeamsAnchor>
		</TeamsNavigationProvider>,
	);
	await expect(container).toBeAccessible();
});

describe('contextEntryPoint', () => {
	test('closest provider with a valid contextEntryPoint wins across arbitrary nesting', () => {
		render(
			<TeamsNavigationProvider value={createMockContext({ contextEntryPoint: 'a' })}>
				<TeamsNavigationProvider value={createMockContext({ contextEntryPoint: 'b' })}>
					<TeamsNavigationProvider value={createMockContext({ contextEntryPoint: 'c' })}>
						<TeamsNavigationProvider value={createMockContext({ contextEntryPoint: 'd' })}>
							<TeamsNavigationProvider value={createMockContext({ contextEntryPoint: 'e' })}>
								<ContextEntryPointDisplay />
							</TeamsNavigationProvider>
						</TeamsNavigationProvider>
					</TeamsNavigationProvider>
				</TeamsNavigationProvider>
			</TeamsNavigationProvider>,
		);
		expect(screen.getByTestId('entry-point')).toHaveTextContent('e');
	});

	test('child without contextEntryPoint inherits closest ancestor contextEntryPoint', () => {
		render(
			<TeamsNavigationProvider value={createMockContext({ contextEntryPoint: 'wiki' })}>
				<TeamsNavigationProvider value={createMockContext()}>
					<ContextEntryPointDisplay />
				</TeamsNavigationProvider>
			</TeamsNavigationProvider>,
		);
		expect(screen.getByTestId('entry-point')).toHaveTextContent('wiki');
	});

	test('parent without contextEntryPoint does not affect child', () => {
		render(
			<TeamsNavigationProvider value={createMockContext()}>
				<TeamsNavigationProvider value={createMockContext({ contextEntryPoint: 'people' })}>
					<ContextEntryPointDisplay />
				</TeamsNavigationProvider>
			</TeamsNavigationProvider>,
		);
		expect(screen.getByTestId('entry-point')).toHaveTextContent('people');
	});

	test('child without contextEntryPoint inherits from nearest ancestor that has one', () => {
		render(
			<TeamsNavigationProvider value={createMockContext({ contextEntryPoint: 'wiki' })}>
				<TeamsNavigationProvider value={createMockContext({ contextEntryPoint: 'people' })}>
					<TeamsNavigationProvider value={createMockContext()}>
						<ContextEntryPointDisplay />
					</TeamsNavigationProvider>
				</TeamsNavigationProvider>
			</TeamsNavigationProvider>,
		);
		expect(screen.getByTestId('entry-point')).toHaveTextContent('people');
	});

	test('nested providers use closest contextEntryPoint for href prefixing', () => {
		render(
			<TeamsNavigationProvider value={createMockContext({ contextEntryPoint: 'wiki' })}>
				<TeamsNavigationProvider value={createMockContext({ contextEntryPoint: 'people' })}>
					<TeamsAnchor href="team/123" intent="navigation">
						Link
					</TeamsAnchor>
				</TeamsNavigationProvider>
			</TeamsNavigationProvider>,
		);
		const link = screen.getByRole('link', { name: /Link/ });
		expect(link).toHaveAttribute('href', 'people/team/123');
	});
});
