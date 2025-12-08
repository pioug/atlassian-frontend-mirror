import React, { useEffect } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { useIntl, injectIntl } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	type BlockMenuEventPayload,
} from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { blockMenuMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { DIRECTION } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import ArrowUpIcon from '@atlaskit/icon/core/arrow-up';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

import { useBlockMenu } from './block-menu-provider';
import { BLOCK_MENU_ITEM_NAME } from './consts';

type Props = {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
};

const MoveUpDropdownItemContent = ({ api }: Props & WrappedComponentProps) => {
	const { formatMessage } = useIntl();
	const { moveFocusTo, moveUpRef } = useBlockMenu();
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
		const moveUpElement = moveUpRef.current;
		if (!moveUpElement) {
			return;
		}

		if (!canMoveUp && moveUpElement === document.activeElement) {
			moveFocusTo('moveDown');
		}
	}, [canMoveUp, moveFocusTo, moveUpRef]);

	const handleClick = () => {
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
	};
	return (
		<ToolbarDropdownItem
			triggerRef={moveUpRef}
			onClick={handleClick}
			elemBefore={<ArrowUpIcon label="" />}
			isDisabled={!canMoveUp}
		>
			{formatMessage(messages.moveUpBlock)}
		</ToolbarDropdownItem>
	);
};

export const MoveUpDropdownItem = injectIntl(MoveUpDropdownItemContent);
