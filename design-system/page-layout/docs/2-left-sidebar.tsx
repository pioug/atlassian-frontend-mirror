import React from 'react';

import { Example, md } from '@atlaskit/docs';

export default md`

## Left Sidebar

The Left Sidebar houses the all navigation components for the current space a user is in.
It lets a user choose to resize and/or collapse/expand the sidebar allowing a user to get more screen
space to do work and for a certain level of personalisation.

## Behaviour

The Left Sidebar:
- can be resized using mouse or keyboard
- can be expanded/collapsed using mouse or keyboard
- has Flyout feature when hovering over collapsed sidebar to quickly see navigation items

You can see the Left Sidebar can be resized and even collapsed to give more screen space to the main content:

${(
  <div style={{ contain: 'content' }}>
    <Example
      packageName="@atlaskit/page-layout"
      Component={require('../examples/03-integration-example').default}
      title="Left Sidebar"
      source={require('!!raw-loader!../examples/03-integration-example')}
    />
  </div>
)}

### Accessibility
The Left Sidebar uses appropriate accessibility APIs to let users with assistive technologies interact with the Left Sidebar.
`;
