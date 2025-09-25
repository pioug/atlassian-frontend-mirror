import React from 'react';

import { render, screen } from '@testing-library/react';

import { AgentMenuItemSkeleton } from './index';

describe('AgentMenuItemSkeleton', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<AgentMenuItemSkeleton index={0} />);
		await expect(container).toBeAccessible();
	});

	it('renders all skeleton elements with correct test IDs', () => {
		render(<AgentMenuItemSkeleton index={0} />);

		expect(screen.getByTestId('skeleton-container-0')).toBeInTheDocument();
		expect(screen.getByTestId('loading-agents-avatar-skeleton-0')).toBeInTheDocument();
		expect(screen.getByTestId('loading-agents-text-skeleton-0')).toBeInTheDocument();
	});

	it('renders container with correct styles', () => {
		render(<AgentMenuItemSkeleton index={0} />);

		const container = screen.getByTestId('skeleton-container-0');
		expect(container).toHaveStyle({
			display: 'flex',
			alignItems: 'center',
			gap: 'var(--ds-space-075,6px)',
			height: '32px',
			paddingLeft: 'var(--ds-space-075,6px)',
			paddingRight: 'var(--ds-space-075,6px)',
		});
	});
});
