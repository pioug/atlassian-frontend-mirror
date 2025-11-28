import React, { useCallback, useEffect } from 'react';

import { useIntl, injectIntl } from 'react-intl-next';
import type { WrappedComponentProps } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	type BlockMenuEventPayload,
} from '@atlaskit/editor-common/analytics';
import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import { deleteSelectedRange } from '@atlaskit/editor-common/selection';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import DeleteIcon from '@atlaskit/icon/core/delete';
import { Box } from '@atlaskit/primitives/box';
import Text from '@atlaskit/primitives/text';
import { token } from '@atlaskit/tokens';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

import { BLOCK_MENU_ITEM_NAME } from './consts';

type Props = {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
} & WrappedComponentProps;

const DeleteDropdownItemContent = ({ api }: Props) => {
	const { formatMessage } = useIntl();
	const nodeTypes = Object.values(api?.core.sharedState.currentState()?.schema?.nodes || {});
	const onClick = () => {
		api?.core.actions.execute(({ tr }) => {
			const payload: BlockMenuEventPayload = {
				action: ACTION.CLICKED,
				actionSubject: ACTION_SUBJECT.BLOCK_MENU_ITEM,
				attributes: {
					menuItemName: BLOCK_MENU_ITEM_NAME.DELETE,
				},
				eventType: EVENT_TYPE.UI,
			};
			api?.analytics?.actions?.attachAnalyticsEvent(payload)(tr);

			deleteSelectedRange(tr);
			api?.blockControls?.commands?.toggleBlockMenu({ closeMenu: true })({ tr });
			return tr;
		});
		api?.core.actions.focus();
	};

	const onShowHoverDecoration = useCallback(() => {
		api?.core.actions.execute(({ tr }) => {
			api?.decorations?.commands?.hoverDecoration?.({
				nodeType: nodeTypes,
				add: true,
			})({ tr });

			return tr;
		});
	}, [api, nodeTypes]);

	const onRemoveHoverDecoration = useCallback(() => {
		api?.core.actions.execute(({ tr }) => {
			api?.decorations?.commands?.removeDecoration?.()({ tr });
			return tr;
		});
	}, [api]);

	useEffect(() => {
		return () => {
			// clean up hover decoration when unmounting
			onRemoveHoverDecoration();
		};
	}, [onRemoveHoverDecoration]);

	return (
		<Box
			onMouseEnter={onShowHoverDecoration}
			onMouseLeave={onRemoveHoverDecoration}
			onFocus={onShowHoverDecoration}
			onBlur={onRemoveHoverDecoration}
		>
			<ToolbarDropdownItem
				elemBefore={<DeleteIcon color={token('color.icon.danger')} label="" />}
				onClick={onClick}
			>
				<Text as="span" color="color.text.danger">
					{formatMessage(blockMenuMessages.deleteBlock)}
				</Text>
			</ToolbarDropdownItem>
		</Box>
	);
};

export const DeleteDropdownItem = injectIntl(DeleteDropdownItemContent);
