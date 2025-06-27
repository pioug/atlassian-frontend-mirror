import React from 'react';

import { screen } from '@testing-library/react';
import { renderWithIntl } from '@atlaskit/elements-test-helpers/rtl';

import { TaskItem } from '../../../';

describe('A11y', () => {
	it('aria label for not completed task', async () => {
		renderWithIntl(<TaskItem taskId="task-1">task</TaskItem>);

		expect(await screen.findByRole('checkbox')).toHaveAttribute(
			'aria-label',
			'Mark task as completed',
		);
	});

	it('aria label for completed task', async () => {
		renderWithIntl(
			<TaskItem taskId="task-1" isDone>
				task
			</TaskItem>,
		);

		expect(await screen.findByRole('checkbox')).toHaveAttribute(
			'aria-label',
			'Mark task as not completed',
		);
	});
});
