import React, { useCallback } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { useIntl, injectIntl } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	type BlockMenuEventPayload,
} from '@atlaskit/editor-common/analytics';
import { blockMenuMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import LinkIcon from '@atlaskit/icon/core/link';
import { fg } from '@atlaskit/platform-feature-flags';

import type { BlockMenuPlugin, BlockMenuPluginOptions } from '../blockMenuPluginType';
import { FLAG_ID } from '../blockMenuPluginType';
import { blockMenuPluginKey } from '../pm-plugins/main';

import { useBlockMenu } from './block-menu-provider';
import { BLOCK_MENU_ITEM_NAME } from './consts';
import { copyLink } from './utils/copyLink';
import { isNestedNode } from './utils/isNestedNode';

type Props = {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	config: BlockMenuPluginOptions | undefined;
};

const CopyLinkDropdownItemContent = ({ api, config }: Props & WrappedComponentProps) => {
	const { formatMessage } = useIntl();
	const { onDropdownOpenChanged } = useBlockMenu();
	const selection = api?.selection?.sharedState?.currentState()?.selection;

	const handleClick = useCallback(() => {
		api?.core.actions.execute(({ tr }) => {
			const payload: BlockMenuEventPayload = {
				action: ACTION.CLICKED,
				actionSubject: ACTION_SUBJECT.BLOCK_MENU_ITEM,
				attributes: {
					menuItemName: BLOCK_MENU_ITEM_NAME.COPY_LINK_TO_BLOCK,
				},
				eventType: EVENT_TYPE.UI,
			};
			api?.analytics?.actions?.attachAnalyticsEvent(payload)(tr);

			api?.blockControls?.commands?.toggleBlockMenu({ closeMenu: true })({ tr });
			return tr;
		});
		onDropdownOpenChanged(false);

		copyLink(config?.getLinkPath, config?.blockLinkHashPrefix, api).then((success) => {
			if (success) {
				api?.core.actions.execute(({ tr }) => {
					tr.setMeta(blockMenuPluginKey, {
						showFlag: FLAG_ID.LINK_COPIED_TO_CLIPBOARD,
					});
					return tr;
				});
			}
		});
	}, [config?.getLinkPath, config?.blockLinkHashPrefix, api, onDropdownOpenChanged]);

	const checkIsNestedNode = useCallback(() => {
		const selection = api?.selection?.sharedState?.currentState()?.selection;
		const menuTriggerBy = api?.blockControls?.sharedState?.currentState()?.menuTriggerBy;
		if (!selection || !menuTriggerBy) {
			return false;
		}
		return isNestedNode(selection, menuTriggerBy);
	}, [api]);

	// Hide copy link when `platform_editor_adf_with_localid` feature flag is off or when the node is nested or on empty line
	if (!fg('platform_editor_adf_with_localid') || checkIsNestedNode() || !!selection?.empty) {
		return null;
	}

	return (
		<ToolbarDropdownItem onClick={handleClick} elemBefore={<LinkIcon label="" />}>
			{formatMessage(messages.copyLinkToBlock)}
		</ToolbarDropdownItem>
	);
};

export const CopyLinkDropdownItem = injectIntl(CopyLinkDropdownItemContent);
