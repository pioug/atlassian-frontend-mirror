import React from 'react';

import SettingsIcon from '@atlaskit/icon/core/settings';
import { act, render, screen, userEvent } from '@atlassian/testing-library';

import { List } from '../../../../components/list';
import { EndItem } from '../../end-item';

const createUser = () => userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

describe('EndItem', () => {
	beforeEach(() => {
		// Mocking timers to avoid waiting for tooltips to appear
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	const actionText = 'action';

	it('should be accessible', async () => {
		const { container } = render(
			<List>
				<EndItem icon={SettingsIcon} label={actionText} />
			</List>,
		);

		await expect(container).toBeAccessible();
		expect(screen.getByRole('listitem')).toBeInTheDocument();
	});

	it('should trigger the `onClick` when clicked', async () => {
		const user = createUser();
		const onClick = jest.fn();

		render(<EndItem icon={SettingsIcon} label={actionText} onClick={onClick} />);

		const el = screen.getByRole('button');
		expect(onClick).toHaveBeenCalledTimes(0);

		await user.click(el);
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('should add the test id', () => {
		render(<EndItem icon={SettingsIcon} testId="test-id" label={actionText} />);

		expect(screen.getByTestId('test-id')).toBeInTheDocument();
	});

	it('should support displaying a shortcut in the tooltip', async () => {
		const user = createUser();

		render(<EndItem icon={SettingsIcon} label={actionText} shortcut={['⌘', 'S']} />);

		await user.hover(screen.getByRole('button'));
		act(() => {
			jest.runAllTimers();
		});

		expect(screen.getByRole('tooltip', { name: 'action ⌘ S' })).toBeInTheDocument();
	});
});
