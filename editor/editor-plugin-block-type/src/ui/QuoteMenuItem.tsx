import React from 'react';

import { useIntl } from 'react-intl-next';

import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import QuotationMarkIcon from '@atlaskit/icon/core/quotation-mark';

export const QuoteMenuItem = () => {
	const { formatMessage } = useIntl();
	return (
		<ToolbarDropdownItem
			elemBefore={<QuotationMarkIcon label={formatMessage(blockTypeMessages.blockquote)} />}
		>
			{formatMessage(blockTypeMessages.blockquote)}
		</ToolbarDropdownItem>
	);
};
