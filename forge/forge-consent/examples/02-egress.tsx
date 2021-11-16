import React from 'react';

import { css } from '@emotion/core';

import { Egress } from '../src';

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
    <Egress defaultIsExpanded addresses={egress.egressPermissions} />
  </div>
);
