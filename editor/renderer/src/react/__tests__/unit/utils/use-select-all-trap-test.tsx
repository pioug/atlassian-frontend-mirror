import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { useSelectAllTrap } from '../../../utils/use-select-all-trap';

const TestComponent = () => (
	<div ref={useSelectAllTrap<HTMLDivElement>()}>
		<p>This is a top paragraph.</p>
		<input type="text" defaultValue="foo" />
		<p>This is a bottom paragraph.</p>
	</div>
);

describe('useSelectAllTrap', () => {
	describe('selects input content when pressing Ctrl+A inside an input', () => {
		ffTest(
			'platform-datasources-enable-two-way-sync',
			async () => {
				const user = userEvent.setup();

				render(<TestComponent />);

				const input = screen.getByRole('textbox');
				await user.click(input);
				await user.keyboard('{Control>}A{/Control}');

				// Text nodes are not selected.
				const selection = document.getSelection()?.toString();
				expect(selection).toBe('');

				// Input is selected.
				expect(input).toHaveFocus();
				expect(input).toHaveProperty('selectionStart', 0);
				expect(input).toHaveProperty('selectionEnd', 3);
			},
			async () => {
				const user = userEvent.setup();

				render(<TestComponent />);

				const input = screen.getByRole('textbox');
				await user.click(input);
				await user.keyboard('{Control>}A{/Control}');

				// All text nodes are selected
				const selection = document.getSelection()?.toString();
				expect(selection).toBe('This is a top paragraph.This is a bottom paragraph.');

				// Input content is not selected.
				expect(input).toHaveProperty('selectionStart', 3);
				expect(input).toHaveProperty('selectionEnd', 3);
			},
		);
	});
});
