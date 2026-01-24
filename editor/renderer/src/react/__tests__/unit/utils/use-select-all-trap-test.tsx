import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

import { useSelectAllTrap } from '../../../utils/use-select-all-trap';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

const TestComponent = () => (
	<div ref={useSelectAllTrap<HTMLDivElement>()}>
		<p>This is a top paragraph.</p>
		<input type="text" defaultValue="foo" />
		<p>This is a bottom paragraph.</p>
	</div>
);

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
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
