import React from 'react';

import { fireEvent } from '@atlassian/testing-library/fire-event';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { ToolbarKeyboardNavigationProvider } from '../ToolbarKeyboardNavigationProvider';

const setup = (independent = false) => {
	const handleEscape = jest.fn();
	render(
		<ToolbarKeyboardNavigationProvider
			ariaControls="editor"
			ariaLabel="Toolbar"
			childComponentSelector="#toolbar-content"
			handleEscape={handleEscape}
			handleFocus={() => {}}
			isShortcutToFocusToolbar={() => false}
		>
			<div id="toolbar-content">
				<button type="button">First toolbar button</button>
				<div data-keyboard-navigation-independent={independent ? '' : undefined}>
					<button type="button">Nested button</button>
				</div>
				<button type="button">Last toolbar button</button>
			</div>
			<div id="editor" />
		</ToolbarKeyboardNavigationProvider>,
	);
	return {
		first: screen.getByRole('button', { name: 'First toolbar button' }),
		nested: screen.getByRole('button', { name: 'Nested button' }),
		last: screen.getByRole('button', { name: 'Last toolbar button' }),
		handleEscape,
	};
};

describe('ToolbarKeyboardNavigationProvider', () => {
	it('preserves native Tab stops inside an independent container', async () => {
		const { first, nested, last } = setup(true);
		first.focus();
		fireEvent.keyDown(first, { key: 'Tab' });

		expect(first).toHaveAttribute('tabindex', '0');
		expect(last).toHaveAttribute('tabindex', '-1');
		expect(nested).not.toHaveAttribute('tabindex');
		await expect(document.body).toBeAccessible();
	});

	it('skips independent controls during arrow navigation', () => {
		const { first, nested, last } = setup(true);
		first.focus();
		fireEvent.keyDown(first, { key: 'ArrowRight' });
		expect(last).toHaveFocus();
		fireEvent.keyDown(last, { key: 'ArrowLeft' });
		expect(first).toHaveFocus();
		expect(nested).not.toHaveFocus();
	});

	it('leaves key events inside the independent container to its consumer', () => {
		const { nested, handleEscape } = setup(true);
		nested.focus();
		for (const key of ['Tab', 'ArrowLeft', 'ArrowRight', 'Escape']) {
			expect(fireEvent.keyDown(nested, { key })).toBe(true);
			expect(nested).toHaveFocus();
		}
		expect(nested).not.toHaveAttribute('tabindex');
		expect(handleEscape).not.toHaveBeenCalled();
	});

	it('includes nested controls when their container is not independent', () => {
		const { first, nested } = setup();
		first.focus();
		fireEvent.keyDown(first, { key: 'ArrowRight' });
		expect(nested).toHaveFocus();
		first.focus();
		fireEvent.keyDown(first, { key: 'Tab' });
		expect(nested).toHaveAttribute('tabindex', '-1');
	});
});
