import React from 'react';

import { render, screen } from '@testing-library/react';

import Link from '../../../../index';

const testId = 'link';

describe('Test ID:', () => {
	it('should render on main element', () => {
		render(
			<Link href="https://www.atlassian.com" testId={testId}>
				Hello world
			</Link>,
		);

		expect(screen.getByTestId(testId)).toBeInTheDocument();
	});
	it('should render on "new window" icon element', () => {
		render(
			<Link href="https://www.atlassian.com" testId={testId} target="_blank">
				Hello world
			</Link>,
		);

		expect(screen.getByTestId(`${testId}__icon`)).toBeInTheDocument();
	});
});
