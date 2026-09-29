import React from 'react';

import { render, screen } from '@atlassian/testing-library';

import { ToolbarDropdownItem } from '../ToolbarDropdownItem';

describe('ToolbarDropdownItem roles', () => {
	it('does not infer menuitemradio for selected button items without explicit role', async () => {
		render(
			<div role="menu">
				<ToolbarDropdownItem isSelected>Selected button</ToolbarDropdownItem>
			</div>,
		);

		const item = screen.getByRole('menuitem', { name: 'Selected button' });
		expect(item).not.toHaveAttribute('role', 'menuitemradio');
		expect(item).not.toHaveAttribute('aria-checked');
		expect(item).not.toHaveAttribute('aria-pressed');
		await expect(document.body).toBeAccessible();
	});

	it('sets aria-checked for selected button items with explicit menuitemradio role', () => {
		render(
			<div role="menu">
				<ToolbarDropdownItem isSelected role="menuitemradio">
					Selected radio button
				</ToolbarDropdownItem>
			</div>,
		);

		const item = screen.getByRole('menuitemradio', { name: 'Selected radio button' });
		expect(item).toHaveAttribute('aria-checked', 'true');
		expect(item).not.toHaveAttribute('aria-pressed');
	});

	it('does not infer menuitemradio for selected anchor items without explicit role', () => {
		render(
			<div role="menu">
				<ToolbarDropdownItem href="https://www.atlassian.com" isSelected>
					Selected anchor
				</ToolbarDropdownItem>
			</div>,
		);

		const item = screen.getByRole('menuitem', { name: 'Selected anchor' });
		expect(item).not.toHaveAttribute('role', 'menuitemradio');
		expect(item).not.toHaveAttribute('aria-checked');
		expect(item).not.toHaveAttribute('aria-pressed');
	});

	it('sets aria-checked for selected anchor items with explicit menuitemradio role', () => {
		render(
			<div role="menu">
				<ToolbarDropdownItem href="https://www.atlassian.com" isSelected role="menuitemradio">
					Selected radio anchor
				</ToolbarDropdownItem>
			</div>,
		);

		const item = screen.getByRole('menuitemradio', { name: 'Selected radio anchor' });
		expect(item).toHaveAttribute('aria-checked', 'true');
		expect(item).not.toHaveAttribute('aria-pressed');
	});

	it('sets aria-checked for selected button items with explicit menuitemcheckbox role', () => {
		render(
			<div role="menu">
				<ToolbarDropdownItem isSelected role="menuitemcheckbox">
					Selected checkbox button
				</ToolbarDropdownItem>
			</div>,
		);

		const item = screen.getByRole('menuitemcheckbox', { name: 'Selected checkbox button' });
		expect(item).toHaveAttribute('aria-checked', 'true');
		expect(item).not.toHaveAttribute('aria-pressed');
	});

	it('sets aria-checked for selected anchor items with explicit menuitemcheckbox role', () => {
		render(
			<div role="menu">
				<ToolbarDropdownItem href="https://www.atlassian.com" isSelected role="menuitemcheckbox">
					Selected checkbox anchor
				</ToolbarDropdownItem>
			</div>,
		);

		const item = screen.getByRole('menuitemcheckbox', { name: 'Selected checkbox anchor' });
		expect(item).toHaveAttribute('aria-checked', 'true');
		expect(item).not.toHaveAttribute('aria-pressed');
	});
});
