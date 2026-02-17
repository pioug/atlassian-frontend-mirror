import React from 'react';

import { render, screen } from '@testing-library/react';

import { SpotlightPrimaryLink } from './index';

const testId = 'spotlight-primary-link';

describe('SpotlightPrimaryLink', () => {
	it('captures and report a11y violations', async () => {
		const ref = React.createRef<HTMLAnchorElement>();
		const { container } = render(
			<SpotlightPrimaryLink
				ref={ref}
				href="/get-started"
				aria-label="Get started"
				testId={testId}
			>
				Get started
			</SpotlightPrimaryLink>,
		);

		await expect(container).toBeAccessible();
		await expect(ref.current).toHaveAttribute('aria-label', 'Get started');
	});

	it('finds link by its testid', () => {
		render(
			<SpotlightPrimaryLink href="/get-started" testId={testId}>
				Get started
			</SpotlightPrimaryLink>,
		);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLAnchorElement>();
		render(
			<SpotlightPrimaryLink ref={ref} href="/guide">
				View guide
			</SpotlightPrimaryLink>,
		);
		expect(ref.current).toBeDefined();
		expect(ref.current?.tagName).toBe('A');
		expect(ref.current?.getAttribute('href')).toBe('/guide');
		expect(ref.current?.textContent).toEqual('View guide');
	});

	it('renders as an anchor with href, target, and rel', () => {
		render(
			<SpotlightPrimaryLink
				href="https://atlassian.com"
				target="_blank"
				rel="noopener noreferrer"
				testId={testId}
			>
				Open
			</SpotlightPrimaryLink>,
		);
		const link = screen.getByTestId(testId);
		expect(link.tagName).toBe('A');
		expect(link).toHaveAttribute('href', 'https://atlassian.com');
		expect(link).toHaveAttribute('target', '_blank');
		expect(link).toHaveAttribute('rel', 'noopener noreferrer');
	});
});
