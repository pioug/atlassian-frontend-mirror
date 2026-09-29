import React from 'react';

import { render, screen } from '@atlassian/testing-library';

import RemovableTag from '../../internal/removable';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<RemovableTag />', () => {
	describe('removal indicator', () => {
		it('should render a remove button', () => {
			render(<RemovableTag text="" testId="tag" />);
			expect(screen.getByTestId('close-button-tag')).toBeInTheDocument();
		});
	});

	it('should use the supplied link component', () => {
		const CustomLink = ({
			children,
			href,
			testId,
		}: {
			children?: React.ReactNode;
			href?: string;
			testId?: string;
		}) => (
			<span data-href={href} data-testid={testId}>
				{children}
			</span>
		);

		render(
			<RemovableTag
				text="Custom link"
				href="/custom-link"
				linkComponent={CustomLink}
				testId="removable-tag"
			/>,
		);

		expect(screen.getByTestId('removable-tag--link')).toHaveAttribute('data-href', '/custom-link');
	});
});
