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

// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19493
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
	const taskLabel = opts.title || 'task';
	// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19493
	const defaultIcon = <TaskIcon label={taskLabel} testId="default-task-icon" />;
	if (provider && provider.id === JIRA_GENERATOR_ID && taskType && taskType.id) {
		const taskTypeId = taskType.id;
		const taskTypeName = taskTypeId.split('#').pop();
		switch (taskTypeName) {
			case JIRA_TASK:
				// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19493
				return <JiraTaskIcon label={taskLabel} testId="jira-task-icon" />;
			case JIRA_SUB_TASK:
				// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19493
				return <JiraSubTaskIcon label={taskLabel} testId="jira-subtask-icon" />;
			case JIRA_STORY:
				// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19493
				return <JiraStoryIcon label={taskLabel} testId="jira-story-icon" />;
			case JIRA_BUG:
				// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19493
				return <JiraBugIcon label={taskLabel} testId="jira-bug-icon" />;
			case JIRA_EPIC:
				// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19493
				return <JiraEpicIcon label={taskLabel} testId="jira-epic-icon" />;
			case JIRA_INCIDENT:
				// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19493
				return <JiraIncidentIcon label={taskLabel} testId="jira-incident-icon" />;
			case JIRA_SERVICE_REQUEST:
				// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19493
				return <JiraServiceRequestIcon label={taskLabel} testId="jira-service-request-icon" />;
			case JIRA_CHANGE:
				// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19493
				return <JiraChangeIcon label={taskLabel} testId="jira-change-icon" />;
			case JIRA_PROBLEM:
				// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19493
				return <JiraProblemIcon label={taskLabel} testId="jira-problem-icon" />;
			case JIRA_CUSTOM_TASK_TYPE:
				return taskType.icon || opts.icon || provider.icon || defaultIcon;
		}
	}
	return defaultIcon;
};
