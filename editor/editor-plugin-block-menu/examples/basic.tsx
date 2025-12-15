import React from 'react';

import type { RegisterBlockMenuComponent } from '../src/blockMenuPluginType';
import { createBlockMenuRegistry } from '../src/editor-actions';
import { BlockMenuRenderer } from '../src/ui/block-menu-renderer/BlockMenuRenderer';
import { BLOCK_MENU_FALLBACKS } from '../src/ui/block-menu-renderer/fallbacks';

import {
	registerDeleteComponent,
	registerDeleteSectionComponent,
	registerMoveDownComponent,
	registerMoveUpComponent,
	registerMoveUpDownSectionComponent,
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
 * This example registers several components and uses a `BlockMenuRenderer` to render them.
 *
 * @returns A basic example of a block menu using the registry.
 */
export default function Basic() {
	const registry = createBlockMenuRegistry();

	registry.register(allComponents);

	return (
		<BlockMenuRenderer
			allRegisteredComponents={registry.components}
			fallbacks={BLOCK_MENU_FALLBACKS}
		/>
	);
}
