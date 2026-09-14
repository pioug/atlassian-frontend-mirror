import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
	TaskItemsFormatConsumer,
	TaskItemsFormatProvider,
	useTaskItemsFormatContext,
} from '../../TaskItemsFormatContext';

const ButtonWithFormatContext = () => {
	const [taskItemsDone, dispatch] = useTaskItemsFormatContext();
	return (
		<button
			onClick={() => {
				dispatch(true);
			}}
		>
			{taskItemsDone ? 'done' : 'todo'}
		</button>
	);
};

const Consumer = () => (
	<TaskItemsFormatConsumer>
		{([taskItemsDone, dispatch]) => {
			return (
				<button
					onClick={() => {
						dispatch(true);
					}}
				>
					{taskItemsDone ? 'done' : 'todo'}
				</button>
			);
		}}
	</TaskItemsFormatConsumer>
);

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('TaskItemsFormatContext', () => {
	describe('TaskItemsFormatConsumer', () => {
		it('should not error if provider missing', async () => {
			render(<Consumer />);

			expect(screen.getByRole('button')).toHaveTextContent('todo');

			await userEvent.click(screen.getByRole('button'));

			expect(screen.getByRole('button')).toHaveTextContent('todo');
		});

		it('should work if provider available', async () => {
			render(
				<TaskItemsFormatProvider>
					<Consumer />
				</TaskItemsFormatProvider>,
			);

			expect(screen.getByRole('button')).toHaveTextContent('todo');

			await userEvent.click(screen.getByRole('button'));

			expect(screen.getByRole('button')).toHaveTextContent('done');
		});
	});

	describe('useTaskItemsFormatContext', () => {
		it('should not error if provider missing', async () => {
			render(<ButtonWithFormatContext />);

			expect(screen.getByRole('button')).toHaveTextContent('todo');

			await userEvent.click(screen.getByRole('button'));

			expect(screen.getByRole('button')).toHaveTextContent('todo');
		});

		it('should work if provider available', async () => {
			render(
				<TaskItemsFormatProvider>
					<ButtonWithFormatContext />
				</TaskItemsFormatProvider>,
			);

			expect(screen.getByRole('button')).toHaveTextContent('todo');

			await userEvent.click(screen.getByRole('button'));

			expect(screen.getByRole('button')).toHaveTextContent('done');
		});
	});
});
