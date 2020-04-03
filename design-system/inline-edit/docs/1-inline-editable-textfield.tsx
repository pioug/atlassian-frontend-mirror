import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  The inline editable textfield component switches between displaying text, and displaying
  an editable textfield. The component is designed for ease of use in common situations.

  If you are looking for an inline editable component which allows custom definition of the reading and
  editing view, please see the [InlineEdit component](/packages/core/inline-edit).

  ## Usage

  ${code`
  import { InlineEditableTextfield } from '@atlaskit/inline-edit';
  `}

  ${(
    <Example
      packageName="@atlaskit/inline-edit"
      Component={require('../examples/04-inline-editable-textfield').default}
      title="Inline editable textfield"
      source={require('!!raw-loader!../examples/04-inline-editable-textfield')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/InlineEditableTextfield')}
      heading="InlineEditableTextfield Props"
    />
  )}
`;
