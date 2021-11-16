import React from 'react';

import { css } from '@emotion/core';

import { Egress, Scope } from '../src';

import { scopes } from './00-basic';

const permissionsList = [
  '*.google.com',
  'google.com',
  'www.noodle.com',
  'poodle.com',
  '*.yoodle.com',
  'www.woo.dle',
].sort();

const egress = {
  id: 'egressPermissions',
  name: `Share data with ${permissionsList.length} domain${
    permissionsList.length > 1 ? 's' : ''
  } outside of Atlassian.`,
  egressPermissions: permissionsList,
};

export default () => (
  <div
    css={css`
      width: 600px;
    `}
  >
    {scopes.map(scope => (
      <Scope key={scope.id} title={scope.name} id={scope.id}>
        {scope.description}
      </Scope>
    ))}
    <Egress addresses={egress.egressPermissions} />
  </div>
);
