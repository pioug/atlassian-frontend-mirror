import React, { useCallback } from 'react';

import { EventType } from '@atlaskit/jql-editor-common/constants';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import { Action, ActionSubject, ActionSubjectId } from '../../../analytics/constants';
import { JQL_EDITOR_INPUT_ID } from '../../../common/constants';
import { TooltipContent } from '../../../common/styled';
import { useEditorThemeContext } from '../../../hooks/use-editor-theme/useEditorThemeContext';
import { useIntl, useScopedId, useStoreActions } from '../../../state';
import { TooltipTag } from '../../tooltip-tag';
import { BaseExpandToggle } from '../base-expand-toggle';
import { messages } from './messages';

export const ExpandToggle = (): React.JSX.Element => {
	const { expanded, toggleExpanded } = useEditorThemeContext();
	const [, { createAndFireAnalyticsEvent }] = useStoreActions();
	const [editorId] = useScopedId(JQL_EDITOR_INPUT_ID);
	const [intl] = useIntl();

	let message;

	if (expanded) {
		message = intl.formatMessage(messages.collapseTooltip);
	} else {
		message = intl.formatMessage(messages.expandTooltip);
	}

	const onClick = useCallback(() => {
		createAndFireAnalyticsEvent({
			action: Action.CLICKED,
			actionSubject: ActionSubject.BUTTON,
			actionSubjectId: ActionSubjectId.EDITOR_EXPAND,
			eventType: EventType.UI,
			attributes: {
				expanded: !expanded,
			},
		});
		toggleExpanded();
	}, [expanded, createAndFireAnalyticsEvent, toggleExpanded]);

	return (
		<Tooltip
			position={'bottom'}
			content={<TooltipContent>{message}</TooltipContent>}
			tag={TooltipTag}
		>
			<BaseExpandToggle
				expanded={expanded}
				editorId={editorId}
				label={intl.formatMessage(messages.buttonLabel)}
				onClick={onClick}
			/>
		</Tooltip>
	);
};
