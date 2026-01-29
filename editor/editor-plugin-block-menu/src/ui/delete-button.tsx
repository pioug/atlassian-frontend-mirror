import React, { useCallback, useEffect } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl, useIntl } from 'react-intl-next';

import type { BlockMenuEventPayload, NodeDeletedAEP } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { BLOCK_MENU_ACTION_TEST_ID } from '@atlaskit/editor-common/block-menu';
import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import {
	deleteSelectedRange,
	getSourceNodesFromSelectionRange,
} from '@atlaskit/editor-common/selection';
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

			// Extract node information before deletion
			const preservedSelection = api?.blockControls?.sharedState.currentState()?.preservedSelection;
			const selection = preservedSelection || tr.selection;
			const sourceNodes = getSourceNodesFromSelectionRange(tr, selection);

			const nodeCount = sourceNodes.length;

			// Fire node deletion analytics event if nodes are being deleted
			if (nodeCount > 0) {
				const nodeType = sourceNodes.length === 1 ? sourceNodes[0].type.name : 'multiple';

				const nodeDeletedPayload: NodeDeletedAEP = {
					action: ACTION.DELETED,
					actionSubject: ACTION_SUBJECT.ELEMENT,
					attributes: {
						inputMethod: INPUT_METHOD.BLOCK_MENU,
						nodeType,
						nodeCount,
					},
					eventType: EVENT_TYPE.TRACK,
				};
				api?.analytics?.actions?.attachAnalyticsEvent(nodeDeletedPayload)(tr);
			}

			deleteSelectedRange(tr, preservedSelection);
			api?.blockControls?.commands?.toggleBlockMenu({ closeMenu: true })({ tr });
			return tr;
		});
		api?.core.actions.focus();
	};

	const onShowHoverDecoration = useCallback(() => {
		api?.core.actions.execute(({ tr }) => {
			api?.decorations?.commands?.hoverDecoration?.({ add: true })({ tr });

			return tr;
		});
	}, [api]);

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
				testId={BLOCK_MENU_ACTION_TEST_ID.DELETE}
			>
				<Text as="span" color="color.text.danger">
					{formatMessage(blockMenuMessages.deleteBlock)}
				</Text>
			</ToolbarDropdownItem>
		</Box>
	);
};

export const DeleteDropdownItem = injectIntl(DeleteDropdownItemContent);
