import React from 'react';
import { md, Example, code } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
  ## 9.x -> 10.x 

  ${(
    <SectionMessage
      title="@ataskit/checkbox 10.x Upgrade Guide"
      appearance="info"
    >
      {md`
        **\`Checkbox 10.0\`** introduces theming to Checkbox through two new props – \`theme\` and \`overrides\`.

        - **\`theme\`** allows you to override the internal **component tokens** of Checkbox to make **easy appearance changes** .
        - **\`overrides\`** provides more control, allowing you to apply **custom CSS** to certain internal components; replace these same components wholesale with custom ones; or just spread props down to their underlying elements.
      `}
    </SectionMessage>
  )}

  @atlaskit/checkbox 10.x includes the following changes: 
  * Replaced previous theme implementation with new @atlaskit/theme v2 implementation 
    * Please read more about this implementation in the [theming guide](https://atlaskit.atlassian.com/packages/core/checkbox/docs/theming-guide)
  * Added overrides prop which enables targeted customisations of key components in the @atlaskit/checkbox package. 
    * Please read more about this implementation in the [overrides guide](https://atlaskit.atlassian.com/packages/core/checkbox/docs/overrides-guide)

  ### Breaking Changes
  *HiddenCheckbox and spread props*

  Passing props to the Checkbox component for them to be spread onto the underlying HiddenCheckbox component is now no longer possible. 
  @atlaskit/checkbox still supports passing props down to the HiddenCheckbox component, however we've opted to make this behaviour more explicit.
  
  Whereas previously you would do this: 
  ${code`
  <Checkbox 
    ...supportedCheckboxProps
    'data-testid'='test-checkbox' 
  />
  `}

  Now you would leverage the overrides prop to pass these props down to the HiddenCheckbox component like so:
  ${code`
  <Checkbox
    ...supportedCheckboxProps
    overrides={{
      HiddenCheckbox:{
        attributesFn: () => ({ 'data-testid': 'test-checkbox' })
      }
    }}
  />
  `}

  While this may be more code, with the introduction of the overrides prop, users have more granular control over how custom props
  are passed down to components, for more detail on this, please see the [overrides guide](https://atlaskit.atlassian.com/packages/core/checkbox/docs/overrides-guide).

  *Theme*
  @atlaskit/checkbox 10.x implements a new version of the @atlaskit/theme api, if you were leveraging the previous theme mechanism, note that this will be a breaking change for you.
  For detail on how to use the new theme implementation in @atlaskit/checkbox, please see the [theming guide](https://atlaskit.atlassian.com/packages/core/checkbox/docs/theming-guide).
  

  ## 4.x -> 5.x
  @atlaskit/checkbox 5.x is part of an ongoing body of work to normalise atlaskit form components.
  There are a few breaking changes you need to be aware of in upgrading from 4.x to 5.x.

  ## Exports
  @atlaskit/checkbox no longer specifies the Checkbox component as the default export.
  Moreover the following changes have been made to exports from the @atlaskit/checkbox package.

  ### Checkbox:
  Checkbox is now a **named** export of the @atlaskit/checkbox package. Please import it as below.

  ${code`import { Checkbox } from @atlaskit/checkbox;`}

  The Checkbox component is now a conditionally controlled component, the **isChecked** prop is exposed for users to control the checked state of the component.
  This was the sole reason for having the CheckboxStateless component in pre 5.x, and as a result leveraging this pattern allows us to do away with the CheckboxStateless component.

  ${(
    <Example
      packageName="@atlaskit/checkbox"
      Component={require('../examples/01-controlled').default}
      title="Controlled"
      source={require('!!raw-loader!../examples/01-controlled')}
    />
  )}

  To let the component take care of checked state, leave the isChecked prop unset, or explicitly set it to undefined.

  ${(
    <Example
      packageName="@atlaskit/checkbox"
      Component={require('../examples/02-uncontrolled').default}
      title="Uncontrolled"
      source={require('!!raw-loader!../examples/02-uncontrolled')}
    />
  )}


  Additionally, one can control the initial checked state of a component by setting the **defaultChecked** (boolean) prop.
  This is used as the initial value of the internal 'isChecked' property in state. This value will be overridden by additional user interactions with the component.

  ${(
    <Example
      packageName="@atlaskit/checkbox"
      Component={require('../examples/05-default-checked').default}
      title="Default Checked"
      source={require('!!raw-loader!../examples/05-default-checked')}
    />
  )}

  ### CheckboxStateless

  ${(
    <SectionMessage title="Deprecated Component" appearance="error">
      {
        'This component has been deprecated in favor of the conditionally controlled component pattern specified above.**'
      }
    </SectionMessage>
  )}

  ### CheckboxGroup:

  ${(
    <SectionMessage title="Deprecated Component" appearance="error">
      {`
        @atlaskit/checkbox no longer exports a CheckboxGroup component. It has been removed for the following reasons:
        - It was really a thin wrapper enforcing very basic styling opinions over its children (display: flex, flex: column)
        - The existing styling blocks the horizontal display of checkbox group children.
      `}
    </SectionMessage>
  )}

  If you were previously using CheckboxGroup, you can replace your CheckboxGroup component with a simple flex wrapper, see the example below:

  ${(
    <Example
      packageName="@atlaskit/checkbox"
      Component={require('../examples/06-checkbox-groups').default}
      title="Checkbox Groups"
      source={require('!!raw-loader!../examples/06-checkbox-groups')}
    />
  )}

  ### CheckboxIcon:

  ${code`import { CheckboxIcon } from @atlaskit/checkbox;`}

  @atlaskit/checkbox now also exports a CheckboxIcon component, this is a functional wrapper around the @atlaskit/icon/glyph/checkbox svg,
  and is intended to be consumed in cases where a user wants a presentational checkbox inline with ADG3, without the Label and additional form markup.
  See the CheckboxSelect in @atlaskit/select for an example use case.


  ## Prop Changes
  ### Checkbox
  **initiallyChecked** renamed to **defaultChecked**
  **label** prop now accepts type Node instead of type string.
  **isChecked** is now an optional boolean prop on the Checkbox component.
`;
