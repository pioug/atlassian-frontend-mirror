import React from 'react';

import { useIntl } from 'react-intl-next';

import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import QuotationMarkIcon from '@atlaskit/icon/core/quotation-mark';

import type { BlockTypePlugin } from '../blockTypePluginType';

import { BLOCK_QUOTE } from './consts';

type QuoteBlockMenuItemProps = {
	api: ExtractInjectionAPI<BlockTypePlugin> | undefined;
};

const QuoteBlockMenuItem = ({ api }: QuoteBlockMenuItemProps) => {
	const { formatMessage } = useIntl();
	const currentBlockType = useSharedPluginStateSelector(api, 'blockType.currentBlockType');
	const isBlockQuote = currentBlockType && currentBlockType === BLOCK_QUOTE;

	const handleClick = () => {
		if (!isBlockQuote) {
			api?.core.actions.execute(api?.blockMenu?.commands.formatNode(`blockquote`));
		}
	};

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			isSelected={isBlockQuote}
			elemBefore={<QuotationMarkIcon label="" />}
		>
			{formatMessage(blockTypeMessages.blockquote)}
		</ToolbarDropdownItem>
	);
};

export const createQuoteBlockMenuItem = ({ api }: QuoteBlockMenuItemProps) => {
	return () => <QuoteBlockMenuItem api={api} />;
};
