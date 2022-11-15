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
        return <JiraTaskIcon label={taskLabel} />;
      case JIRA_SUB_TASK:
        return <JiraSubTaskIcon label={taskLabel} />;
      case JIRA_STORY:
        return <JiraStoryIcon label={taskLabel} />;
      case JIRA_BUG:
        return <JiraBugIcon label={taskLabel} />;
      case JIRA_EPIC:
        return <JiraEpicIcon label={taskLabel} />;
      case JIRA_INCIDENT:
        return <JiraIncidentIcon label={taskLabel} />;
      case JIRA_SERVICE_REQUEST:
        return <JiraServiceRequestIcon label={taskLabel} />;
      case JIRA_CHANGE:
        return <JiraChangeIcon label={taskLabel} />;
      case JIRA_PROBLEM:
        return <JiraProblemIcon label={taskLabel} />;
      case JIRA_CUSTOM_TASK_TYPE:
        return (
          taskType.icon ||
          opts.icon ||
          provider.icon || <TaskIcon label={taskLabel} />
        );
    }
  }
  return <TaskIcon label={taskLabel} />;
};
