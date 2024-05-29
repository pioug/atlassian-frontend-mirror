import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';
import { token } from '@atlaskit/tokens';

export default md`
${(<AtlassianInternalWarning />)}

# Editor Palettes:

In Editor, colors are stored in ADF for certain user-generated content, such as:
- **Text colors**: \`mark.textColor\`
- **Custom table backgrounds**: \`tableCell.attrs.background\`, \`tableHeader.attrs.background\`
- **Custom panel backgrounds**: \`panel.attrs.panelColor\`

Although stored in hexadecimal format, these colors need to be displayed differently depending on the current product theme, such as light and dark mode.

To support this, this package provides utilities to map hexadecimal colors stored in ADF, to an appropriate design token from the Atlassian Design System.

Theming is only supported on web.

Documentation for design tokens can be found in the [@atlaskit/token package docs](https://atlassian.design/components/tokens/all-tokens)
and [@atlaskit/token package examples](https://atlassian.design/components/tokens/examples) on the Atlassian Design System website.

For ecosystem apps, learn more about tokens and theming in the announcement post in our [developer forums](https://community.developer.atlassian.com/t/start-using-design-tokens-in-your-apps-and-try-dark-theme-in-jira-cloud/64147).
Currently, the top-level theme configuration is only documented for internal use.

## Note on usage

**This package is only intended for displaying ADF documents.**

If you are looking for resources to create a new color palette experience for your product or app,
you can learn more about the available accent color tokens in the [Design Token guidelines](https://atlassian.design/foundations/color-new/#color-roles),
or reach out to the Design System Team via the [Atlassian Developer Community forums](https://community.developer.atlassian.com/tag/editor).

## API documentation

${(
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
  <div style={{ marginTop: token('space.100', '8px') }}>
    <SectionMessage
      title="Design token names and values are an implementation detail."
      appearance="warning"
    >
      <p>
        The names of tokens can change over time, and the values of tokens will
        differ between themes.
      </p>
      <p>
        The exact output of this function is an implementation detail only and
        should only be used when rendering content to the user, on a client with
        a matching major version of <code>@atlaskit/tokens</code>.
      </p>
      <ul>
        <li>
          <strong>DO NOT</strong>: store the output of these functions in any
          user-generated content or back-end.
        </li>
        <li>
          <strong>DO</strong>: store the ADF hex color, and use these utilities
          at render time to display the themed version of the color
        </li>
      </ul>
    </SectionMessage>
  </div>
)}

### \`hexToTextPaletteColor\`

This takes an adf hex color and returns a matching text palette color.

By providing a design token, this enables ADF content to be rendered in new themes such as dark mode.

#### Example usage

${code`
  const cssValue = hexToTextPaletteColor('#FFFFFF');
  //     ^? const cssValue: string
  <div style={{color: cssValue}} />
`}

### \`hexToBackgroundPaletteColor\`

This takes an adf hex color and returns a matching background palette color

By providing a design token, this enables ADF content to be rendered in new themes such as dark mode.

#### Example usage

${code`
  const cssValue = hexToBackgroundPaletteColor('#FFFFFF');
  //     ^? const cssValue: string
  <div style={{backgroundColor: cssValue}} />
`}

### \`hexToEditorBorderPaletteColor\`

This takes an adf hex color and returns a matching border palette color.

By providing a design token, this enables ADF content to be rendered in new themes such as dark mode.

#### Example usage

${code`
  const cssValue = hexToEditorBorderPaletteColor('#091E4224');
  //     ^? const cssValue: string
  <div style={{border-color: cssValue}} />
`}

`;
