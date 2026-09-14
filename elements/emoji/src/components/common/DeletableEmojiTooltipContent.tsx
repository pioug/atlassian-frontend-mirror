import React from 'react';

import { useIntl } from 'react-intl';

import { backspace } from '../../util/keymaps';
import { messages } from '../i18n';
import { ToolTipContentWithKeymap } from './ToolTipContentWithKeymap';

export const DeletableEmojiTooltipContent = (): React.JSX.Element => {
	const { formatMessage } = useIntl();
	return (
		<ToolTipContentWithKeymap
			description={formatMessage(messages.deleteEmojiTooltip)}
			keymap={backspace}
		/>
	);
};
