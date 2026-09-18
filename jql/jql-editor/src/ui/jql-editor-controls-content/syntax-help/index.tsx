import React, { useCallback } from 'react';

import { EventType } from '@atlaskit/jql-editor-common/constants';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import { ScreenReaderText } from '../../../accessibility/styled';
import { Action, ActionSubject, ActionSubjectId } from '../../../analytics/constants';
import { SYNTAX_HELP_DESCRIPTION_ID } from '../../../common/constants';
import { TooltipContent } from '../../../common/styled';
import { useIntl, useOnSyntaxHelp, useScopedId } from '../../../state';
import { TooltipTag } from '../../tooltip-tag';
import { BaseSyntaxHelp } from '../base-syntax-help';
import { messages } from './messages';

export const SyntaxHelp = (): React.JSX.Element => {
	const [intl] = useIntl();
	const label = intl.formatMessage(messages.syntaxHelpTooltip);
	const [descriptionId] = useScopedId(SYNTAX_HELP_DESCRIPTION_ID);
	const [onSyntaxHelp, { createAndFireAnalyticsEvent }] = useOnSyntaxHelp();

	const onClick = useCallback(
		(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
			createAndFireAnalyticsEvent({
				action: Action.CLICKED,
				actionSubject: ActionSubject.BUTTON,
				actionSubjectId: ActionSubjectId.EDITOR_HELP,
				eventType: EventType.UI,
			});

			const handled = onSyntaxHelp && onSyntaxHelp(e);
			// Prevent default behaviour when the event is handled on the consumer side.
			if (handled) {
				e.preventDefault();
			}
		},
		[createAndFireAnalyticsEvent, onSyntaxHelp],
	);

	return (
		<Tooltip
			position={'bottom'}
			content={<TooltipContent>{label}</TooltipContent>}
			tag={TooltipTag}
			isScreenReaderAnnouncementDisabled
		>
			<BaseSyntaxHelp describedby={descriptionId} label={label} onClick={onClick} />
			<ScreenReaderText id={descriptionId}>
				{intl.formatMessage(messages.syntaxHelpDescription)}
			</ScreenReaderText>
		</Tooltip>
	);
};
