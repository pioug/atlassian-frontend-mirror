import React from 'react';
import { md, Example, code, AtlassianInternalWarning } from '@atlaskit/docs';

export default md`
${(<AtlassianInternalWarning />)}

This component is an integration layer between @atlaskit/editor-core and native iOS and Android editors.

  ## Usage

  Use the component in your React app as follows:
  
  ${code`import { MobileEditor } from '@atlaskit/editor-mobile-bridge';`}

  ${(
    <Example
      packageName="@atlaskit/editor-mobile-bridge"
      Component={require('../examples/0-status').default}
      title="Basic"
      source={require('!!raw-loader!../examples/0-status')}
    />
  )}
`;
