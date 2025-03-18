import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl-next';
import { messages } from '../i18n';
import { ToolTipContentWithKeymap as EmotionToolTipContentWithKeymap } from './ToolTipContentWithKeymap';
import { ToolTipContentWithKeymap as CompiledToolTipContentWithKeymap } from '../compiled/common/ToolTipContentWithKeymap';
import { backspace } from '../../util/keymaps';
import VisuallyHidden from '@atlaskit/visually-hidden';
import type { EmojiDescription } from '../../types';

import { fg } from '@atlaskit/platform-feature-flags';

export const DeletableEmojiTooltipContent = () => {
	const { formatMessage } = useIntl();
	if (fg('platform_editor_css_migrate_emoji')) {
		return (
			<CompiledToolTipContentWithKeymap
				description={formatMessage(messages.deleteEmojiTooltip)}
				keymap={backspace}
			/>
		);
	} else {
		return (
			<EmotionToolTipContentWithKeymap
				description={formatMessage(messages.deleteEmojiTooltip)}
				keymap={backspace}
			/>
		);
	}
};

export const DeletableEmojiTooltipContentForScreenReader = ({
	emoji,
}: {
	emoji: EmojiDescription;
}) => {
	return (
		<VisuallyHidden id={`screenreader-emoji-${emoji.id!}`}>
			<FormattedMessage
				{...messages.deleteEmojiTooltipForScreenreader}
				values={{ shortName: emoji.shortName }}
			/>
		</VisuallyHidden>
	);
};
