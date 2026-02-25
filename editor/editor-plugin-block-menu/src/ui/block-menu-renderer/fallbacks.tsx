import React from 'react';

import { useIntl } from 'react-intl-next';

import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import {
	ToolbarDropdownItem,
	ToolbarDropdownItemSection,
	ToolbarNestedDropdownMenu,
} from '@atlaskit/editor-toolbar';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { fg } from '@atlaskit/platform-feature-flags';

import type { BlockMenuFallbacks } from './types';

const FallbackNestedMenu = ({ children }: { children?: React.ReactNode }) => {
	const { formatMessage } = useIntl();
	// [FEATURE FLAG: platform_editor_block_menu_v2_patch_3]
	// Adds size="small" to icons for better visual consistency in block menu.
	// To clean up: remove conditional, keep only size="small" version.
	const iconSize = fg('platform_editor_block_menu_v2_patch_3') ? 'small' : undefined;
	return (
		<ToolbarNestedDropdownMenu
			elemBefore={undefined}
			elemAfter={<ChevronRightIcon label="" size={iconSize} />}
			text={formatMessage(blockMenuMessages.fallbackNestedMenu)}
			enableMaxHeight
			shouldFitContainer
		>
			{children}
		</ToolbarNestedDropdownMenu>
	);
};

const FallbackMenuItem = () => {
	const { formatMessage } = useIntl();
	return (
		<ToolbarDropdownItem>{formatMessage(blockMenuMessages.fallbackMenuItem)}</ToolbarDropdownItem>
	);
};

export const BLOCK_MENU_FALLBACKS: BlockMenuFallbacks = {
	'block-menu-nested': FallbackNestedMenu,
	'block-menu-section': ({ children }) => (
		<ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>
	),
	'block-menu-item': FallbackMenuItem,
} as const;
