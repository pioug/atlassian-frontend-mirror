import React from 'react';

import {
	ToolbarDropdownItem,
	ToolbarDropdownItemSection,
	ToolbarNestedDropdownMenu,
} from '@atlaskit/editor-toolbar';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';

import type { BlockMenuFallbacks } from './types';

export const BLOCK_MENU_FALLBACKS: BlockMenuFallbacks = {
	'block-menu-nested': ({ children }) => (
		<ToolbarNestedDropdownMenu
			elemBefore={undefined}
			elemAfter={<ChevronRightIcon label="" />}
			text="Nested Menu"
			enableMaxHeight
			shouldFitContainer
		>
			{children}
		</ToolbarNestedDropdownMenu>
	),
	'block-menu-section': ({ children }) => (
		<ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>
	),
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx
	'block-menu-item': () => <ToolbarDropdownItem>Block Menu Item</ToolbarDropdownItem>,
} as const;
