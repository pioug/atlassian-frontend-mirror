import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useSelectAllTrap } from '../../../utils/use-select-all-trap';

const TestComponent = () => (
	<div ref={useSelectAllTrap<HTMLDivElement>()}>
		<p>This is a top paragraph.</p>
		<input type="text" defaultValue="foo" />
		<p>This is a bottom paragraph.</p>
	</div>
);

describe('useSelectAllTrap', () => {
	it('selects input content when pressing Ctrl+A inside an input', async () => {
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
	});
});
