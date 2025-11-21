import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import { IconButton } from '@atlaskit/button/new';
import EditorMoreIcon from '@atlaskit/icon/core/migration/show-more-horizontal--editor-more';
import Tooltip from '@atlaskit/tooltip';
import { messages } from '../shared/i18n';

/**
 * Test id for wrapper button
 */
export const RENDER_SHOWMORE_TESTID = 'show-more-button';

export interface ShowMoreProps {
	/**
	 * Optional mouse click DOM event on showing more emoji icon
	 */
	onClick?: React.MouseEventHandler<HTMLElement>;
}

/**
 * Show more custom emojis button
 */
export const ShowMore = ({ onClick }: ShowMoreProps): React.JSX.Element => {
	return (
		<FormattedMessage {...messages.moreEmoji}>
			{(message) => (
				<Tooltip content={message}>
					<IconButton
						label={message}
						onClick={onClick}
						testId={RENDER_SHOWMORE_TESTID}
						icon={EditorMoreIcon}
						appearance="subtle"
					/>
				</Tooltip>
			)}
		</FormattedMessage>
	);
};
