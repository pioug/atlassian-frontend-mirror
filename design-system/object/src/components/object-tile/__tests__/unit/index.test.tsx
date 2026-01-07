import React from 'react';

import { render, screen } from '@atlassian/testing-library';

import PullRequestObjectTile from '../../components/pull-request';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('ObjectTile', () => {
	it('should render with default props', () => {
		render(<PullRequestObjectTile testId="pullrequest-test" />);
		const element = screen.getByTestId('pullrequest-test');
		expect(element).toBeInTheDocument();
	});

	it('should apply `testId`', () => {
		const testId = 'custom-pullrequest-test-id';
		render(<PullRequestObjectTile testId={testId} />);
		expect(screen.getByTestId(testId)).toBeInTheDocument();
	});

	it('should throw error when invalid size is passed', () => {
		// Mock console.error to suppress error output during testing
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

		expect(() => {
			render(
				<PullRequestObjectTile
					// @ts-expect-error - xxsmall is not a valid size on ObjectTile, but is on the underlying Tile component
					size="xxsmall"
					testId="pullrequest-test"
				/>,
			);
		}).toThrow(
			'ObjectTile: size "xxsmall" is not valid. Valid sizes are: xsmall, small, medium, large, xlarge',
		);

		consoleSpy.mockRestore();
	});
});
