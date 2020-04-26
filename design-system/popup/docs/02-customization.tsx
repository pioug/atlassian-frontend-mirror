import React from 'react';

import { Example, md } from '@atlaskit/docs';

export default md`
  Sometimes the default styling for the popup won't suit your needs.
  Maybe you want to create an abstraction that has a different elevation,
  padding,
  or something else entirely.
  Luckily you can do anything you want with it using the \`popupComponent\` prop.

  It's important that you [forward the ref to the underlying DOM node](https://reactjs.org/docs/forwarding-refs.html)!
  Else the positioning of the popup will not work correctly.

  ${(
    <Example
      packageName="@atlaskit/popup"
      Component={require('../examples/custom').default}
      source={require('!!raw-loader!../examples/custom')}
    />
  )}
`;
