import React from 'react';

import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';

import { List } from '../../../../components/list';
import { ChatButton } from '../../chat-button';

describe('ChatButton', () => {
	const chatLabel = 'Chat';

	it('should be accessible', async () => {
		const { container } = render(
			<List>
				<ChatButton>{chatLabel}</ChatButton>
			</List>,
		);

		await expect(container).toBeAccessible();
		expect(screen.getByRole('listitem')).toBeInTheDocument();
	});

	it('should render button', () => {
		render(<ChatButton>{chatLabel}</ChatButton>);
		expect(screen.getByRole('button', { name: chatLabel })).toBeInTheDocument();
	});

	it('should trigger the `onClick` when clicked', async () => {
		const user = userEvent.setup();
		const onClick = jest.fn();

		render(<ChatButton onClick={onClick}>{chatLabel}</ChatButton>);

		const el = screen.getByRole('button');

		expect(onClick).toHaveBeenCalledTimes(0);
		await user.click(el);
		expect(onClick).toHaveBeenCalledTimes(1);
	});
});
