import React from 'react';

import { render, screen } from '@atlassian/testing-library';

import { TeamsLinkItem } from '../../../src/ui/TeamsLinkItem';
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

test('renders target="_blank" and rel="noopener noreferrer" for external intent', async () => {
	renderWithProvider(
		<TeamsLinkItem href="https://external.example.com" intent="external">
			Link Item
		</TeamsLinkItem>,
	);
	const link = screen.getByRole('link', { name: /Link Item/ });
	expect(link).toHaveAttribute('target', '_blank');
	expect(link).toHaveAttribute('rel', 'noopener noreferrer');
	await expect(link).toBeAccessible();
});

test.each([
	['navigation', 'navigation'],
	['reference', 'reference'],
] as const)('renders target="_self" and no rel for %s intent', (_, intent) => {
	renderWithProvider(
		<TeamsLinkItem href={TEAMS_APP_HREF} intent={intent}>
			Link Item
		</TeamsLinkItem>,
	);
	const link = screen.getByRole('link', { name: /Link Item/ });
	expect(link).toHaveAttribute('target', '_self');
	expect(link).not.toHaveAttribute('rel');
});

test('renders target="_blank" and rel="noopener noreferrer" for any intent when forceExternalIntent is true', () => {
	renderWithProvider(
		<TeamsLinkItem href="https://home.atlassian.com/people/123" intent="navigation">
			Link Item
		</TeamsLinkItem>,
		{ forceExternalIntent: true },
	);
	const link = screen.getByRole('link', { name: /Link Item/ });
	expect(link).toHaveAttribute('target', '_blank');
	expect(link).toHaveAttribute('rel', 'noopener noreferrer');
});

test('throws when rendered outside a TeamsNavigationProvider', () => {
	const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
	expect(() =>
		render(
			<TeamsLinkItem href="https://home.atlassian.com/people/123" intent="navigation">
				Link Item
			</TeamsLinkItem>,
		),
	).toThrow('useTeamsNavigationContext must be used within a TeamsNavigationProvider');
	consoleSpy.mockRestore();
});
