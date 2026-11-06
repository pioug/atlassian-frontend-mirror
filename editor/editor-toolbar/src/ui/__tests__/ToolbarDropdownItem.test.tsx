import React from 'react';

import { fireEvent } from '@testing-library/react';

import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

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

const mockCloseMenu = jest.fn();
jest.mock('../ToolbarDropdownMenuContext', () => ({
	useToolbarDropdownMenu: () => ({ closeMenu: mockCloseMenu }),
}));

it('keeps the parent menu open for a nested dialog and forwards its accessible relationship', () => {
	const onClick = jest.fn();
	render(
		<div role="menu">
			<ToolbarDropdownItem
				id="credits-trigger"
				aria-haspopup="dialog"
				aria-controls="credits-popup"
				hasNestedDropdownMenu
				isSelected
				onClick={onClick}
			>
				Ask Rovo
			</ToolbarDropdownItem>
		</div>,
	);
	const item = screen.getByRole('menuitem');
	fireEvent.click(item);
	expect(onClick).toHaveBeenCalledTimes(1);
	expect(mockCloseMenu).not.toHaveBeenCalled();
	expect(item).toHaveAttribute('id', 'credits-trigger');
	expect(item).toHaveAttribute('aria-haspopup', 'dialog');
	expect(item).toHaveAttribute('aria-controls', 'credits-popup');
	expect(item).toHaveAttribute('aria-expanded', 'true');
});

it('still closes the parent menu for a regular action', () => {
	render(
		<div role="menu">
			<ToolbarDropdownItem>Run action</ToolbarDropdownItem>
		</div>,
	);
	fireEvent.click(screen.getByRole('menuitem'));
	expect(mockCloseMenu).toHaveBeenCalledTimes(1);
});
