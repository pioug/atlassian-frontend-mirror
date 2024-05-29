import React from 'react';
import { md, Example, Props, code, DevPreviewWarning } from '@atlaskit/docs';
import { token } from '@atlaskit/tokens';

export default md`
  ${(
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
    <div style={{ margin: token('space.100', '8px') }}>
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
