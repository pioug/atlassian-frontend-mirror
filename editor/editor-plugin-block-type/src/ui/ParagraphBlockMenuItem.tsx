import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { BlockMenuItemComponentProps } from '@atlaskit/editor-plugin-block-menu/blockMenuPluginType';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import TextParagraphIcon from '@atlaskit/icon-lab/core/text-paragraph';

import type { BlockTypePlugin } from '../blockTypePluginType';

type ParagraphBlockMenuItemProps = {
	api: ExtractInjectionAPI<BlockTypePlugin> | undefined;
	isSuggested?: boolean;
};

const NODE_NAME = 'paragraph';

const ParagraphBlockMenuItem = ({ api, isSuggested }: ParagraphBlockMenuItemProps) => {
	const { formatMessage } = useIntl();

	const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
		const triggeredFrom =
			event.nativeEvent instanceof KeyboardEvent || event.nativeEvent.detail === 0
				? INPUT_METHOD.KEYBOARD
				: INPUT_METHOD.MOUSE;
		const inputMethod = INPUT_METHOD.BLOCK_MENU;

		api?.core.actions.execute(({ tr }) => {
			const command = api?.blockMenu?.commands.transformNode(tr.doc.type.schema.nodes.paragraph, {
				inputMethod,
				isSuggested,
				triggeredFrom,
				targetTypeName: NODE_NAME,
			});
			return command ? command({ tr }) : null;
		});
	};

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			elemBefore={<TextParagraphIcon label="" size="small" />}
		>
			{formatMessage(blockMenuMessages.paragraph)}
		</ToolbarDropdownItem>
	);
};

export const createParagraphBlockMenuItem = ({ api }: ParagraphBlockMenuItemProps) => {
	return ({ isSuggested }: BlockMenuItemComponentProps = {}): React.JSX.Element => (
		<ParagraphBlockMenuItem api={api} isSuggested={isSuggested} />
	);
};
