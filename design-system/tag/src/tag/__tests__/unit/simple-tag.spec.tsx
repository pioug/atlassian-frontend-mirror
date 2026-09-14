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
});
