import React from 'react';

import { renderToString } from 'react-dom/server';

import { fireEvent } from '@atlassian/testing-library/fire-event';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';
import { waitFor } from '@atlassian/testing-library/wait-for';

import { OneClickChatSpotlightLoader } from '../async';

const mockLoad = jest.fn();
jest.mock('../index', () => ({
	get OneClickChatSpotlight() {
		mockLoad();
		return ({ children }: { children: React.ReactNode }) => (
			<span data-testid="loaded-spotlight">{children}</span>
		);
	},
}));

beforeEach(() => mockLoad.mockReset());

it('keeps the existing action usable while loading and after loading', async () => {
	const onInvoke = jest.fn();
	render(
		<OneClickChatSpotlightLoader onInvoke={onInvoke}>
			<button onClick={onInvoke}>Existing action</button>
		</OneClickChatSpotlightLoader>,
	);
	expect(screen.queryByTestId('loaded-spotlight')).not.toBeInTheDocument();
	// Click synchronously so this assertion exercises the still-loading fallback.
	fireEvent.click(screen.getByRole('button', { name: 'Existing action' }));
	expect(onInvoke).toHaveBeenCalledTimes(1);
	await screen.findByTestId('loaded-spotlight');
	await userEvent.click(screen.getByRole('button', { name: 'Existing action' }));
	expect(onInvoke).toHaveBeenCalledTimes(2);
});

it('keeps the action usable if loading fails', async () => {
	mockLoad.mockImplementation(() => {
		throw new Error('ChunkLoadError');
	});
	const onInvoke = jest.fn();
	render(
		<OneClickChatSpotlightLoader onInvoke={onInvoke}>
			<button onClick={onInvoke}>Existing action</button>
		</OneClickChatSpotlightLoader>,
	);
	await waitFor(() => expect(mockLoad).toHaveBeenCalled());
	expect(screen.queryByTestId('loaded-spotlight')).not.toBeInTheDocument();
	await userEvent.click(screen.getByRole('button', { name: 'Existing action' }));
	expect(onInvoke).toHaveBeenCalledTimes(1);
});

it('renders the existing action on the server without loading the spotlight', () => {
	const html = renderToString(
		<OneClickChatSpotlightLoader onInvoke={jest.fn()}>
			<button>Existing action</button>
		</OneClickChatSpotlightLoader>,
	);
	expect(html).toContain('Existing action');
	expect(html).not.toContain('loaded-spotlight');
	expect(mockLoad).not.toHaveBeenCalled();
});
