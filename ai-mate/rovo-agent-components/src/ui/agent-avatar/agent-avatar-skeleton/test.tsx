import React from 'react';

import { render, screen } from '@testing-library/react';

import { AgentAvatarSkeleton } from './index';

describe('AgentAvatarSkeleton', () => {
	it('should render with basic props', () => {
		render(<AgentAvatarSkeleton size="small" testId="avatar-skeleton" />);

		const container = screen.getByTestId('avatar-skeleton-wrapper');
		const skeleton = screen.getByTestId('avatar-skeleton');

		expect(container).toBeInTheDocument();
		expect(skeleton).toBeInTheDocument();

		// correct dimensions for small size (24px)
		expect(container).toHaveStyle({
			width: '24px',
			height: '24px',
		});

		const clipPath = container.style.clipPath;
		expect(clipPath).toContain('polygon');
		// First point of hexagon
		expect(clipPath).toContain('45% 1.33975%');

		expect(skeleton).toHaveStyle({
			width: '100%',
			height: '100%',
		});
	});
});
