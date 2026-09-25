import React from 'react';

import { useIntl } from 'react-intl';

import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import {
	ToolbarDropdownItem,
	ToolbarDropdownItemSection,
	ToolbarNestedDropdownMenu,
} from '@atlaskit/editor-toolbar';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';

import { useBlockMenuTargetVisibility } from '../block-menu-target-visibility-context';
import type { BlockMenuFallbacks } from './types';

const FallbackNestedMenu = ({ children }: { children?: React.ReactNode }) => {
	const { formatMessage } = useIntl();
	const targetVisible = useBlockMenuTargetVisibility();
	return (
		<ToolbarNestedDropdownMenu
			isPopupVisible={targetVisible}
			elemBefore={undefined}
			elemAfter={<ChevronRightIcon label="" size="small" />}
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
