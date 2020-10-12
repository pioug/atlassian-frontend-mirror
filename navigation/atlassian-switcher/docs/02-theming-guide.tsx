import React from 'react';
import { md, code, Example } from '@atlaskit/docs';
import details from './switcher-theming.png';

export default md`
  The switcher supports a simple set of customizations through the atlaskit theming api. The following properties are exposed:
  - primaryTextColor: text color used on the main text of each item
  - secondaryTextColor: text color used on the secondary text of some items
  - primaryHoverBackgroundColor: background color used on hover state for top level and child items
  - secondaryTextColor: background color used on passive hover state for top level and default background for child items

  ### Spec
  ${(<img src={details} />)}

  ### Usage
  ${code`
  // MyComponent.js
  import React from 'react';
  import Switcher from '@atlaskit/atlassian-switcher"';

  export default (props) => {
    const myTheme = {
      primaryTextColor: '#000080',
      secondaryTextColor: '#03396c',
      primaryHoverBackgroundColor: '#ccffff',
      secondaryHoverBackgroundColor: '#e5ffff',
    };

    return (
      <Switcher
        {...props}
        theme={myTheme}
      />
    );
  }
  `}

  ### Examples

  ${(
    <Example
      packageName="@atlaskit/atlassian-switcher"
      Component={require('../examples/22-themed-switcher-standalone').default}
      title="Standalone switcher with green theme"
      source={require('!!raw-loader!../examples/22-themed-switcher-standalone')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/atlassian-switcher"
      Component={
        require('../examples/23-themed-switcher-in-inline-dialog').default
      }
      title="Themed standalone switcher in inline dialog"
      source={require('!!raw-loader!../examples/23-themed-switcher-in-inline-dialog')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/atlassian-switcher"
      Component={require('../examples/21-themed-switcher').default}
      title="Generic themed switcher"
      source={require('!!raw-loader!../examples/21-themed-switcher')}
    />
  )}

  ### Theme builder (optimised for full screen use)

  ${(
    <Example
      packageName="@atlaskit/atlassian-switcher"
      Component={require('../examples/20-theme-builder').default}
      title="Generic themed switcher"
      source={require('!!raw-loader!../examples/20-theme-builder')}
    />
  )}
  
`;
