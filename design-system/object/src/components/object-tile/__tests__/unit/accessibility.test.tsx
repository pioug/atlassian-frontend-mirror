import React from 'react';

import { render, screen } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import BlogObjectTile from '../../components/blog';
import EpicObjectTile from '../../components/epic';
import IssueObjectTile from '../../components/issue';
import PullRequestObjectTile from '../../components/pull-request';
import TaskObjectTile from '../../components/task';

describe('ObjectTile Accessibility', () => {
	describe('aXe audits', () => {
		it('should not fail with default props', async () => {
			const { container } = render(<PullRequestObjectTile />);
			await axe(container);
		});

		it('should not fail with custom label', async () => {
			const { container } = render(<PullRequestObjectTile label="Custom Pull Request" />);
			await axe(container);
		});

		it('should not fail with empty label (decorative)', async () => {
			const { container } = render(<PullRequestObjectTile label="" />);
			await axe(container);
		});

		it('should not fail with different sizes', async () => {
			const { container: smallContainer } = render(<PullRequestObjectTile size="small" />);
			await axe(smallContainer);

			const { container: mediumContainer } = render(<PullRequestObjectTile size="medium" />);
			await axe(mediumContainer);
		});
	});

	describe('accessible names', () => {
		it('should provide meaningful default labels', () => {
			const testCases = [
				{ Component: BlogObjectTile, expectedLabel: 'Blog' },
				{ Component: IssueObjectTile, expectedLabel: 'Issue' },
				{ Component: EpicObjectTile, expectedLabel: 'Epic' },
				{ Component: TaskObjectTile, expectedLabel: 'Task' },
				{ Component: PullRequestObjectTile, expectedLabel: 'Pull Request' },
			];

			testCases.forEach(({ Component, expectedLabel }, index) => {
				render(<Component testId={`accessibility-test-${index}`} />);
				const element = screen.getByTestId(`accessibility-test-${index}`);
				expect(element).toHaveAccessibleName(expectedLabel);
			});
		});

		it('should support custom labels', () => {
			const customLabel = 'Create a Pull Request';
			render(<PullRequestObjectTile label={customLabel} testId="pullrequest-test" />);
			const element = screen.getByTestId('pullrequest-test');
			expect(element).toHaveAccessibleName(customLabel);
		});

		it('should render with empty label for decorative use', () => {
			render(<PullRequestObjectTile label="" testId="pullrequest-test" />);
			const element = screen.getByTestId('pullrequest-test');
			expect(element).toHaveAccessibleName('');
		});
	});
});
