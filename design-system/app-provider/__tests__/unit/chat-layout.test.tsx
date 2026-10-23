import React from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';
import { within } from '@atlassian/testing-library/within';

import { ChatLayout } from '../../examples/shared/chat-layout';

it('keeps blank messages from being sent', async () => {
	const user = userEvent.setup();
	render(<ChatLayout />);
	expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
	await user.type(screen.getByRole('textbox', { name: 'Message' }), '   {Enter}');
	expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
});

it('adds multiline messages to the conversation and clears and refocuses the composer', async () => {
	const user = userEvent.setup();
	render(<ChatLayout />);
	const composer = screen.getByRole('textbox', { name: 'Message' });
	const conversation = screen.getByRole('log', { name: 'Conversation' });
	await user.type(composer, 'I have an update.{Enter}The mobile layout is ready.');
	expect(within(conversation).queryByText(/I have an update/)).not.toBeInTheDocument();
	await user.click(screen.getByRole('button', { name: 'Send' }));
	expect(within(conversation).getByText(/I have an update/)).toHaveTextContent(
		'I have an update. The mobile layout is ready.',
	);
	expect(composer).toHaveValue('');
	expect(composer).toHaveFocus();
	expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
	await user.type(composer, 'Ready for review.');
	await user.click(screen.getByRole('button', { name: 'Send' }));
	expect(within(conversation).getByText('Ready for review.')).toBeInTheDocument();
	expect(within(conversation).getByText(/I have an update/)).toBeInTheDocument();
});
