import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';

import type { RegisterBlockMenuComponent } from '../src/blockMenuPluginType';
import { createBlockMenuRegistry } from '../src/editor-actions';
import { BlockMenuRenderer } from '../src/ui/block-menu-renderer';

import {
	registerDeleteComponent,
	registerMoveDownComponent,
	registerMoveUpComponent,
	registerMoveUpDownSectionComponent,
	registerDeleteSectionComponent,
	registerNestedMenu,
} from './helpers/block-menu-components-definition';

const allComponents = [
	registerMoveUpComponent,
	registerMoveDownComponent,
	registerDeleteComponent,
	registerDeleteSectionComponent,
	registerMoveUpDownSectionComponent,
	registerNestedMenu,
] as RegisterBlockMenuComponent[];

/**
 * @returns A basic example of a block menu using the registry.
 * This example registers several components and uses a `BlockMenuRenderer` to render them.
 */
export default function Basic() {
	const registry = createBlockMenuRegistry();

	registry.register(allComponents);

	return (
		<BlockMenuRenderer
			components={registry.components}
			fallbacks={{
				nestedMenu: () => <DropdownMenu>Block Menu Item</DropdownMenu>,
				section: () => <DropdownItemGroup>Block Menu Item</DropdownItemGroup>,
				item: () => <DropdownItem>Block Menu Item</DropdownItem>,
			}}
		/>
	);
}
