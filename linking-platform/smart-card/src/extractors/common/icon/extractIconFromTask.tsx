import React from 'react';

import JiraBugIcon from '@atlaskit/icon-object/glyph/bug/16';
import JiraChangeIcon from '@atlaskit/icon-object/glyph/changes/16';
import JiraEpicIcon from '@atlaskit/icon-object/glyph/epic/16';
import JiraIncidentIcon from '@atlaskit/icon-object/glyph/incident/16';
import JiraServiceRequestIcon from '@atlaskit/icon-object/glyph/issue/16';
import JiraProblemIcon from '@atlaskit/icon-object/glyph/problem/16';
import JiraStoryIcon from '@atlaskit/icon-object/glyph/story/16';
import JiraSubTaskIcon from '@atlaskit/icon-object/glyph/subtask/16';
import JiraTaskIcon from '@atlaskit/icon-object/glyph/task/16';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	JIRA_BUG,
	JIRA_CHANGE,
	JIRA_CUSTOM_TASK_TYPE,
	JIRA_EPIC,
	JIRA_GENERATOR_ID,
	JIRA_INCIDENT,
	JIRA_PROBLEM,
	JIRA_SERVICE_REQUEST,
	JIRA_STORY,
	JIRA_SUB_TASK,
	JIRA_TASK,
} from '../../constants';

import { type IconOpts } from './extractIcon';

const TaskIcon = JiraTaskIcon;

/**
 * Chooses an icon for a task based on the provided options.
 *
 * Chooses icon based on variety of Jira task types, based on opts.taskType.id
 *
 * @param opts - The options for extracting the icon.
 * @returns The React node representing the extracted icon, or `undefined` if no icon is found.
 */
export const extractIconFromTask = (opts: IconOpts): React.ReactNode | undefined => {
	// Render Atlaskit icons for all supported Jira issue types.
	const { taskType, provider } = opts;
	const legacyTaskLabel = opts.title || 'task';
	const getLabel = (semantic: string) =>
		fg('platform_navx_smart_link_icon_label_a11y') ? semantic : legacyTaskLabel;

	const defaultIcon = <TaskIcon label={getLabel('Task')} testId="default-task-icon" />;
	if (provider && provider.id === JIRA_GENERATOR_ID && taskType && taskType.id) {
		const taskTypeId = taskType.id;
		const taskTypeName = taskTypeId.split('#').pop();
		switch (taskTypeName) {
			case JIRA_TASK:
				return <JiraTaskIcon label={getLabel('Task')} testId="jira-task-icon" />;
			case JIRA_SUB_TASK:
				return <JiraSubTaskIcon label={getLabel('Sub-task')} testId="jira-subtask-icon" />;
			case JIRA_STORY:
				return <JiraStoryIcon label={getLabel('Story')} testId="jira-story-icon" />;
			case JIRA_BUG:
				return <JiraBugIcon label={getLabel('Bug')} testId="jira-bug-icon" />;
			case JIRA_EPIC:
				return <JiraEpicIcon label={getLabel('Epic')} testId="jira-epic-icon" />;
			case JIRA_INCIDENT:
				return <JiraIncidentIcon label={getLabel('Incident')} testId="jira-incident-icon" />;
			case JIRA_SERVICE_REQUEST:
				return (
					<JiraServiceRequestIcon
						label={getLabel('Service request')}
						testId="jira-service-request-icon"
					/>
				);
			case JIRA_CHANGE:
				return <JiraChangeIcon label={getLabel('Change')} testId="jira-change-icon" />;
			case JIRA_PROBLEM:
				return <JiraProblemIcon label={getLabel('Problem')} testId="jira-problem-icon" />;
			case JIRA_CUSTOM_TASK_TYPE:
				return taskType.icon || opts.icon || provider.icon || defaultIcon;
		}
	}
	return defaultIcon;
};
