import React from 'react';

import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';

import EditorContext from '../../../ui/EditorContext';
import ToolbarHelp from '../../../ui/ToolbarHelp';

describe('@atlaskit/editor-core/ui/ToolbarHelp', () => {
	const renderWithEditorContext = (props = {}) => {
		return renderWithIntl(
			<EditorContext>
				<ToolbarHelp {...props} editorApi={undefined} />
			</EditorContext>,
		);
	};

	it('should render a tooltip with the default title and placement', async () => {
		renderWithEditorContext();

		await userEvent.hover(screen.getByRole('button', { name: 'Open help dialog' }));

		const tooltip = await screen.findByRole('tooltip', { name: 'Open help dialog' });
		expect(tooltip).toBeVisible();
		expect(tooltip).toHaveAttribute('data-placement', 'left');
	});

	it('should use the title passed in from props', async () => {
		renderWithEditorContext({ title: 'Custom title' });

		await userEvent.hover(screen.getByRole('button', { name: 'Custom title' }));

		expect(await screen.findByRole('tooltip', { name: 'Custom title' })).toBeVisible();
	});

	it('should use the titlePosition passed in from props', async () => {
		renderWithEditorContext({ titlePosition: 'top' });

		await userEvent.hover(screen.getByRole('button', { name: 'Open help dialog' }));

		expect(await screen.findByRole('tooltip', { name: 'Open help dialog' })).toHaveAttribute(
			'data-placement',
			'top',
		);
	});
});
