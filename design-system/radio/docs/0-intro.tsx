import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  ## With Radio Group

  Provides a standard way to select a single option from a list.

  ## Usage

  ${code`
  import { RadioGroup, Radio } from '@atlaskit/radio';
  `}

  @atlaskit/radio exports a controllable RadioGroup component. This
  handles the selection of items for you.

  It accepts a list of options that pass the properties on to a
  Radio component to render.

  ${(
    <Example
      packageName="@atlaskit/radio"
      Component={require('../examples/00-radioDefault').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-radioDefault')}
    />
  )}

  ### defaultValue
  RadioGroup component also exposes a defaultValue prop that allows you to specify the initially checked Radio instantiated within your RadioGroup instance.

  ${(
    <Example
      packageName="@atlaskit/radio"
      Component={require('../examples/03-default-checked-value').default}
      title="defaultValue prop"
      source={require('!!raw-loader!../examples/03-default-checked-value')}
    />
  )}

  ### value
  allows you to override the internally stored value in state, with the passed in value prop.

  ${(
    <Example
      packageName="@atlaskit/radio"
      Component={require('../examples/01-controlled-example').default}
      title="value prop"
      source={require('!!raw-loader!../examples/01-controlled-example')}
    />
  )}

  ### With @atlaskit/form
  @atlaskit/radio is designed to play well with @atlaskit/form.

  ${(
    <Example
      packageName="@atlaskit/radio"
      Component={require('../examples/02-form-example').default}
      title="With a Form"
      source={require('!!raw-loader!../examples/02-form-example')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/RadioGroup')}
      heading="RadioGroup Props"
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../extract-react-types/radio-props')}
      heading="Radio Props"
    />
  )}
`;
