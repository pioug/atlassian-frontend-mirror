import React from 'react';

import { render, screen } from '@testing-library/react';

import { ProjectIcon } from '../../src/ProjectIcon';

jest.mock('@atlaskit/emoji', () => ({
	ResourcedEmoji: ({ emojiId }: any) => (
		<span data-testid="resourced-emoji" data-emoji-id={emojiId?.shortName}>
			{emojiId?.shortName}
		</span>
	),
}));

jest.mock('@atlaskit/avatar', () => ({
	Status: ({ status }: any) => (
		<div data-testid="status-component" data-status={status}>
			{status}
		</div>
	),
}));

jest.mock('@atlaskit/primitives/compiled', () => ({
	Box: ({ children }: any) => <div data-testid="box">{children}</div>,
}));

jest.mock('../../src/provider', () => ({
	emojiProvider: {
		renderResourcedEmoji: jest.fn(),
	},
}));

describe('ProjectIcon', () => {
	it('should capture and report a11y violations', async () => {
		render(<ProjectIcon emoji=":lock:" isPrivate={true} />);

		await expect(document.body).toBeAccessible();
	});

	it('should render project icon and lock status when isPrivate is true', () => {
		render(<ProjectIcon emoji=":lock:" isPrivate={true} />);

		const emoji = screen.getByTestId('resourced-emoji');
		expect(emoji.textContent).toBe(':lock:');

		const statusComponent = screen.getByTestId('status-component');
		expect(statusComponent).toHaveAttribute('data-status', 'locked');
	});

	it('should render project icon without lock status when isPrivate is false', () => {
		render(<ProjectIcon emoji=":lock:" isPrivate={false} />);

		const emoji = screen.getByTestId('resourced-emoji');
		expect(emoji.textContent).toBe(':lock:');

		expect(screen.queryByTestId('status-component')).not.toBeInTheDocument();
	});
});
