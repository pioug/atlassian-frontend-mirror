import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

import { docsText } from '../common';

export default md`
  ### Usage

  Provides a standard way to create a text-based form input.

  ${code`
import TextArea from '@atlaskit/textarea';
  `}

  ${docsText}

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
      props={require('!!extract-react-types-loader!../src/text-area')}
      heading="TextArea Props"
    />
  )}
`;
