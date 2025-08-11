import React from 'react';

import {
	ToolbarDropdownItem,
	ToolbarDropdownItemSection,
	ToolbarNestedDropdownMenu,
} from '@atlaskit/editor-toolbar';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';

import type {
	RegisterBlockMenuItem,
	RegisterBlockMenuNested,
	RegisterBlockMenuSection,
} from '../../src/blockMenuPluginType';

export const registerMoveUpComponent = {
	type: 'block-menu-item',
	key: 'move-up',
	parent: {
		type: 'block-menu-section',
		key: 'block-menu-section-move-up-down',
		rank: 300,
	},
	component: () => {
		return <ToolbarDropdownItem>Move Up</ToolbarDropdownItem>;
	},
} as RegisterBlockMenuItem;

export const registerMoveDownComponent = {
	type: 'block-menu-item',
	key: 'move-down',
	parent: {
		type: 'block-menu-section',
		key: 'block-menu-section-move-up-down',
		rank: 200,
	},
	component: () => {
		return <ToolbarDropdownItem>Move Down</ToolbarDropdownItem>;
	},
} as RegisterBlockMenuItem;

export const registerDeleteComponent = {
	type: 'block-menu-item',
	key: 'delete',
	parent: {
		type: 'block-menu-section',
		key: 'block-menu-section-delete',
		rank: 100,
	},
	component: () => {
		return <ToolbarDropdownItem>Delete</ToolbarDropdownItem>;
	},
} as RegisterBlockMenuItem;

export const registerMoveUpDownSectionComponent = {
	type: 'block-menu-section',
	rank: 100,
	key: 'block-menu-section-move-up-down',
	component: ({ children }) => {
		return <ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>;
	},
} as RegisterBlockMenuSection;

export const registerDeleteSectionComponent = {
	type: 'block-menu-section',
	rank: 200,
	key: 'block-menu-section-delete',
	component: ({ children }) => {
		return <ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>;
	},
} as RegisterBlockMenuSection;

export const registerNestedMenu = {
	type: 'block-menu-nested',
	key: 'nested-menu',
	parent: {
		type: 'block-menu-section',
		key: 'block-menu-section-move-up-down',
		rank: 1,
	},
	component: () => {
		return (
			<ToolbarNestedDropdownMenu
				elemBefore={null}
				text="example nested menu"
				elemAfter={<ChevronRightIcon label={'example nested menu'} />}
			>
				<ToolbarDropdownItemSection>
					<ToolbarDropdownItem>Make shorter</ToolbarDropdownItem>
					<ToolbarDropdownItem>Make longer</ToolbarDropdownItem>
				</ToolbarDropdownItemSection>
			</ToolbarNestedDropdownMenu>
		);
	},
} as RegisterBlockMenuNested;
