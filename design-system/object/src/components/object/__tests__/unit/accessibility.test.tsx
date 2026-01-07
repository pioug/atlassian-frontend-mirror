import React from 'react';

import { axe } from '@af/accessibility-testing';
import { render, screen } from '@atlassian/testing-library';

import BlogObject from '../../components/blog';
import EpicObject from '../../components/epic';
import PullRequestObject from '../../components/pull-request';
import TaskObject from '../../components/task';
import WorkItemObject from '../../components/work-item';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Object Accessibility', () => {
	describe('aXe audits', () => {
		it('should not fail with default props', async () => {
			const { container } = render(<PullRequestObject />);
			await axe(container);
		});

		it('should not fail with custom label', async () => {
			const { container } = render(<PullRequestObject label="Custom Pull Request" />);
			await axe(container);
		});

		it('should not fail with empty label (decorative)', async () => {
			const { container } = render(<PullRequestObject label="" />);
			await axe(container);
		});

		it('should not fail with different sizes', async () => {
			const { container: smallContainer } = render(<PullRequestObject size="small" />);
			await axe(smallContainer);

			const { container: mediumContainer } = render(<PullRequestObject size="medium" />);
			await axe(mediumContainer);
		});
	});

	describe('accessible names', () => {
		it('should provide meaningful default labels', () => {
			const testCases = [
				{ Component: BlogObject, expectedLabel: 'Blog' },
				{ Component: WorkItemObject, expectedLabel: 'Work Item' },
				{ Component: EpicObject, expectedLabel: 'Epic' },
				{ Component: TaskObject, expectedLabel: 'Task' },
				{ Component: PullRequestObject, expectedLabel: 'Pull Request' },
			];

			testCases.forEach(({ Component, expectedLabel }, index) => {
				render(<Component testId={`accessibility-test-${index}`} />);
				const element = screen.getByTestId(`accessibility-test-${index}`);
				expect(element).toHaveAccessibleName(expectedLabel);
			});
		});

		it('should support custom labels', () => {
			const customLabel = 'Create a Pull Request';
			render(<PullRequestObject label={customLabel} testId="pullrequest-test" />);
			const element = screen.getByTestId('pullrequest-test');
			expect(element).toHaveAccessibleName(customLabel);
		});

		it('should render with empty label for decorative use', () => {
			render(<PullRequestObject label="" testId="pullrequest-test" />);
			const element = screen.getByTestId('pullrequest-test');
			expect(element).toHaveAccessibleName('');
		});
	});
});
