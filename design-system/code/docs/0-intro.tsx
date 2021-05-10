import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`

  ## Usage

  ${code`import { Code, CodeBlock } from '@atlaskit/code'`}

  ${(
    <Example
      language="jsx"
      packageName="@atlaskit/code"
      Component={require('../examples/00-basic').default}
      title="Basic"
      highlight="19,24,30,36"
      source={require('!!raw-loader!../examples/00-basic')}
    />
  )}

  ${(
    <Props
      heading="Code Props"
      props={require('!!extract-react-types-loader!../src/extract-react-types/code')}
    />
  )}

  ${(
    <Props
      heading="CodeBlock Props"
      props={require('!!extract-react-types-loader!../src/extract-react-types/code-block')}
    />
  )}
`;
