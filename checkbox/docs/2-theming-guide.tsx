import React from 'react';
import { md, Example, code } from '@atlaskit/docs';

export default md`
## ✨ Component Tokens ✨
**\`Checkbox\`** now uses *component tokens* as a method of storing and applying styles to a component.
All values used in styling the component are stored in a *single object*, split up at the top level into subcomponents.

A portion of the Checkbox component token set is shown below:

${code`const componentTokens: ComponentTokens = {
  label: {
    textColor: {
      rest: { light: string, dark: string },
      disabled: { light: string, dark: string },
    },
    spacing: {...},
  },
  icon: {...},
  requiredIndicator: {...},
};`}

You can view the full set of component tokens [here](http://atlaskit.atlassian.com/packages/core/checkbox/docs/component-tokens).

Internally, these tokens are used by Emotion to generate the component's CSS; they can be moddified using the \`theme\` prop. After this, further CSS can be applied on top using the \`styles\` prop.

## Theming a Checkbox with the \`theme\` prop

The \`theme\` prop allows in-depth customisation of common properties inside of Checkbox. Internally, Checkbox uses **component tokens** to store and apply styles, and theming Checkbox involves modifying this token set and setting new values. 

The example below demonstrates how label spacing and box size can be customised:

${(
  <Example
    packageName="@atlaskit/checkbox"
    Component={require('../examples/08-theming').default}
    title="Replacing component tokens with the theme prop"
    source={require('!!raw-loader!../examples/08-theming')}
  />
)}

### Methods for applying the theme prop
There are **two approaches** to defining a custom checkbox. 
The first is to wrap our component in a ThemeProvider provided by the package:

${code`
import React from 'react';
import Checkbox, { Theme as CheckboxTheme } from '@atlaskit/checkbox';

// define a customTheme function

<CheckboxTheme.Provider value={customTheme}>
  <Checkbox label="both of these"/>
  <Checkbox label="will receive custom styling"/>
</CheckboxTheme.Provider>
`}

The second approach is to pass in theme customisations to the \`theme\` prop of the component:

${code`
import React from 'react';
import Checkbox from '@atlaskit/checkbox';

// define a customTheme function

export default (props) => (
  <Checkbox
    {...props}
    theme={customTheme}
    }}
  />
);
`}

### Building the theme prop

In both cases, Checkbox's \`theme\` prop and the \`value\` prop of the Checkbox ThemeProvider expects a theming function. 
This function should have the following signature:

\`theme: (current, props) => ThemeTokens\`

Where:
- **current** is either the default theme function, or the theme function passed down from a Checkbox ThemeProvider in upper scope. 
- **props** is the set of props passed into Checkbox

How exactly the default props are modified is up to you; a common implementation is used in the example above, and follows 3 steps.
### 2 - Import types:
Before you start, please import the following two types from the @atlaskit/checkbox package:
* ComponentTokens: This is the type interface for the component tokens object that defines themed values.
* ThemeFn: This is the type interface for the \`theme\` prop or \`value\` prop passed into the Checkbox component or Checkbox ThemeProvider respectively.

${code`
import { ComponentTokens, ThemeFn } from '@atlaskit/checkbox/types;
`}

#### 1 – Create your custom token set:

Create an object that contains a subset of values from the standard Tokens set. An example is shown below:

${code`
const newThemeTokens: ComponentTokens = {
  label: {
    spacing: {
      top: '6px',
      bottom: '6px',
    },
  },
  icon: {
    size: 'large',
  }
},`}

#### 2 – Create the \`theme\` function:

In the basic case, we just want to apply our new tokens over the top of the current token set, keeping any tokens we haven't specified untouched. This can be performed using an _object merge_ operation; Lodash provides one such function.

${code`
const customTheme: ThemeFn = (
current: (props,
{ tokens, mode },
) => {
const mergedTokens = merge(tokens, newThemeTokens);
return current({ tokens: mergedTokens, mode });
};
`}

#### 3 - Pass into \`theme\` prop and render

Finally, once the custom theme function has been defined, pass it into Checkbox using the \`theme\` prop, or using \`context\`

${code`export default () => <Checkbox label="Remember me" theme={customTheme} />;`}

With that, you have a themed Checkbox.
`;
