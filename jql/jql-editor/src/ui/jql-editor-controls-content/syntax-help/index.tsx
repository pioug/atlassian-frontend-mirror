import React, { useCallback } from 'react';

import Tooltip from '@atlaskit/tooltip';

import { ScreenReaderText } from '../../../accessibility';
import { Action, ActionSubject, ActionSubjectId, EventType } from '../../../analytics';
import { SYNTAX_HELP_DESCRIPTION_ID } from '../../../common/constants';
import { TooltipContent } from '../../../common/styled';
import { useIntl, useOnSyntaxHelp, useScopedId } from '../../../state';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { TooltipTag } from '../../tooltip-tag';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { BaseSyntaxHelp } from '../base-syntax-help';

import { messages } from './messages';

export const SyntaxHelp = () => {
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
			// @ts-ignore: [PIT-1685] Fails in post-office due to backwards incompatibility issue with React 18
			tag={TooltipTag}
		>
			<BaseSyntaxHelp describedby={descriptionId} label={label} onClick={onClick} />
			<ScreenReaderText id={descriptionId}>
				{intl.formatMessage(messages.syntaxHelpDescription)}
			</ScreenReaderText>
		</Tooltip>
	);
};
