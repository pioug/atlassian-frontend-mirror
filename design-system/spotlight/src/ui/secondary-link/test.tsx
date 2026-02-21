import React from 'react';

import { render, screen } from '@testing-library/react';

import { SpotlightSecondaryLink } from './index';

const testId = 'spotlight-secondary-link';

describe('SpotlightSecondaryLink', () => {
	it('captures and report a11y violations', async () => {
		const ref = React.createRef<HTMLAnchorElement>();
		const { container } = render(
			<SpotlightSecondaryLink ref={ref} href="/help" aria-label="Learn more" testId={testId}>
				Learn more
			</SpotlightSecondaryLink>,
		);

		await expect(container).toBeAccessible();
		await expect(ref.current).toHaveAttribute('aria-label', 'Learn more');
	});

	it('finds link by its testid', () => {
		render(
			<SpotlightSecondaryLink href="/help" testId={testId}>
				Learn more
			</SpotlightSecondaryLink>,
		);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLAnchorElement>();
		render(
			<SpotlightSecondaryLink ref={ref} href="/docs">
				View docs
			</SpotlightSecondaryLink>,
		);
		expect(ref.current).toBeDefined();
		expect(ref.current?.tagName).toBe('A');
		expect(ref.current?.getAttribute('href')).toBe('/docs');
		expect(ref.current?.textContent).toEqual('View docs');
	});

	it('renders as an anchor with href, target, and rel', () => {
		render(
			<SpotlightSecondaryLink
				href="https://atlassian.com"
				target="_blank"
				rel="noopener noreferrer"
				testId={testId}
			>
				Open
			</SpotlightSecondaryLink>,
		);
		const link = screen.getByTestId(testId);
		expect(link.tagName).toBe('A');
		expect(link).toHaveAttribute('href', 'https://atlassian.com');
		expect(link).toHaveAttribute('target', '_blank');
		expect(link).toHaveAttribute('rel', 'noopener noreferrer');
	});
});
