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
import ArrowUpIcon from '@atlaskit/icon/core/arrow-up';

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

const MoveUpDropdownItemContent = ({ api }: Props & WrappedComponentProps) => {
	const { formatMessage } = useIntl();
	const {
		moveUpRef,
		moveDownRef,
		getFirstSelectedDomNode,
		getMovedBlockDomNode,
		getSelectedBlockDomNode,
		anchorMetricsRef,
	} = useBlockMenu();
	const { canMoveUp } = useSharedPluginStateWithSelector(
		api,
		['blockControls'],
		({ blockControlsState }) => {
			return {
				canMoveUp: blockControlsState?.blockMenuOptions?.canMoveUp,
			};
		},
	);

	useEffect(() => {
		const doc = getDocument();
		if (
			!canMoveUp &&
			moveUpRef.current &&
			doc &&
			moveUpRef.current === doc.activeElement &&
			moveDownRef.current
		) {
			moveDownRef.current.focus();
		}
	}, [canMoveUp, moveDownRef, moveUpRef]);

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
					menuItemName: BLOCK_MENU_ITEM_NAME.MOVE_UP,
				},
				eventType: EVENT_TYPE.UI,
			};
			api?.analytics?.actions?.attachAnalyticsEvent(payload)(tr);

			api?.blockControls?.commands?.moveNodeWithBlockMenu(DIRECTION.UP)({ tr });
			return tr;
		});

		scheduleBlockMenuPositionFix(positionSnapshot, getMovedBlockDomNode, getFirstSelectedDomNode);
	};

	return (
		<ToolbarDropdownItem
			triggerRef={moveUpRef}
			onClick={handleClick}
			elemBefore={<ArrowUpIcon label="" size="small" />}
			isDisabled={!canMoveUp}
			testId={BLOCK_MENU_ACTION_TEST_ID.MOVE_UP}
		>
			{formatMessage(messages.moveUpBlock)}
		</ToolbarDropdownItem>
	);
};

// eslint-disable-next-line @typescript-eslint/no-restricted-types
export const MoveUpDropdownItem: React.FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<Props & WrappedComponentProps>;
} = injectIntl(MoveUpDropdownItemContent);
