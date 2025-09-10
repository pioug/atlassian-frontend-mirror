import React, { useCallback } from 'react';

import { useIntl, injectIntl } from 'react-intl-next';
import type { WrappedComponentProps } from 'react-intl-next';

import { messages } from '@atlaskit/editor-common/block-menu';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { findTable, isTableSelected } from '@atlaskit/editor-tables/utils';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import DeleteIcon from '@atlaskit/icon/core/delete';
import { Box } from '@atlaskit/primitives/box';
import Text from '@atlaskit/primitives/text';
import { token } from '@atlaskit/tokens';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

type Props = {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
} & WrappedComponentProps;

const DeleteDropdownItemContent = ({ api }: Props) => {
	const { formatMessage } = useIntl();
	const nodeTypes = Object.values(api?.core.sharedState.currentState()?.schema?.nodes || {});
	const onClick = () => {
		api?.core.actions.execute(({ tr }) => {
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
			api?.blockControls?.commands?.toggleBlockMenu({ closeMenu: true })({ tr });
			return tr;
		});
		api?.core.actions.focus();
	};

	const onMouseEnter = useCallback(() => {
		api?.core.actions.execute(({ tr }) => {
			api?.decorations?.commands?.hoverDecoration?.({
				nodeType: nodeTypes,
				add: true,
			})({ tr });
			return tr;
		});
	}, [api, nodeTypes]);

	const onMouseLeave = () => {
		api?.core.actions.execute(api?.decorations?.commands?.removeDecoration?.());
	};

	return (
		<Box onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
			<ToolbarDropdownItem
				elemBefore={<DeleteIcon color={token('color.icon.danger')} label="" />}
				onClick={onClick}
			>
				<Text as="span" color="color.text.danger">
					{formatMessage(messages.deleteBlock)}
				</Text>
			</ToolbarDropdownItem>
		</Box>
	);
};

export const DeleteDropdownItem = injectIntl(DeleteDropdownItemContent);
