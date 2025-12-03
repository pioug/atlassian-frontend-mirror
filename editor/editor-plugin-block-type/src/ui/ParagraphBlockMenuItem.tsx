import React from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import TextParagraphIcon from '@atlaskit/icon-lab/core/text-paragraph';

import type { BlockTypePlugin } from '../blockTypePluginType';

import { NORMAL_TEXT } from './consts';

type ParagraphBlockMenuItemProps = {
	api: ExtractInjectionAPI<BlockTypePlugin> | undefined;
};

const ParagraphBlockMenuItem = ({ api }: ParagraphBlockMenuItemProps) => {
	const { formatMessage } = useIntl();

	const { currentBlockType, bulletListActive, orderedListActive, selection } =
		useSharedPluginStateWithSelector(api, ['blockType', 'list', 'selection'], (states) => ({
			currentBlockType: states.blockTypeState?.currentBlockType,
			bulletListActive: states.listState?.bulletListActive,
			orderedListActive: states.listState?.orderedListActive,
			selection: states.selectionState?.selection,
		}));

	const isTextSelection = selection instanceof TextSelection;
	const isParagraph =
		isTextSelection &&
		currentBlockType &&
		currentBlockType === NORMAL_TEXT &&
		!bulletListActive &&
		!orderedListActive;

	const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
		if (!selection) {
			return;
		}

		if (!isParagraph) {
			const triggeredFrom =
				event.nativeEvent instanceof KeyboardEvent || event.nativeEvent.detail === 0
					? INPUT_METHOD.KEYBOARD
					: INPUT_METHOD.MOUSE;
			const inputMethod = INPUT_METHOD.BLOCK_MENU;

			api?.core.actions.execute(({ tr }) => {
				const command = api?.blockMenu?.commands.transformNode(tr.doc.type.schema.nodes.paragraph, {
					inputMethod,
					triggeredFrom,
					targetTypeName: `paragraph`,
				});
				return command ? command({ tr }) : null;
			});
		}
	};

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			isSelected={isParagraph}
			elemBefore={<TextParagraphIcon label="" />}
		>
			{formatMessage(blockMenuMessages.paragraph)}
		</ToolbarDropdownItem>
	);
};

export const createParagraphBlockMenuItem = ({ api }: ParagraphBlockMenuItemProps) => {
	return () => <ParagraphBlockMenuItem api={api} />;
};
