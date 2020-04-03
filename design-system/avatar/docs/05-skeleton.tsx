import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`

The \`Skeleton\`component is used for loading states. 

## Usage

${code`import { Skeleton } from '@atlaskit/avatar';`}

${(
  <Example
    packageName="@atlaskit/avatar"
    Component={require('../examples/15-skeleton').default}
    title="Skeleton"
    source={require('!!raw-loader!../examples/15-skeleton')}
  />
)}

${(
  <Props
    heading="Skeleton Props"
    props={require('!!extract-react-types-loader!../src/components/Skeleton')}
  />
)}
`;
