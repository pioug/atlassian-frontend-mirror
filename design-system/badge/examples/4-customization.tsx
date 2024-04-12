import React from 'react';

import { N0, P500, P75, R300 } from '@atlaskit/theme/colors';

import Badge from '../src';

export default () => {
  return (
    <div>
      <Badge
        max={1000}
        style={{ backgroundColor: R300, color: N0 }}
        testId="badge"
      >
        {1001}
      </Badge>

      <Badge style={{ backgroundColor: P75, color: P500 }}>
        <strong>10</strong>
      </Badge>
      <Badge>{1}</Badge>
      <Badge appearance="added">{1}</Badge>
      <Badge appearance="important">{1}</Badge>
      <Badge appearance="primary">{1}</Badge>
      <Badge appearance="primaryInverted">{1}</Badge>
      <Badge appearance="removed">{1}</Badge>
    </div>
  );
};
