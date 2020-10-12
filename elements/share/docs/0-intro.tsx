import {
  code,
  Example,
  md,
  Props,
  AtlassianInternalWarning,
  DevPreviewWarning,
} from '@atlaskit/docs';

import React from 'react';

export default md`
  ${(
    <>
      <div style={{ marginBottom: '0.5rem' }}>
        <AtlassianInternalWarning />
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <DevPreviewWarning />
      </div>
    </>
  )}

  This package provides the view components allowing users to share a resource by
  sharing with User Picker, or by copying the share link.
  
  The goal is to provide a consistent share experience across products.
  
  ## Usage 
  
  Import the component in your React app as follows:
  
  ${code`import ShareDialogContainer from '@atlaskit/share;`}
  
  ${(
    <Example
      packageName="@atlaskit/share"
      Component={require('../examples/00-integration-with-configs').default}
      title="Example"
      source={require('!!raw-loader!../examples/00-integration-with-configs')}
    />
  )}
 
  ${(
    <Props
      heading="Share Props"
      props={require('!!extract-react-types-loader!../src/components/ShareDialogContainer')}
    />
  )}
  
  ## Notes
  
  The share modal will be instantiated immediately but starts hidden.
  It will **retain the form state** until the user either:
  - triggers a share = share completed
  - presses Esc = share cancelled

  A click outside the modal will hide it, **but the form state will be retained** (as long as the share is not cancelled).
`;
