import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  Component which renders a native input[range] element, with atlassian stylings.
  It can be used with just an \`onChange\` handler to respond to value changes, or
  it can be used as a controlled component when it is needed.

  ## Usage

  ${code`import FieldRange from '@atlaskit/range';`}

  ${(
    <Example
      packageName="@atlaskit/range"
      Component={require('../examples/00-basic-example').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic-example')}
    />
  )}

  You can also take full control of the range yourself if you need to manage its state, rather than simply respond to changes.

  ${(
    <Example
      packageName="@atlaskit/range"
      Component={require('../examples/01-basic-example-controlled').default}
      title="Controlled Example"
      source={require('!!raw-loader!../examples/01-basic-example-controlled')}
    />
  )}

  ## Props

  In addition to the props below, we spread all other props provided on to the input
  component. Between this and the innerRef, you should be empowered to take full control
  of any aspect you need to do.

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/Range')}
      heading=""
    />
  )}

`;
