import { code, md } from '@atlaskit/docs';

export default md`

## Theming

Button now supports the updated Theming API. With this API, components can be passed a custom theming function which has access to all of Button's props, as well as the to the original ADG theme.

This means that the custom theme can change appearance based on different props, and even ignore the ADG styling completely. Custom
themes can modify any CSS prop on the button body or the loading spinner.

#### ⚡️ Theming API TLDR:
- **\`Button\`** can take a **\`theme\`** prop, a function called by the theming API to generate and return custom styling. It recieves all of Button's props, as well as the built-in ADG theme for button.
- The **\`theme\` function** can choose to ignore the ADG theme completely, or spread  custom styling on top.
- How the custom styling is retrieved is left up to the user, but a common approach is to define the styling in an **object structure** and fetch using custom logic.
- In use, buttons can be wrapped by a **\`ThemeProvider\`** that has the \`theme\` function passed in, or a component that wraps \`Button\` can be used in place of Button.

### Building a Custom Themed Button

There are two approaches to defining a custom button. The first is to wrap buttons in a ThemeProvider:

${code`
// CustomButton.js
import React from 'react';
import Button, { Theme as ButtonTheme } from '@atlaskit/button';

<ButtonTheme.Provider value={customTheme}>
  <Button> both of these buttons </Button>
  <Button> will recieve custom styling </Button>
</ButtonTheme.Provider>
`}

The second approach is to create a wrapped Button component that passes in all existing props, as well as a custom \`theme\` prop:

${code`
// CustomButton.js
import React from 'react';
import Button from '@atlaskit/button';

export default (props) => (
  <Button
    {...props}
    theme={customTheme}
    }}
  />
);
`}

### Building the theming function

In both cases, Button's \`theme\` prop expects a **theming function**, which is called by the theming API to style Button. \`theme\` should have the following footprint:

${code`
customTheme = (adgTheme, props) => styling
`}

The output of the function, \`styling\`, is an object containing a pair of style objects:
- **\`ButtonStyles\`**, which contains styles for the body of Button.
- **\`SpinnerStyles\`**, which contains styles for the loading spinner.

Button applies these styles directly using Emotion's \`css\` prop - so you have complete control over how these components in Button are rendered.

An example of how the theming function can be implemented is below:

${code`
customTheme = (currentTheme, themeProps) => {
  const { buttonStyles, spinnerStyles } = currentTheme(themeProps);
  return {
    buttonStyles: {
      ...buttonStyles,
      ...extract(buttonTheme, themeProps),
    },
    spinnerStyles,
  };
`}

In most cases, the props of interest will include \`appearance\`, \`state\` and \`mode\` - though any prop in Button can be used (including custom props, if you want to add any to your Button wrapper.).

The \`extract\` function is an arbitrary function that takes Button's props, and generates the required styling. This is up to what your implementation requires.

### Creating styling for Button with an object structure

How the custom styles are determined based on Button's props can vary - for simple changes to Button, the \`theme\` function can return a static object. If defining multiple appearances, or changing something dependent on state, the styles will need to be computed in some function (\`extract\` in this example).

When programmatically defining the styling, a common approach is to use an object structure similar to that listed below:

${code`
import { colors } from '@atlaskit/theme';

const buttonTheme = {
  toolbar: {
    background: {
      default: { light: 'transparent' },
      hover: { light: colors.DN60 },
      active: { light: colors.B75 },
    },
    boxShadowColor: {
      focus: { light: colors.B75 },
    },
    color: {
      default: { light: colors.DN400 },
      hover: { light: colors.DN400 },
      active: { light: colors.B400 },
      disabled: { light: colors.DN100 },
    },
  },
  primary: {
    background: {
      default: { light: colors.B100 },
      hover: { light: colors.B75 },
      active: { light: colors.B200 },
      disabled: { light: colors.DN70 },
    },
    boxShadowColor: {
      focus: { light: colors.B75 },
    },
    color: {
      default: { light: colors.DN30 },
    },
  },
};`}

#### Parsing the object structure

An example of how this structure can be traversed to get the styles for the current combination of props is shown below:

${code`
function extract(newTheme, appearance, state, mode) {
  if (!newTheme[appearance]) return;
  const root = newTheme[appearance];
  return Object.keys(root).reduce((acc, val) => {
    let node = root;
    [val, state, mode].forEach(item => {
      if (!node[item]) return;
      if (typeof node[item] !== 'object') {
        acc[val] = node[item];
        return;
      }
      node = node[item];
      return;
    });
    return acc;
  }, {});
}`}

This example function will explore the tree, and return all styling props with their correct values for the props provided. Note that if a value is not found, no value is returned for that styling prop - and therefore the ADG styling, or no styling, depending on how the \`theme\` function is defined.

## Other theming guidelines
### Dark Mode support

Dark mode support can be added using the API as follows:

${code`
<Button theme={(theme, props) => theme({ ...props, mode: 'dark' })}
  Dark Button
</Button>
`}

### Styled-components support

With the shift to Emotion in \`v12\`, styled-components' \`styled\` function is no longer supported. Emotion's \‘styled\’ function can be used in-place, but as this is not explicitly supported by Button, we recommend using the new theming API instead.

More details on migration can be found in the \`v11\` to \`v12\` upgrade guide.

`;
