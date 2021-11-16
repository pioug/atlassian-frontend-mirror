import React from 'react';

import { css } from '@emotion/core';

import { AtlassianIcon } from '@atlaskit/logo';
import { B200, B400 } from '@atlaskit/theme/colors';

import { Permission } from '../src';

export const scopes = [
  {
    id: 'read:jira-user',
    name: 'View user information in Jira',
    description:
      'View user information in Jira that you have access to, including usernames, email addresses, and avatars.',
  },
  {
    id: 'read:confluence-content.all',
    name: 'Read all content, including content body (expansions permitted).',
    description:
      'Read all content, including content body (expansions permitted). Note, APIs using this scope may also return data allowed by read:confluence-space.summary. However, this scope is not a substitute for read:confluence-space.summary.',
  },
  {
    id: 'write:confluence-content',
    name: 'Write to the Confluence.',
    description:
      'Permits the creation of pages, blogs, comments and questions.',
  },
  {
    id: 'conversation:confluence:manage',
    name: 'Read and manage conversations.',
    description:
      'This app will be able to do a whole lot of things, including: originate your hair, assemble your airports, correspond your users, hesitate your insects, dominate your stories, accommodate your potatoes, interview your videos, allocate your photos, formulate your imagination, entitle your storage, facilitate your policies, operate your farmers, modify economics, implement your complaints, clarify your homework, concentrate your revolution',
  },
  {
    id: 'global:storage',
    name: 'Read and write to storage.',
    description: 'Permit to access read and write to storage.',
  },
  {
    id: 'read:component:compass',
    name: 'Read Compass components.',
    description: 'Permit to read from Compass components.',
  },
];

export const [readJiraPermission] = scopes;

export default () => (
  <div
    css={css`
      width: 600px;
    `}
  >
    <Permission
      defaultIsExpanded
      title={readJiraPermission.name}
      icon={
        <AtlassianIcon
          size="small"
          iconColor={B200}
          iconGradientStart={B400}
          iconGradientStop={B200}
        />
      }
    >
      {readJiraPermission.description}
    </Permission>
  </div>
);
