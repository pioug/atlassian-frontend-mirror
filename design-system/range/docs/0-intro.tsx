import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  Component which renders a native input[range] element, with atlassian stylings.
  It can be used with just an \`onChange\` handler to respond to value changes, or
  it can be used as a controlled component when it is needed.

  ## Usage

  ${code`import FieldRange from '@atlaskit/range';`}

  ${(
    <Example
      packageName="@atlaskit/range"
      Component={require('../examples/00-basic-example-uncontrolled').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic-example-uncontrolled')}
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

  ## Rate limiting

  It is recommended that if you have an expensive onChange function
  that you rate limit as it will be called on each step when you move
  the range. You can do this in whatever way is best for your use case but
  below is an example with:

  * debouncing - function is called once after it isn't called for a given period
  * throttling - function is only called once in a given period

  ${(
    <Example
      packageName="@atlaskit/range"
      Component={require('../examples/08-rate-limited').default}
      title="Rate limited example"
      source={require('!!raw-loader!../examples/08-rate-limited')}
    />
  )}

  ## Props

  In addition to the props below, we spread all other props provided on to the input
  component. Between this and the innerRef, you should be empowered to take full control
  of any aspect you need to do.

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/range')}
      heading=""
    />
  )}

`;
