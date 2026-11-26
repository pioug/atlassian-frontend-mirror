import React from 'react';

import { ChatPanel } from '@atlaskit/navigation-system/layout/chat-panel';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';

import ChatPanelExample from '../../examples/ai/chat-panel';

jest.mock('@atlaskit/navigation-system/layout/chat-panel', () => {
	const actual = jest.requireActual<typeof import('@atlaskit/navigation-system/layout/chat-panel')>(
		'@atlaskit/navigation-system/layout/chat-panel',
	);
	return { ...actual, ChatPanel: jest.fn(actual.ChatPanel) };
});

afterEach(() => {
	jest.restoreAllMocks();
});

beforeEach(() => {
	passGate('platform-dst-chat-panel-layout');
	jest
		.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
		.mockReturnValue({ width: 1200 } as DOMRect);
});

it('restores focus to the trigger when the close button dismisses chat', async () => {
	render(<ChatPanelExample />);
	const trigger = screen.getByRole('button', { name: 'Ask Rovo' });
	await userEvent.click(trigger);
	await userEvent.click(screen.getByRole('button', { name: 'Close chat' }));

	expect(screen.queryByRole('button', { name: 'Close chat' })).not.toBeInTheDocument();
	expect(trigger).toHaveFocus();
	await userEvent.click(trigger);
	expect(screen.getByRole('button', { name: 'Close chat' })).toBeInTheDocument();
});

it('preserves focus outside chat when onClose dismisses the panel', async () => {
	render(
		<>
			<button type="button">Open navigation</button>
			<ChatPanelExample />
		</>,
	);
	const trigger = screen.getByRole('button', { name: 'Ask Rovo' });
	await userEvent.click(trigger);
	const closeButton = screen.getByRole('button', { name: 'Close chat' });
	act(() => closeButton.focus());

	// Overlay replacement happens after the user moves focus to another control.
	const navigationButton = screen.getByRole('button', { name: 'Open navigation' });
	await userEvent.click(navigationButton);
	expect(navigationButton).toHaveFocus();
	const calls = jest.mocked(ChatPanel).mock.calls;
	act(() => calls[calls.length - 1][0].onClose());

	expect(screen.queryByRole('button', { name: 'Close chat' })).not.toBeInTheDocument();
	expect(navigationButton).toHaveFocus();
	await userEvent.click(trigger);
	expect(screen.getByRole('button', { name: 'Close chat' })).toBeInTheDocument();
});

it.each([
	['close button', 'button', 'Close chat'],
	['resize handle', 'slider', 'Resize Rovo'],
])('restores focus when onClose removes the focused %s', async (_name, role, name) => {
	render(<ChatPanelExample />);
	const trigger = screen.getByRole('button', { name: 'Ask Rovo' });
	await userEvent.click(trigger);
	const focusedControl = screen.getByRole(role, { name });
	act(() => focusedControl.focus());
	expect(focusedControl).toHaveFocus();

	const calls = jest.mocked(ChatPanel).mock.calls;
	act(() => calls[calls.length - 1][0].onClose());

	expect(screen.queryByRole('button', { name: 'Close chat' })).not.toBeInTheDocument();
	expect(trigger).toHaveFocus();
	await userEvent.click(trigger);
	expect(screen.getByRole('button', { name: 'Close chat' })).toBeInTheDocument();
});
