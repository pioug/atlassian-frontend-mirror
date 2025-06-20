import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SettingsIcon from '@atlaskit/icon/glyph/settings';

import { List } from '../../../../components/list';
import { EndItem } from '../../end-item';

describe('EndItem', () => {
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
		const user = userEvent.setup();
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
});
