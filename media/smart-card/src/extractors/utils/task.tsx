import React from 'react';

import { LozengeColor, LozengeProps } from '@atlaskit/media-ui';
import DefaultTaskIcon from '@atlaskit/icon-object/glyph/task/16';
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
} from './constants';

const VALID_APPEARANCES: LozengeColor[] = [
  'default',
  'success',
  'removed',
  'inprogress',
  'new',
  'moved',
];
const isValidAppearance = (appearance: any): appearance is LozengeColor => {
  return VALID_APPEARANCES.indexOf(appearance) !== -1;
};

export const buildTaskIcon = (json: any) => {
  // Render Atlaskit icons for all supported Jira issue types.
  const taskType = json['atlassian:taskType'] || json.taskType;
  if (
    json.generator &&
    json.generator['@id'] === JIRA_GENERATOR_ID &&
    taskType &&
    taskType['@id']
  ) {
    const taskTypeId = taskType['@id'];
    const taskTypeName = taskTypeId.split('#').pop();
    const taskLabel = json.name || '';
    switch (taskTypeName) {
      case JIRA_TASK:
        return { icon: <JiraTaskIcon label={taskLabel} /> };
      case JIRA_SUB_TASK:
        return { icon: <JiraSubTaskIcon label={taskLabel} /> };
      case JIRA_STORY:
        return { icon: <JiraStoryIcon label={taskLabel} /> };
      case JIRA_BUG:
        return { icon: <JiraBugIcon label={taskLabel} /> };
      case JIRA_EPIC:
        return { icon: <JiraEpicIcon label={taskLabel} /> };
      case JIRA_INCIDENT:
        return { icon: <JiraIncidentIcon label={taskLabel} /> };
      case JIRA_SERVICE_REQUEST:
        return { icon: <JiraServiceRequestIcon label={taskLabel} /> };
      case JIRA_CHANGE:
        return { icon: <JiraChangeIcon label={taskLabel} /> };
      case JIRA_PROBLEM:
        return { icon: <JiraProblemIcon label={taskLabel} /> };
      case JIRA_CUSTOM_TASK_TYPE:
        return {
          icon: (taskType.icon && taskType.icon.url) ||
            (json.icon && json.icon.url) || (
              <DefaultTaskIcon
                size="small"
                label={json.provider ? json.provider.name : ''}
              />
            ),
        };
    }
  }
  return {
    icon: <DefaultTaskIcon label={json.provider ? json.provider.name : ''} />,
  };
};

export const buildTaskLozenge = (json: any): { lozenge?: LozengeProps } => {
  // The .tag property is used by some consumers
  // to extract information required for the task lozenge.
  // We check this property first to privilege this behaviour e.g.
  // Jira's current implementation of Native Resolving.
  if (json.tag && json.tag.name) {
    const { name, appearance } = json.tag;
    return {
      lozenge: {
        appearance:
          (isValidAppearance(appearance) && appearance) || VALID_APPEARANCES[0],
        text: name,
      },
    };
  }
  // Per the JSON-LD spec, all other tasks should contain status information inside of
  // the .taskStatus JSON tree (Asana, Github, Bitbucket).
  const taskStatus = json['atlassian:taskStatus'];
  if (taskStatus && taskStatus.name) {
    return {
      lozenge: {
        text: taskStatus.name,
        appearance: 'success' as LozengeColor,
      },
    };
  }
  return { lozenge: undefined };
};
