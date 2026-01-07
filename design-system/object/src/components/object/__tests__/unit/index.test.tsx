import React from 'react';

import { render, screen } from '@atlassian/testing-library';

import PullRequestObject from '../../components/pull-request';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Object', () => {
	it('should render with default props', () => {
		render(<PullRequestObject testId="pullrequest-test" />);
		const element = screen.getByTestId('pullrequest-test');
		expect(element).toBeInTheDocument();
	});

	it('should apply `testId`', () => {
		const testId = 'custom-pullrequest-test-id';
		render(<PullRequestObject testId={testId} />);
		expect(screen.getByTestId(testId)).toBeInTheDocument();
	});
});
