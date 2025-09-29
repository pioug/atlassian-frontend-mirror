import React from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
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

	const currentBlockType = useSharedPluginStateSelector(api, 'blockType.currentBlockType');
	const bulletListActive = useSharedPluginStateSelector(api, 'list.bulletListActive');
	const orderedListActive = useSharedPluginStateSelector(api, 'list.orderedListActive');
	const selection = useSharedPluginStateSelector(api, 'selection.selection');
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
			const inputMethod =
				event.nativeEvent instanceof KeyboardEvent || event.nativeEvent.detail === 0
					? INPUT_METHOD.KEYBOARD
					: INPUT_METHOD.MOUSE;
			const triggeredFrom = INPUT_METHOD.BLOCK_MENU;

			api?.core.actions.execute(
				api?.blockMenu?.commands.formatNode(`paragraph`, { inputMethod, triggeredFrom }),
			);
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
