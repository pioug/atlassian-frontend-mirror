import React, { useCallback } from 'react';

import type { WithIntlProps, WrappedComponentProps } from 'react-intl';
import { injectIntl, useIntl } from 'react-intl';

import type { BlockMenuEventPayload } from '@atlaskit/editor-common/analytics/types/block-menu-events';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics/types/enums';
import { BLOCK_MENU_ACTION_TEST_ID } from '@atlaskit/editor-common/block-menu/key';
import { copyLinkToBlock, formatShortcut } from '@atlaskit/editor-common/keymaps';
import { messages } from '@atlaskit/editor-common/messages/block-menu';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar/toolbar-dropdown-item';
import { ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar/toolbar-keyboard-shortcut-hint';
import LinkIcon from '@atlaskit/icon/core/link';

import type { BlockMenuPlugin, BlockMenuPluginOptions } from '../blockMenuPluginType';
import { FLAG_ID } from '../blockMenuPluginType';
import { blockMenuPluginKey } from '../pm-plugins/main';
import { isCopyLinkEnabled } from '../pm-plugins/utils/isCopyLinkEnabled';
import { useBlockMenu } from './block-menu-provider';
import { BLOCK_MENU_ITEM_NAME } from './consts';
import { copyLink } from './utils/copyLink';

type Props = {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	config: BlockMenuPluginOptions | undefined;
};

const CopyLinkDropdownItemContent = ({ api, config }: Props & WrappedComponentProps) => {
	const { formatMessage } = useIntl();
	const { onDropdownOpenChanged } = useBlockMenu();
	const { getLinkPath, blockLinkHashPrefix } = config || {};

	const shortcut = formatShortcut(copyLinkToBlock);

	const { preservedSelection, defaultSelection } = useSharedPluginStateWithSelector(
		api,
		['blockControls', 'selection'],
		({ blockControlsState, selectionState }) => {
			return {
				preservedSelection: blockControlsState?.preservedSelection,
				defaultSelection: selectionState?.selection,
			};
		},
	);
	const selection = preservedSelection || defaultSelection;

	const handleClick = useCallback(() => {
		if (!selection) {
			return;
		}

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

		copyLink({ getLinkPath, blockLinkHashPrefix, selection }).then((success) => {
			if (success) {
				api?.core.actions.execute(({ tr }) => {
					tr.setMeta(blockMenuPluginKey, {
						showFlag: FLAG_ID.LINK_COPIED_TO_CLIPBOARD,
					});
					return tr;
				});
			}
		});
	}, [api, blockLinkHashPrefix, getLinkPath, onDropdownOpenChanged, selection]);

	if (!isCopyLinkEnabled(config)) {
		return null;
	}

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			elemBefore={<LinkIcon label="" size="small" />}
			elemAfter={shortcut ? <ToolbarKeyboardShortcutHint shortcut={shortcut} /> : undefined}
			ariaKeyshortcuts={shortcut}
			testId={BLOCK_MENU_ACTION_TEST_ID.COPY_LINK}
		>
			{formatMessage(messages.copyLinkToSelection)}
		</ToolbarDropdownItem>
	);
};

// eslint-disable-next-line @typescript-eslint/no-restricted-types
export const CopyLinkDropdownItem: React.FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<Props & WrappedComponentProps>;
} = injectIntl(CopyLinkDropdownItemContent);
