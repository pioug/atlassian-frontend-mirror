import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { axe } from '@af/accessibility-testing';

import DropdownMenu from '../../dropdown-menu';
import DropdownItem from '../../dropdown-menu-item';
import DropdownItemCheckbox from '../../checkbox/dropdown-item-checkbox';
import DropdownItemCheckboxGroup from '../../checkbox/dropdown-item-checkbox-group';
import DropdownItemGroup from '../../dropdown-menu-item-group';
import DropdownItemRadio from '../../radio/dropdown-item-radio';
import DropdownItemRadioGroup from '../../radio/dropdown-item-radio-group';

const topLayerGate = 'platform-dst-top-layer';

const gateVariants = [
	{
		name: 'top layer enabled',
		setGate: () => passGate(topLayerGate),
	},
	{
		name: 'top layer disabled',
		setGate: () => failGate(topLayerGate),
	},
] as const;

describe.each(gateVariants)('$name', ({ setGate }) => {
	beforeEach(() => {
		setGate();
	});

	it('Basic Closed DropdownMenu should not fail aXe audit', async () => {
		const { container } = render(
			<DropdownMenu trigger="Page actions">
				<DropdownItemGroup title="Example title">
					<DropdownItem>Move</DropdownItem>
					<DropdownItem>Clone</DropdownItem>
					<DropdownItem>Delete</DropdownItem>
				</DropdownItemGroup>
				<DropdownItemGroup title="Example title2">
					<DropdownItem>Hi</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);
		await axe(container);
	});

	it('Basic DropdownMenu should not fail aXe audit', async () => {
		const { container } = render(
			<DropdownMenu trigger="Page actions" isOpen>
				<DropdownItemGroup title="Example title">
					<DropdownItem>Move</DropdownItem>
					<DropdownItem>Clone</DropdownItem>
					<DropdownItem>Delete</DropdownItem>
				</DropdownItemGroup>
				<DropdownItemGroup title="Example title2">
					<DropdownItem>Hi</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);
		await axe(container);
	});

	it('Checkbox DropdownMenu should not fail aXe audit', async () => {
		const { container } = render(
			<DropdownMenu trigger="Filter cities" isOpen>
				<DropdownItemCheckboxGroup id="cities">
					<DropdownItemCheckbox id="adelaide">Adelaide</DropdownItemCheckbox>
					<DropdownItemCheckbox id="sydney">Sydney</DropdownItemCheckbox>
					<DropdownItemCheckbox id="newcastle" isSelected>
						Newcastle
					</DropdownItemCheckbox>
				</DropdownItemCheckboxGroup>
			</DropdownMenu>,
		);
		await axe(container);
	});

	it('Radio DropdownMenu should not fail aXe audit', async () => {
		const { container } = render(
			<DropdownMenu trigger="Filter cities" isOpen>
				<DropdownItemRadioGroup id="cities">
					<DropdownItemRadio id="adelaide">Adelaide</DropdownItemRadio>
					<DropdownItemRadio id="sydney">Sydney</DropdownItemRadio>
					<DropdownItemRadio id="newcastle" isSelected>
						Newcastle
					</DropdownItemRadio>
				</DropdownItemRadioGroup>
			</DropdownMenu>,
		);
		await axe(container);
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage -- we have axe() checks above
describe('top layer menu semantics', () => {
	beforeEach(() => {
		passGate(topLayerGate);
	});

	it('exposes one menu role for a non-nested dropdown', () => {
		render(
			<DropdownMenu trigger="Page actions" isOpen>
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		expect(screen.getAllByRole('menu')).toHaveLength(1);
	});

	it('exposes a second menu role only after a nested dropdown opens', () => {
		render(
			<DropdownMenu trigger="Page actions" isOpen shouldRenderToParent>
				<DropdownItemGroup>
					<DropdownMenu
						placement="right-start"
						shouldRenderToParent
						trigger={({ triggerRef, ...triggerProps }) => (
							<DropdownItem {...triggerProps} ref={triggerRef}>
								More actions
							</DropdownItem>
						)}
					>
						<DropdownItemGroup>
							<DropdownItem>Clone</DropdownItem>
						</DropdownItemGroup>
					</DropdownMenu>
					<DropdownItem>Move</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		expect(screen.getAllByRole('menu')).toHaveLength(1);

		fireEvent.click(screen.getByRole('menuitem', { name: 'More actions' }));

		expect(screen.getAllByRole('menu')).toHaveLength(2);
	});
});
