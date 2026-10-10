import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import { messages as blockTypeMessages } from '@atlaskit/editor-common/messages/block-type';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { BlockMenuItemComponentProps } from '@atlaskit/editor-plugin-block-menu/blockMenuPluginType';
import { TextSmallIcon } from '@atlaskit/editor-toolbar/text-small-icon';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar/toolbar-dropdown-item';

import type { BlockTypePlugin } from '../blockTypePluginType';

type SmallTextBlockMenuItemProps = {
	api: ExtractInjectionAPI<BlockTypePlugin> | undefined;
	isSuggested?: boolean;
};

const NODE_NAME = 'smallText';

const SmallTextBlockMenuItem = ({ api, isSuggested }: SmallTextBlockMenuItemProps) => {
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
				marksToAdd: { fontSize: { fontSize: 'small' } },
				triggeredFrom,
				targetTypeName: NODE_NAME,
			});
			return command ? command({ tr }) : null;
		});
	};

	return (
		<ToolbarDropdownItem onClick={handleClick} elemBefore={<TextSmallIcon label="" size="small" />}>
			{formatMessage(blockTypeMessages.smallText)}
		</ToolbarDropdownItem>
	);
};

export const createSmallTextBlockMenuItem = ({ api }: SmallTextBlockMenuItemProps) => {
	return ({ isSuggested }: BlockMenuItemComponentProps = {}): React.JSX.Element => (
		<SmallTextBlockMenuItem api={api} isSuggested={isSuggested} />
	);
};
