import React from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import StatefulInlineDialog from '../../components/StatefulInlineDialog';

const renderDialog = (props = {}) =>
	render(
		<StatefulInlineDialog content={<div id="content" />} label="More information" {...props}>
			<div id="trigger" />
		</StatefulInlineDialog>,
	);

test('dialog should render closed by default', () => {
	renderDialog();
	expect(screen.queryByText('Dialog content')).not.toBeInTheDocument();
});

test('dialog should render on hover', async () => {
	renderDialog({ content: <div>Dialog content</div> });
	await userEvent.hover(screen.getByRole('button', { name: 'More information' }));
	expect(screen.getByText('Dialog content')).toBeInTheDocument();
});
