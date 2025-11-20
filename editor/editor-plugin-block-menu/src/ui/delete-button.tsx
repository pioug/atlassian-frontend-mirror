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
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { findTable, isTableSelected } from '@atlaskit/editor-tables/utils';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import DeleteIcon from '@atlaskit/icon/core/delete';
import { Box } from '@atlaskit/primitives/box';
import Text from '@atlaskit/primitives/text';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { token } from '@atlaskit/tokens';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

import { BLOCK_MENU_ITEM_NAME } from './consts';

type Props = {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
} & WrappedComponentProps;

const DeleteDropdownItemContent = ({ api }: Props) => {
	const { formatMessage } = useIntl();
	const nodeTypes = Object.values(api?.core.sharedState.currentState()?.schema?.nodes || {});
	const onClick = (e: React.MouseEvent | React.KeyboardEvent) => {
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

			if (
				expValEqualsNoExposure('platform_editor_block_menu_keyboard_navigation', 'isEnabled', true)
			) {
				deleteSelectedRange(tr);
			} else {
				const selection = tr.selection;
				let from = selection.$from.pos;
				let to = selection.$to.pos;

				if (selection instanceof TextSelection) {
					from = from - 1;
					to = to + 1;
				} else if (isTableSelected(selection)) {
					const table = findTable(selection);
					if (table) {
						from = table.pos;
						to = table.pos + table.node.nodeSize;
					}
				}
				tr.deleteRange(from, to);
			}
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
		if (
			!expValEqualsNoExposure('platform_editor_block_menu_keyboard_navigation', 'isEnabled', true)
		) {
			return;
		}

		return () => {
			if (
				!expValEqualsNoExposure('platform_editor_block_menu_keyboard_navigation', 'isEnabled', true)
			) {
				return;
			}
			// clean up hover decoration when unmounting
			onRemoveHoverDecoration();
		};
	}, [onRemoveHoverDecoration]);

	return (
		<Box
			onMouseEnter={onShowHoverDecoration}
			onMouseLeave={onRemoveHoverDecoration}
			onFocus={
				expValEqualsNoExposure('platform_editor_block_menu_keyboard_navigation', 'isEnabled', true)
					? onShowHoverDecoration
					: undefined
			}
			onBlur={
				expValEqualsNoExposure('platform_editor_block_menu_keyboard_navigation', 'isEnabled', true)
					? onRemoveHoverDecoration
					: undefined
			}
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
