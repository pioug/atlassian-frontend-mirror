import React from 'react';

import { Example, md } from '@atlaskit/docs';

export default md`
  Flag provider creates a flag group and manages flags within single page applications.

  To show flags without using a \`FlagGroup\`, wrap your single page application in a \`FlagProvider\`,
  which provides context to its children.

  Any components within your application can access the function \`showFlags\` from
  the context. This allows you to add a flag to a flag group without having to manage
  the \`FlagGroup\` yourself.\`showFlags\` accepts an object of type \`CreateFlagArgs\` which
  is mostly the same as \`FlagProps\`. The differences are:

  - \`id\` is optional so you don’t have to manage unique ids throughout your application. If you
    don’t want the same flag showing multiple times, provide a unique id.
  - \`isAutoDismiss\` is a boolean that shows an \`AutoDismissFlag\` if set as true.

  The return value of \`showFlags\` is a function that dismisses the flag that was just created.

  ${(
    <Example
      packageName="@atlaskit/flag"
      Component={require('../examples/14-flag-provider').default}
      title="Flag provider"
      source={require('!!raw-loader!../examples/14-flag-provider')}
    />
  )}
`;
