import React from 'react';
import { md, Example, Props, code, DevPreviewWarning } from '@atlaskit/docs';

export default md`
  ${(
    <div style={{ margin: '0.5rem' }}>
      <DevPreviewWarning />
    </div>
  )}

  ## Usage

  ${code`import { Notifications } from '@atlaskit/atlassian-notifications';`}

  ${(
    <Example
      Component={require('../examples/00-basic-usage').default}
      packageName="@atlaskit/atlassian-notifications"
      source={require('!!raw-loader!../examples/00-basic-usage')}
      title="Basic usage"
    />
  )}

  ${(
    <Props
      heading="Notifications props"
      props={require('!!extract-react-types-loader!../src/Notifications')}
    />
  )}
`;
