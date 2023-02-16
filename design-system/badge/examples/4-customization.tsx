/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import { N0, P500, P75, R300 } from '@atlaskit/theme/colors';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';

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
      <AtlaskitThemeProvider mode="dark">
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
      </AtlaskitThemeProvider>
    </div>
  );
};
