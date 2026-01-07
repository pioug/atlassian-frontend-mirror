import React from 'react';

import { render, screen } from '@testing-library/react';

import { HeadingItem } from '../../index';

const testId = 'heading-item';
const headingLevel = 3;

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('HeadingItem', () => {
	it('Should have role="heading" and level of heading specified', () => {
		render(
			<HeadingItem headingLevel={headingLevel} testId={testId}>
				Heading level 3
			</HeadingItem>,
		);

		const heading = screen.getByTestId(testId);
		expect(heading).toHaveAttribute('role', 'heading');
		expect(heading).toHaveAttribute('aria-level', `${headingLevel}`);
	});
	it('Should have default heading of level 2', () => {
		render(<HeadingItem testId={testId}>Heading level 2</HeadingItem>);

		const heading = screen.getByTestId(testId);
		expect(heading).toHaveAttribute('aria-level', '2');
	});
});
