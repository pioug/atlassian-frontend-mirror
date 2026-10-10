import React, { useEffect } from 'react';

import type { WithIntlProps, WrappedComponentProps } from 'react-intl';
import { injectIntl, useIntl } from 'react-intl';

import { getDocument } from '@atlaskit/browser-apis';
import type { BlockMenuEventPayload } from '@atlaskit/editor-common/analytics/types/block-menu-events';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics/types/enums';
import { BLOCK_MENU_ACTION_TEST_ID } from '@atlaskit/editor-common/block-menu/key';
import { messages } from '@atlaskit/editor-common/messages/block-menu';
import { DIRECTION } from '@atlaskit/editor-common/types/block-controls';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar/toolbar-dropdown-item';
import ArrowDownIcon from '@atlaskit/icon/core/arrow-down';

import type { BlockMenuPlugin } from '../blockMenuPluginType';
import { useBlockMenu } from './block-menu-provider';
import { BLOCK_MENU_ITEM_NAME } from './consts';
import {
	getBlockMenuPositionSnapshot,
	scheduleBlockMenuPositionFix,
} from './utils/fixBlockMenuPositionAndScroll';

type Props = {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
};

const MoveDownDropdownItemContent = ({ api }: Props & WrappedComponentProps) => {
	const { formatMessage } = useIntl();
	const {
		moveUpRef,
		moveDownRef,
		getFirstSelectedDomNode,
		getMovedBlockDomNode,
		getSelectedBlockDomNode,
		anchorMetricsRef,
	} = useBlockMenu();

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
		const positionSnapshot = getBlockMenuPositionSnapshot(
			getSelectedBlockDomNode(),
			anchorMetricsRef.current,
		);

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

		scheduleBlockMenuPositionFix(positionSnapshot, getMovedBlockDomNode, getFirstSelectedDomNode);
	};

	return (
		<ToolbarDropdownItem
			triggerRef={moveDownRef}
			onClick={handleClick}
			elemBefore={<ArrowDownIcon label="" size="small" />}
			isDisabled={!canMoveDown}
			testId={BLOCK_MENU_ACTION_TEST_ID.MOVE_DOWN}
		>
			{formatMessage(messages.moveDownBlock)}
		</ToolbarDropdownItem>
	);
};

// eslint-disable-next-line @typescript-eslint/no-restricted-types
export const MoveDownDropdownItem: React.FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<Props & WrappedComponentProps>;
} = injectIntl(MoveDownDropdownItemContent);
