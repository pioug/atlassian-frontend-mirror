import React from 'react';

import { render, screen } from '@testing-library/react';

import { Banner } from '../../banner';

it('should set the height to the default value if height is not provided', () => {
	render(<Banner>banner</Banner>);

	expect(screen.getByText('banner')).toHaveTextContent(
		'#unsafe-design-system-page-layout-root { --n_bnrM: 48px }',
	);
});

it('should set the height to the provided value', () => {
	render(<Banner height={122}>banner</Banner>);

	expect(screen.getByText('banner')).toHaveTextContent(
		'#unsafe-design-system-page-layout-root { --n_bnrM: 122px }',
	);
});

// The top bar uses `<header>` which implicitly has `role="banner"`
// Each page should only have one `banner` role
// Top bar is more suitable for this role
it('should not have role="banner"', () => {
	render(<Banner testId="banner">banner</Banner>);

	expect(screen.getByTestId('banner')).toHaveTextContent('banner');
	expect(screen.queryByRole('banner')).not.toBeInTheDocument();
});
