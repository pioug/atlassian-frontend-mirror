import React from 'react';

import { useIntl } from 'react-intl-next';

import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import TextParagraphIcon from '@atlaskit/icon-lab/core/text-paragraph';

export const ParagraphMenuItem = () => {
	const { formatMessage } = useIntl();
	return (
		<ToolbarDropdownItem
			elemBefore={<TextParagraphIcon label={formatMessage(blockMenuMessages.paragraph)} />}
		>
			{formatMessage(blockMenuMessages.paragraph)}
		</ToolbarDropdownItem>
	);
};
