import React from 'react';

import { render, screen } from '@atlassian/testing-library';

import { default as SimpleTag } from '../../internal/simple';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<SimpleTag />', () => {
	it('should render simple Tag with supplied text without any removable functionality', () => {
		const text = 'Atlassian Design System';
		render(<SimpleTag text={text} href="https://atlassian.design" />);
		expect(screen.getByText(text)).toBeInTheDocument();
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
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
			<SimpleTag
				text="Custom link"
				href="/custom-link"
				linkComponent={CustomLink}
				testId="simple-tag"
			/>,
		);

		expect(screen.getByTestId('simple-tag--link')).toHaveAttribute('data-href', '/custom-link');
	});
});
