import React, { useCallback } from 'react';

import { useIntl } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	type BlockMenuEventPayload,
} from '@atlaskit/editor-common/analytics';
import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarNestedDropdownMenu } from '@atlaskit/editor-toolbar';
import ChangesIcon from '@atlaskit/icon/core/changes';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { fg } from '@atlaskit/platform-feature-flags';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

import { BLOCK_MENU_ITEM_NAME } from './consts';

export const FormatMenuComponent = ({
	api,
	children,
}: {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	children: React.ReactNode;
}): React.JSX.Element => {
	const { formatMessage } = useIntl();

	const handleClick = useCallback(() => {
		api?.core.actions.execute(({ tr }) => {
			const payload: BlockMenuEventPayload = {
				action: ACTION.CLICKED,
				actionSubject: ACTION_SUBJECT.BLOCK_MENU_ITEM,
				attributes: {
					menuItemName: BLOCK_MENU_ITEM_NAME.FORMAT_MENU,
				},
				eventType: EVENT_TYPE.UI,
			};
			api?.analytics?.actions?.attachAnalyticsEvent(payload)(tr);
			return tr;
		});
	}, [api]);

	// [FEATURE FLAG: platform_editor_block_menu_v2_patch_3]
	// Adds size="small" to icons for better visual consistency in block menu.
	// To clean up: remove conditional, keep only size="small" version.
	const iconSize = fg('platform_editor_block_menu_v2_patch_3') ? 'small' : undefined;

	return (
		<ToolbarNestedDropdownMenu
			text={formatMessage(blockMenuMessages.turnInto)}
			elemBefore={<ChangesIcon label="" size={iconSize} />}
			elemAfter={<ChevronRightIcon label="" size={iconSize} />}
			enableMaxHeight={true}
			onClick={handleClick}
			dropdownTestId="editor-turn-into-menu"
			shouldFitContainer
		>
			{children}
		</ToolbarNestedDropdownMenu>
	);
};
