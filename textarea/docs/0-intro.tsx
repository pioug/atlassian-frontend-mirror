import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  ### Usage

  Provides a standard way to create a text-based form input.

  ${code`
import TextArea from '@atlaskit/textarea';
  `}

  @atlaskit/textarea exports a default component, that is optionally controllable. To control the component, specify a value prop; to specify the defaultValue but leave the component uncontrolled specify a defaultValue prop.

  ${(
    <Example
      packageName="@atlaskit/textarea"
      Component={require('../examples/0-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/0-basic')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/TextArea')}
      heading="TextArea Props"
    />
  )}
`;
