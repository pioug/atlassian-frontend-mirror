import React from 'react';
import { BlockCardResolvedViewProps } from '@atlaskit/media-ui';
import ChatIcon from '@atlaskit/icon/glyph/comment';
import { N600 } from '@atlaskit/theme/colors';
import { FormattedRelative } from 'react-intl';

import { buildTaskIcon, buildTaskLozenge } from '../utils/task';

export const buildTaskTitle = (json: any) => {
  let name = json.name && json.name.trim();
  return { title: name || '' };
};

export const buildTaskDescription = (json: any) => {
  const summary = json.summary && json.summary.trim();
  return { description: summary || '' };
};

export const buildTaskLink = (json: any) => {
  const url = json.url && json.url.trim();
  return { link: url };
};

export const buildTaskByline = (json: any) => {
  const updatedBy =
    json.updatedBy && json.updatedBy.name ? ' by ' + json.updatedBy.name : '';

  const attributedTo =
    json.attributedTo && json.attributedTo.name
      ? ' by ' + json.attributedTo.name
      : '';

  if (json.dateCreated || json.updated) {
    return {
      byline: json.updated ? (
        <span>
          Updated {updatedBy} <FormattedRelative value={json.updated} />
        </span>
      ) : (
        <span>
          Created {attributedTo} <FormattedRelative value={json.dateCreated} />
        </span>
      ),
    };
  }

  return {};
};

export const buildTaskUsers = (json: any) => {
  if (Array.isArray(json.assignedTo) && json.assignedTo.length > 0) {
    return {
      users: json.assignedTo.map((assignee: any) => ({
        icon: assignee.image,
        name: assignee.name,
      })),
    };
  }
  return {};
};

export const buildTaskCommentCount = (json: any) => {
  const commentCount = json.commentCount || json['schema:commentCount'];
  if (!isNaN(Number(commentCount)) && Number(commentCount) > 0) {
    return {
      icon: (
        <ChatIcon
          label=""
          key="comments-count-icon"
          size="small"
          primaryColor={N600}
        />
      ),
      text: String(commentCount),
    };
  }
  return undefined;
};

export const buildTaskDetails = (json: any) => {
  if (json['atlassian:taskStatus'] || json.commentCount) {
    const details = [];
    const taskCommentCount = buildTaskCommentCount(json);
    if (taskCommentCount) {
      details.push(taskCommentCount);
    }
    return { details };
  }
  return { details: [] };
};

export const buildTaskContext = (json: any) => {
  const genName =
    json.generator && json.generator.name && json.generator.name.trim();
  if (genName) {
    let additional =
      (json.context &&
        json.context.name &&
        json.context.name.trim() &&
        ` / ${json.context.name.trim()}`) ||
      '';
    return {
      context: {
        text: genName + additional,
        icon:
          json.generator.icon && json.generator.icon.url
            ? json.generator.icon.url
            : json.generator.icon,
      },
    };
  }
  return {};
};

export function extractPropsFromTask(json: any): BlockCardResolvedViewProps {
  if (!json) {
    throw new Error('smart-card: data is not parsable JSON-LD.');
  }

  const props = {
    ...{ icon: buildTaskIcon(json) },
    ...buildTaskContext(json),
    ...buildTaskTitle(json),
    ...buildTaskDescription(json),
    ...buildTaskLink(json),
    ...buildTaskByline(json),
    ...buildTaskUsers(json),
    ...buildTaskDetails(json),
    ...buildTaskLozenge(json),
  };

  return props;
}
