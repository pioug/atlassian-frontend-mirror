import React from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import QuotationMarkIcon from '@atlaskit/icon/core/quotation-mark';

import type { BlockTypePlugin } from '../blockTypePluginType';

type QuoteBlockMenuItemProps = {
	api: ExtractInjectionAPI<BlockTypePlugin> | undefined;
};

const NODE_NAME = 'blockquote';

const QuoteBlockMenuItem = ({ api }: QuoteBlockMenuItemProps) => {
	const { formatMessage } = useIntl();

	const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
		const triggeredFrom =
			event.nativeEvent instanceof KeyboardEvent || event.nativeEvent.detail === 0
				? INPUT_METHOD.KEYBOARD
				: INPUT_METHOD.MOUSE;
		const inputMethod = INPUT_METHOD.BLOCK_MENU;

		api?.core.actions.execute(({ tr }) => {
			const command = api?.blockMenu?.commands.transformNode(tr.doc.type.schema.nodes.blockquote, {
				inputMethod,
				triggeredFrom,
				targetTypeName: NODE_NAME,
			});
			return command ? command({ tr }) : null;
		});
	};

	return (
		<ToolbarDropdownItem onClick={handleClick} elemBefore={<QuotationMarkIcon label="" />}>
			{formatMessage(blockTypeMessages.blockquote)}
		</ToolbarDropdownItem>
	);
};

export const createQuoteBlockMenuItem = ({ api }: QuoteBlockMenuItemProps) => {
	return (): React.JSX.Element => <QuoteBlockMenuItem api={api} />;
};
