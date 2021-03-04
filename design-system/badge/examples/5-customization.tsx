import React from 'react';

import { N0, P500, P75, R300 } from '@atlaskit/theme/colors';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';

import Badge, { Container, Format } from '../src';

const testId = 'badge';

export default () => {
  return (
    <div>
      <Container backgroundColor={R300} textColor={N0} data-testid={testId}>
        <em>
          <Format max={1000}>{1001}</Format>
        </em>
      </Container>
      <Container backgroundColor={P75} textColor={P500} data-testid={testId}>
        <strong>
          <Format max={-1}>{10}</Format>
        </strong>
      </Container>
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
