import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`

  Renders inline code snippets and code blocks.

  ## Usage

  ${code`import { AkCode, AkCodeBlock } from '@atlaskit/code`}

  ${(
    <Example
      packageName="@atlaskit/code"
      Component={require('../examples/00-inline-code-basic').default}
      title="Basic"
      highlight="19,24,30,36"
      source={require('!!raw-loader!../examples/00-inline-code-basic')}
    />
  )}

  ${(
    <Props
      heading="Code Props"
      props={require('!!extract-react-types-loader!../src/components/Code')}
    />
  )}

  ${(
    <Props
      heading="CodeBlock Props"
      props={require('!!extract-react-types-loader!../src/components/CodeBlock')}
    />
  )}
`;
