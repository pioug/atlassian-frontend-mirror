import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  A checkbox element primarily for use in forms.

  ## Usage

${code`
import {
  Checkbox,
  CheckboxIcon
} from '@atlaskit/checkbox';
`}

  The Checkbox export provides for controlled & uncontrolled usage and includes the label, input & icon.

  ${(
    <Example
      packageName="@atlaskit/checkbox"
      Component={require('../examples/00-basic-usage').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic-usage')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/checkbox"
      Component={require('../examples/01-controlled').default}
      title="Controlled Checkbox"
      source={require('!!raw-loader!../examples/01-controlled')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/checkbox"
      Component={require('../examples/02-uncontrolled').default}
      title="Uncontrolled"
      source={require('!!raw-loader!../examples/02-uncontrolled')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/checkbox"
      Component={require('../examples/03-indeterminate').default}
      title="Indeterminate"
      source={require('!!raw-loader!../examples/03-indeterminate')}
    />
  )}


  ${(
    <Example
      packageName="@atlaskit/checkbox"
      Component={require('../examples/04-checkbox-form').default}
      title="With a Form"
      source={require('!!raw-loader!../examples/04-checkbox-form')}
    />
  )}

  ${(
    <Props
      heading="Checkbox Props"
      props={require('!!extract-react-types-loader!../src/Checkbox')}
    />
  )}

  ${(
    <Props
      heading="CheckboxIcon Props"
      props={require('!!extract-react-types-loader!../src/CheckboxIcon')}
    />
  )}


`;
