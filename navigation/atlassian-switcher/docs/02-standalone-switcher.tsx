import React from 'react';
import { md, code, Example } from '@atlaskit/docs';

export default md`

  To implement the switcher in any container other than the drawer, specify the appearance property to be standalone.
 
  ${code`import AtlassianSwitcher  from '@atlaskit/atlassian-switcher';`}

  ${(
    <Example
      packageName="@atlaskit/atlassian-switcher"
      Component={require('../examples/11-standalone-switcher').default}
      title="Standalone switcher example"
      source={require('!!raw-loader!../examples/11-standalone-switcher')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/atlassian-switcher"
      Component={
        require('../examples/12-standalone-switcher-in-inline-dialog').default
      }
      title="Standalone switcher in inline dialog"
      source={require('!!raw-loader!../examples/12-standalone-switcher-in-inline-dialog')}
    />
  )}
  `;
