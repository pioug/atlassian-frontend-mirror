import React from 'react';
import { mount } from 'enzyme';
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

describe('TaskItemsFormatContext', () => {
	describe('TaskItemsFormatConsumer', () => {
		it('should not error if provider missing', () => {
			const wrapper = mount(<Consumer />);

			expect(wrapper.find('button').text()).toMatch('todo');
			const button = wrapper.find('button');
			button.simulate('click');
			expect(wrapper.find('button').text()).toMatch('todo');
		});

		it('should work if provider available', () => {
			const wrapper = mount(
				<TaskItemsFormatProvider>
					<Consumer />
				</TaskItemsFormatProvider>,
			);

			expect(wrapper.find('button').text()).toMatch('todo');
			const button = wrapper.find('button');
			button.simulate('click');
			expect(wrapper.find('button').text()).toMatch('done');
		});
	});

	describe('useTaskItemsFormatContext', () => {
		it('should not error if provider missing', () => {
			const wrapper = mount(<ButtonWithFormatContext />);

			expect(wrapper.find('button').text()).toMatch('todo');
			const button = wrapper.find('button');
			button.simulate('click');
			expect(wrapper.find('button').text()).toMatch('todo');
		});

		it('should work if provider available', () => {
			const wrapper = mount(
				<TaskItemsFormatProvider>
					<ButtonWithFormatContext />
				</TaskItemsFormatProvider>,
			);

			expect(wrapper.find('button').text()).toMatch('todo');
			const button = wrapper.find('button');
			button.simulate('click');
			expect(wrapper.find('button').text()).toMatch('done');
		});
	});
});
