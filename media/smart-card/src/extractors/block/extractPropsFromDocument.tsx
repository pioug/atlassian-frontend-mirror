import React from 'react';
import { FormattedRelative } from 'react-intl';

import { BlockCardResolvedViewProps } from '@atlaskit/media-ui';
import { extractPropsFromObject } from './extractPropsFromObject';
import ChatIcon from '@atlaskit/icon/glyph/comment';
import { N600 } from '@atlaskit/theme/colors';
import { getIconForFileType } from '../../utils';

type Person = {
  name: string;
  icon?: {
    url: string;
  };
};

export function extractPropsFromDocument(
  json: any,
): BlockCardResolvedViewProps {
  const props = extractPropsFromObject(json);
  const iconFromObject = props.icon;
  const icon = getIconForFileType(json['schema:fileFormat']);

  props.icon = icon ? { icon } : iconFromObject;
  props.details = [];

  if (json.commentCount || json['schema:commentCount']) {
    const commentCount = json.commentCount || json['schema:commentCount'];
    const intCommentCount = parseInt(commentCount, 10);

    // Only show the comment count if it's a string or an integer > 0
    if (isNaN(intCommentCount) || intCommentCount) {
      props.details.push({
        icon: (
          <ChatIcon
            label=""
            key="comments-count-icon"
            size="small"
            primaryColor={N600}
          />
        ),
        text: `${commentCount}`,
      });
    }
  }

  // Note: we're relying on the consumers to pass a proper react-intl context that
  // formats relative time according to the spec:
  // https://hello.atlassian.net/wiki/spaces/ADG/pages/195123084/Date+formats+product+1.0+spec

  if (json.updated && json['atlassian:updatedBy']) {
    let lastPerson: Person;

    if (Array.isArray(json['atlassian:updatedBy'])) {
      lastPerson = json['atlassian:updatedBy'].pop();
    } else {
      lastPerson = json['atlassian:updatedBy'];
    }

    props.byline = (
      <span>
        Updated by {lastPerson.name} <FormattedRelative value={json.updated} />
      </span>
    );
  } else if (json.attributedTo) {
    const person = Array.isArray(json.attributedTo)
      ? json.attributedTo.pop()
      : json.attributedTo;

    props.byline = (
      <span>
        Created by {person.name}{' '}
        {json['schema:dateCreated'] && (
          <FormattedRelative value={json['schema:dateCreated']} />
        )}
      </span>
    );
  }

  if (json.image && json.image.url) {
    props.thumbnail = json.image.url;
  }

  return props;
}
