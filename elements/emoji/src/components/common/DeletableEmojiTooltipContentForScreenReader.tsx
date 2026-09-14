import React from 'react';

import { FormattedMessage } from 'react-intl';

import VisuallyHidden from '@atlaskit/visually-hidden/visually-hidden';

import type { EmojiDescription } from '../../types';
import { messages } from '../i18n';

export const DeletableEmojiTooltipContentForScreenReader: any = ({
	emoji,
}: {
	emoji: EmojiDescription;
}): React.JSX.Element => {
	return (
		<VisuallyHidden id={`screenreader-emoji-${emoji.id!}`}>
			<FormattedMessage
				{...messages.deleteEmojiTooltipForScreenreader}
				values={{ shortName: emoji.shortName }}
			/>
		</VisuallyHidden>
	);
};
