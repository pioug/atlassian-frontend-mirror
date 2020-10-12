import React from 'react';

import {
  AtlassianInternalWarning,
  code,
  Example,
  md,
  Props,
} from '@atlaskit/docs';

export default md`
  ${(<AtlassianInternalWarning />)}
  
  The Mobile Header is a way to render a header that hides the Navigation and Sidebar
  from smaller screens and allows the user to view them by tapping/clicking icons.

  ## Usage

  ${code`import MobileHeader from '@atlaskit/mobile-header';`}

  ${(
    <Example
      packageName="@atlaskit/mobile-header"
      Component={require('../examples/01-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/01-basic')}
    />
  )}

  ${(
    <Props
      heading="Mobile Header Props"
      props={require('!!extract-react-types-loader!../src/components/MobileHeader')}
    />
  )}
`;
