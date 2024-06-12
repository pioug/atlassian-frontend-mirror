import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import DropdownMenu, {
	DropdownItem,
	DropdownItemCheckbox,
	DropdownItemCheckboxGroup,
	DropdownItemGroup,
	DropdownItemRadio,
	DropdownItemRadioGroup,
} from '../../index';

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
