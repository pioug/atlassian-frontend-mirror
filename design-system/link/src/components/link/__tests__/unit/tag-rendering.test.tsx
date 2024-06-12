import React from 'react';

import { render, screen } from '@testing-library/react';

import Link from '../../../../index';

const testId = 'link';

describe('Tag rendering:', () => {
	it('should render the main element as an `<a>` tag', () => {
		render(
			<Link href="http://www.atlassian.com" testId={testId}>
				Hello world
			</Link>,
		);
		const link = screen.getByTestId(testId);

		expect(link.tagName.toLowerCase()).toBe('a');
	});
	it('should render the "new window" icon element as a `<span>` tag', () => {
		render(
			<Link href="https://www.atlassian.com" testId={testId} target="_blank">
				Hello world
			</Link>,
		);

		const linkIcon = screen.getByTestId(`${testId}__icon`);

		expect(linkIcon.tagName.toLowerCase()).toBe('span');
	});
});
