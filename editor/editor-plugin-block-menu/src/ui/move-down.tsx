import React, { useEffect } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl, useIntl } from 'react-intl-next';

import { getDocument } from '@atlaskit/browser-apis';
import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	type BlockMenuEventPayload,
} from '@atlaskit/editor-common/analytics';
import { BLOCK_MENU_ACTION_TEST_ID } from '@atlaskit/editor-common/block-menu';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { blockMenuMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { DIRECTION } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import ArrowDownIcon from '@atlaskit/icon/core/arrow-down';
import { fg } from '@atlaskit/platform-feature-flags';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

import { useBlockMenu } from './block-menu-provider';
import { BLOCK_MENU_ITEM_NAME } from './consts';
import { fixBlockMenuPositionAndScroll } from './utils/fixBlockMenuPositionAndScroll';

type Props = {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
};

const MoveDownDropdownItemContent = ({ api }: Props & WrappedComponentProps) => {
	const { formatMessage } = useIntl();
	const { moveUpRef, moveDownRef, getFirstSelectedDomNode } = useBlockMenu();

	const { canMoveDown } = useSharedPluginStateWithSelector(
		api,
		['blockControls'],
		({ blockControlsState }) => {
			return {
				canMoveDown: blockControlsState?.blockMenuOptions?.canMoveDown,
			};
		},
	);

	// Maybe don't need this
	useEffect(() => {
		const doc = getDocument();
		if (
			!canMoveDown &&
			moveDownRef.current &&
			doc &&
			moveDownRef.current === doc.activeElement &&
			moveUpRef.current
		) {
			moveUpRef.current.focus();
		}
	}, [canMoveDown, moveUpRef, moveDownRef]);

	const handleClick = () => {
		api?.core.actions.execute(({ tr }) => {
			const payload: BlockMenuEventPayload = {
				action: ACTION.CLICKED,
				actionSubject: ACTION_SUBJECT.BLOCK_MENU_ITEM,
				attributes: {
					menuItemName: BLOCK_MENU_ITEM_NAME.MOVE_DOWN,
				},
				eventType: EVENT_TYPE.UI,
			};
			api?.analytics?.actions?.attachAnalyticsEvent(payload)(tr);
			api?.blockControls?.commands?.moveNodeWithBlockMenu(DIRECTION.DOWN)({ tr });
			return tr;
		});

		requestAnimationFrame(() => {
			const newFirstNode = getFirstSelectedDomNode();
			fixBlockMenuPositionAndScroll(newFirstNode);
		});
	};

	// [FEATURE FLAG: platform_editor_block_menu_v2_patch_3]
	// Adds size="small" to icons for better visual consistency in block menu.
	// To clean up: remove conditional, keep only size="small" version.
	const iconSize = fg('platform_editor_block_menu_v2_patch_3') ? 'small' : undefined;

	return (
		<ToolbarDropdownItem
			triggerRef={moveDownRef}
			onClick={handleClick}
			elemBefore={<ArrowDownIcon label="" size={iconSize} />}
			isDisabled={!canMoveDown}
			testId={BLOCK_MENU_ACTION_TEST_ID.MOVE_DOWN}
		>
			{formatMessage(messages.moveDownBlock)}
		</ToolbarDropdownItem>
	);
};

export const MoveDownDropdownItem = injectIntl(MoveDownDropdownItemContent);
