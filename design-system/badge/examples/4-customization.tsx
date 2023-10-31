import React from 'react';

import { N0, P500, P75, R300 } from '@atlaskit/theme/colors';

import Badge from '../src';

const testId = 'badge';

export default () => {
  return (
    <div>
      <em>
        <Badge
          max={1000}
          style={{ backgroundColor: R300, color: N0 }}
          testId={testId}
        >
          {1001}
        </Badge>
      </em>

      <Badge style={{ backgroundColor: P75, color: P500 }} testId={testId}>
        <strong>10</strong>
      </Badge>
      <Badge testId={testId}>{1}</Badge>
      <Badge appearance="added" testId={testId}>
        {1}
      </Badge>
      <Badge appearance="important" testId={testId}>
        {1}
      </Badge>
      <Badge appearance="primary" testId={testId}>
        {1}
      </Badge>
      <Badge appearance="primaryInverted" testId={testId}>
        {1}
      </Badge>
      <Badge appearance="removed" testId={testId}>
        {1}
      </Badge>
    </div>
  );
};
