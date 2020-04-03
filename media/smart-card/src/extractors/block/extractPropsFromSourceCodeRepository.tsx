import React from 'react';
import { FormattedRelative } from 'react-intl';
import { BlockCardResolvedViewProps } from '@atlaskit/media-ui';
import CodeIcon from '@atlaskit/icon/glyph/code';
import PeopleIcon from '@atlaskit/icon/glyph/people';

import { AlterProps, BuildProps } from './types';

import { extractPropsFromObject } from './extractPropsFromObject';

export type AlterPropsRepository = AlterProps<BlockCardResolvedViewProps>;
export type BuildPropsRepository = BuildProps<BlockCardResolvedViewProps>;

export const buildRepositoryLink: BuildPropsRepository = json => {
  const link = json.url && json.url.trim();
  return link ? { link } : {};
};

export const buildRepositoryTitle: BuildPropsRepository = json => {
  const text = json.name && json.name.trim();
  return text || '';
};

export const buildRepositoryDescription: BuildPropsRepository = json => {
  const text = typeof json.summary === 'string' ? json.summary : undefined;
  return text || '';
};

export const buildRepositoryByline: BuildPropsRepository = json => {
  const attributedTo =
    json.attributedTo && json.attributedTo.name ? json.attributedTo.name : '';
  const dateCreated = json['schema:dateCreated'];
  const dateUpdated = json['updated'];
  const updatedBy =
    json['atlassian:updatedBy'] && json['atlassian:updatedBy'].name;
  if (dateCreated || dateUpdated) {
    return {
      byline: updatedBy ? (
        <span>
          Updated by {updatedBy} <FormattedRelative value={dateUpdated} />
        </span>
      ) : (
        <span>
          Created by {attributedTo} <FormattedRelative value={dateCreated} />
        </span>
      ),
    };
  }

  return {};
};

export const setRepositoryContext: AlterPropsRepository = (props, json) => {
  const nextProps = { ...props };
  if (nextProps.context && json.generator && json.context) {
    nextProps.context.text = `${json.generator.name} / ${json.context.name}`;
  }
  return nextProps;
};

export const setRepositoryDetails: AlterPropsRepository = (props, json) => {
  const nextProps = { ...props };
  if (json['schema:programmingLanguage']) {
    nextProps.details = nextProps.details || [];
    nextProps.details.push({
      text: json['schema:programmingLanguage'],
      icon: <CodeIcon size="small" label="code" />,
    });
  }
  if (json['atlassian:subscriberCount']) {
    nextProps.details = nextProps.details || [];
    nextProps.details.push({
      text: json['atlassian:subscriberCount'],
      icon: <PeopleIcon size="small" label="subscribers" />,
    });
  }
  return nextProps;
};

export function extractPropsFromSourceCodeRepository(
  json: any,
): BlockCardResolvedViewProps {
  let props = extractPropsFromObject(json);

  props = setRepositoryContext(props, json);
  props = setRepositoryDetails(props, json);

  return {
    ...buildRepositoryLink(json),
    ...buildRepositoryTitle(json),
    ...buildRepositoryDescription(json),
    ...buildRepositoryByline(json),
    ...props,
  };
}
