import React from 'react';

import { render, screen } from '@atlassian/testing-library';

import { TeamsLink } from '../../../src/ui/TeamsLink';
import { TeamsNavigationProvider } from '../../../src/ui/TeamsNavigationProvider';
import { createMockContext } from '../test-utils';

function renderWithProvider(
	ui: React.ReactElement,
	contextOverrides: Parameters<typeof createMockContext>[0] = {},
) {
	const context = createMockContext(contextOverrides);
	return render(<TeamsNavigationProvider value={context}>{ui}</TeamsNavigationProvider>);
}

const TEAMS_APP_HREF = 'https://home.atlassian.com/o/test-org-id/people/123';

test('renders target="_blank" for external intent', async () => {
	renderWithProvider(
		<TeamsLink href="https://external.example.com" intent="external">
			Link
		</TeamsLink>,
	);
	const link = screen.getByRole('link', { name: /Link/ });
	expect(link).toHaveAttribute('target', '_blank');
	await expect(link).toBeAccessible();
});

test.each([
	['navigation', 'navigation'],
	['reference', 'reference'],
] as const)('renders target="_self" for %s intent', (_, intent) => {
	renderWithProvider(
		<TeamsLink href={TEAMS_APP_HREF} intent={intent}>
			Link
		</TeamsLink>,
	);
	const link = screen.getByRole('link', { name: /Link/ });
	expect(link).toHaveAttribute('target', '_self');
});

test('renders target="_blank" for any intent when forceExternalIntent is true', () => {
	renderWithProvider(
		<TeamsLink href="https://home.atlassian.com/people/123" intent="navigation">
			Link
		</TeamsLink>,
		{ forceExternalIntent: true },
	);
	const link = screen.getByRole('link', { name: /Link/ });
	expect(link).toHaveAttribute('target', '_blank');
});

test('throws when rendered outside a TeamsNavigationProvider', () => {
	const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
	expect(() =>
		render(
			<TeamsLink href="https://home.atlassian.com/people/123" intent="navigation">
				Link
			</TeamsLink>,
		),
	).toThrow('useTeamsNavigationContext must be used within a TeamsNavigationProvider');
	consoleSpy.mockRestore();
});
