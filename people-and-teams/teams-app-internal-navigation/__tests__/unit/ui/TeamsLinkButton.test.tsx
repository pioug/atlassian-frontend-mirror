import React from 'react';

import { render, screen } from '@atlassian/testing-library';

import { TeamsLinkButton } from '../../../src/ui/TeamsLinkButton';
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
		<TeamsLinkButton href="https://external.example.com" intent="external">
			Link Button
		</TeamsLinkButton>,
	);
	const link = screen.getByRole('link', { name: /Link Button/ });
	expect(link).toHaveAttribute('target', '_blank');
	await expect(link).toBeAccessible();
});

test.each([
	['navigation', 'navigation'],
	['reference', 'reference'],
] as const)('renders target="_self" for %s intent', (_, intent) => {
	renderWithProvider(
		<TeamsLinkButton href={TEAMS_APP_HREF} intent={intent}>
			Link Button
		</TeamsLinkButton>,
	);
	const link = screen.getByRole('link', { name: /Link Button/ });
	expect(link).toHaveAttribute('target', '_self');
});

test('renders target="_blank" for any intent when forceExternalIntent is true', () => {
	renderWithProvider(
		<TeamsLinkButton href="https://home.atlassian.com/people/123" intent="navigation">
			Link Button
		</TeamsLinkButton>,
		{ forceExternalIntent: true },
	);
	const link = screen.getByRole('link', { name: /Link Button/ });
	expect(link).toHaveAttribute('target', '_blank');
});

test('renders without a TeamsNavigationProvider', () => {
	render(
		<TeamsLinkButton href="https://home.atlassian.com/people/123" intent="navigation">
			Link Button
		</TeamsLinkButton>,
	);
	expect(screen.getByRole('link', { name: /Link Button/ })).toHaveAttribute('target', '_self');
});
