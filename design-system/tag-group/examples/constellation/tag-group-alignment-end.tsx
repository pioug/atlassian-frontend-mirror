import React from 'react';

import Tag from '@atlaskit/tag';

import TagGroup from '../../src';

export default () => (
  <TagGroup alignment="end">
    <Tag text="Bitbucket" removeButtonLabel="Remove" />
    <Tag text="Compass" removeButtonLabel="Remove" />
    <Tag text="Confluence" removeButtonLabel="Remove" />
    <Tag text="Jira" removeButtonLabel="Remove" />
    <Tag text="Jira Service Management" removeButtonLabel="Remove" />
    <Tag text="Jira Software" />
    <Tag text="Jira Work Management" removeButtonLabel="Remove" />
    <Tag text="Opsgenie" removeButtonLabel="Remove" />
    <Tag text="Statuspage" removeButtonLabel="Remove" />
    <Tag text="Trello" removeButtonLabel="Remove" />
  </TagGroup>
);
