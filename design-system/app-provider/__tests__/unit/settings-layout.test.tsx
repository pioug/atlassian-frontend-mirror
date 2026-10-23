import React from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { SettingsLayout } from '../../examples/shared/settings-layout';

it('saves preview changes and restores them when reopened, while cancel discards edits', async () => {
	const user = userEvent.setup();
	render(<SettingsLayout />);
	await user.clear(screen.getByRole('textbox', { name: 'Workspace name' }));
	await user.type(screen.getByRole('textbox', { name: 'Workspace name' }), 'Research studio');
	await user.click(screen.getByRole('checkbox', { name: 'Weekly team digest' }));
	await user.click(screen.getByRole('button', { name: 'Save changes' }));
	expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	expect(screen.getByRole('status')).toHaveTextContent('Workspace settings saved.');
	expect(screen.getByRole('button', { name: 'Open settings' })).toHaveFocus();

	await user.click(screen.getByRole('button', { name: 'Open settings' }));
	expect(screen.getByRole('textbox', { name: 'Workspace name' })).toHaveValue('Research studio');
	expect(screen.getByRole('textbox', { name: 'Workspace name' })).toHaveFocus();
	expect(screen.getByRole('checkbox', { name: 'Weekly team digest' })).toBeChecked();
	await user.clear(screen.getByRole('textbox', { name: 'Workspace name' }));
	await user.type(screen.getByRole('textbox', { name: 'Workspace name' }), 'Discard this');
	await user.click(screen.getByRole('checkbox', { name: 'Weekly team digest' }));
	await user.click(screen.getByRole('button', { name: 'Cancel' }));
	await user.click(screen.getByRole('button', { name: 'Open settings' }));
	expect(screen.getByRole('textbox', { name: 'Workspace name' })).toHaveValue('Research studio');
	expect(screen.getByRole('checkbox', { name: 'Weekly team digest' })).toBeChecked();
});

it('discards edits with Close or Escape and leaves controls outside the dialog accessible', async () => {
	const user = userEvent.setup();
	render(
		<>
			<SettingsLayout />
			<button>Outside preview control</button>
		</>,
	);
	await user.type(screen.getByRole('textbox', { name: 'Workspace name' }), ' unsaved');
	await user.click(screen.getByRole('button', { name: 'Outside preview control' }));
	expect(screen.getByRole('button', { name: 'Outside preview control' })).toHaveFocus();
	await user.keyboard('{Escape}');
	expect(screen.getByRole('dialog', { name: 'Workspace settings' })).toBeInTheDocument();
	await user.click(screen.getByRole('button', { name: 'Close settings' }));
	await user.click(screen.getByRole('button', { name: 'Open settings' }));
	expect(screen.getByRole('textbox', { name: 'Workspace name' })).toHaveValue('Design studio');
	await user.type(screen.getByRole('textbox', { name: 'Workspace name' }), ' unsaved');
	await user.keyboard('{Escape}');
	expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	expect(screen.getByRole('button', { name: 'Open settings' })).toHaveFocus();
	await user.click(screen.getByRole('button', { name: 'Open settings' }));
	expect(screen.getByRole('textbox', { name: 'Workspace name' })).toHaveValue('Design studio');
});
