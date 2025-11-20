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
import { checkIsFormatMenuHidden } from './utils/checkIsFormatMenuHidden';

export const FormatMenuComponent = ({
	api,
	children,
}: {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	children: React.ReactNode;
}) => {
	const { formatMessage } = useIntl();

	const isDisabled = fg('platform_editor_block_menu_for_disabled_nodes')
		? checkIsFormatMenuHidden(api)
		: false;

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

	return (
		<ToolbarNestedDropdownMenu
			text={formatMessage(blockMenuMessages.turnInto)}
			elemBefore={<ChangesIcon label="" />}
			elemAfter={<ChevronRightIcon label="" />}
			enableMaxHeight={true}
			isDisabled={isDisabled}
			onClick={handleClick}
			dropdownTestId="editor-nested-turn-into-menu"
			shouldFitContainer={fg('platform_editor_block_menu_shouldfitcontainer') ? true : undefined}
		>
			{children}
		</ToolbarNestedDropdownMenu>
	);
};
