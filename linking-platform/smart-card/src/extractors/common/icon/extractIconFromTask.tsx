import React from 'react';

import { IconOpts } from './extractIcon';

import TaskIcon from '@atlaskit/icon-object/glyph/task/16';
import JiraTaskIcon from '@atlaskit/icon-object/glyph/task/16';
import JiraSubTaskIcon from '@atlaskit/icon-object/glyph/subtask/16';
import JiraStoryIcon from '@atlaskit/icon-object/glyph/story/16';
import JiraBugIcon from '@atlaskit/icon-object/glyph/bug/16';
import JiraEpicIcon from '@atlaskit/icon-object/glyph/epic/16';
import JiraIncidentIcon from '@atlaskit/icon-object/glyph/incident/16';
import JiraServiceRequestIcon from '@atlaskit/icon-object/glyph/issue/16';
import JiraChangeIcon from '@atlaskit/icon-object/glyph/changes/16';
import JiraProblemIcon from '@atlaskit/icon-object/glyph/problem/16';

import {
  JIRA_GENERATOR_ID,
  JIRA_TASK,
  JIRA_SUB_TASK,
  JIRA_STORY,
  JIRA_BUG,
  JIRA_EPIC,
  JIRA_INCIDENT,
  JIRA_SERVICE_REQUEST,
  JIRA_CHANGE,
  JIRA_PROBLEM,
  JIRA_CUSTOM_TASK_TYPE,
} from '../../constants';

export const extractIconFromTask = (
  opts: IconOpts,
): React.ReactNode | undefined => {
  // Render Atlaskit icons for all supported Jira issue types.
  const { taskType, provider } = opts;
  const taskLabel = opts.title || 'task';
  const defaultIcon = <TaskIcon label={taskLabel} testId="default-task-icon" />;
  if (
    provider &&
    provider.id === JIRA_GENERATOR_ID &&
    taskType &&
    taskType.id
  ) {
    const taskTypeId = taskType.id;
    const taskTypeName = taskTypeId.split('#').pop();
    switch (taskTypeName) {
      case JIRA_TASK:
        return <JiraTaskIcon label={taskLabel} testId="jira-task-icon" />;
      case JIRA_SUB_TASK:
        return <JiraSubTaskIcon label={taskLabel} testId="jira-subtask-icon" />;
      case JIRA_STORY:
        return <JiraStoryIcon label={taskLabel} testId="jira-story-icon" />;
      case JIRA_BUG:
        return <JiraBugIcon label={taskLabel} testId="jira-bug-icon" />;
      case JIRA_EPIC:
        return <JiraEpicIcon label={taskLabel} testId="jira-epic-icon" />;
      case JIRA_INCIDENT:
        return (
          <JiraIncidentIcon label={taskLabel} testId="jira-incident-icon" />
        );
      case JIRA_SERVICE_REQUEST:
        return (
          <JiraServiceRequestIcon
            label={taskLabel}
            testId="jira-service-request-icon"
          />
        );
      case JIRA_CHANGE:
        return <JiraChangeIcon label={taskLabel} testId="jira-change-icon" />;
      case JIRA_PROBLEM:
        return <JiraProblemIcon label={taskLabel} testId="jira-problem-icon" />;
      case JIRA_CUSTOM_TASK_TYPE:
        return taskType.icon || opts.icon || provider.icon || defaultIcon;
    }
  }
  return defaultIcon;
};
