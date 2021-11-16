import React from 'react';

import { css } from '@emotion/core';

import { AppPermissionsGroup } from '../src';

const appPermissions = [
  {
    service: 'jira',
    scopes: [
      {
        action: 'read',
        entities: ['issue', 'project'],
        descriptions: ['Read jira issue', 'Read jira project'],
        ids: ['read:issue:jira', 'read:project:jira'],
      },
      {
        action: 'write',
        entities: ['issue', 'project', 'dashboard'],
        descriptions: [
          'Create or Update issue',
          'Update jira project information',
          'Update jira dashboard',
        ],
        ids: ['write:issue:jira', 'write:project:jira'],
      },
      {
        action: 'search',
        entities: ['issue'],
        descriptions: ['Search for an issue'],
        ids: ['search:issue:jira'],
      },
    ],
  },
  {
    service: 'confluence',
    scopes: [
      {
        action: 'write',
        entities: ['comment'],
        descriptions: ['Update or create comment'],
        ids: ['search:issue:jira'],
      },
      {
        action: 'read',
        entities: ['space'],
        descriptions: ['Read space and pages'],
        ids: ['search:issue:jira'],
      },
    ],
  },
  {
    service: 'compass',
    scopes: [
      {
        action: 'global',
        entities: ['storage'],
        descriptions: ['Permit to access read and write to storage.'],
        ids: ['global:storage'],
      },
    ],
  },
  {
    service: 'identity',
    scopes: [
      {
        action: 'read',
        entities: ['me'],
        descriptions: ['Permit to access read user details.'],
        ids: ['global:storage'],
      },
    ],
  },
];

export default () => (
  <div
    css={css`
      width: 600px;
    `}
  >
    <AppPermissionsGroup appPermissions={appPermissions} />
  </div>
);
