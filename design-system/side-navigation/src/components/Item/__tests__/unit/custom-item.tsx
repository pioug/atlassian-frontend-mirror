import React from 'react';

import { render, screen } from '@testing-library/react';

import CustomItem, { type CustomItemComponentProps } from '../../custom-item';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<CustomItem />', () => {
	it('should pass through extra props to the component', () => {
		const Link = ({ children, ...props }: CustomItemComponentProps & { href: string }) => (
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props, @atlaskit/design-system/no-html-anchor
			<a {...props}>{children}</a>
		);

		render(
			<CustomItem href="/my-details" component={Link} testId="target">
				Hello world
			</CustomItem>,
		);

		expect(screen.getByTestId('target')).toHaveAttribute('href', '/my-details');
	});
});
