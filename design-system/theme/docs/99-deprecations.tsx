import React, { ReactNode } from 'react';
import Lozenge from '@atlaskit/lozenge';
import { md, Example, Props } from '@atlaskit/docs';

const Deprecated = ({ children }: { children: ReactNode }) => (
  <h2>
    {children}{' '}
    <Lozenge appearance="removed" isBold>
      deprecated
    </Lozenge>
  </h2>
);

export default md`
Here you'll find API's that are no longer supported.
Please don't use them.

${(<Deprecated>AtlaskitThemeProvider</Deprecated>)}

Theme provider is a wrapper component that accepts a 'mode'. This mode is passed down to styled components below it, using the styled components library theme provider, while also providing some defaults.

Native Atlaskit components are set up to have both a 'light' mode and a 'dark' mode, and will respond to this, defaulting to the 'light' mode if no theme is provided.

The AtlaskitThemeProvider should wrap your entire app, to ensure all components are set to the same theme. Mixing dark and light moded components will severely impact accessibility.

${(
  <Example
    packageName="@atlaskit/theme"
    Component={require('../examples/deprecated-theme-provider').default}
    source={require('!!raw-loader!../examples/deprecated-theme-provider')}
    title="DEPRECATED AtlaskitThemeProvider"
  />
)}

### AtlaskitThemeProvider Props

${(
  <Props
    heading=""
    props={require('!!extract-react-types-loader!../src/components/AtlaskitThemeProvider')}
  />
)}

${(<Deprecated>getTheme()</Deprecated>)}

Returns the current theme based on props. This has been deprecated in favour of simply accessing whatever you need using the \`Consumer\` or \`Theme\` components.

_Due to the fact that this helper was never documented and is now deprecated, we will not document its usage and this only serves as a notice that it will be removed in the future._

${(<Deprecated>math</Deprecated>)}

Exports of curried functions that do math operations in styled component primitives. They have been deprecated in favour of performing your own mathematical operations using plain JavaScript.

_Due to the fact that this helper was never documented and is now deprecated, we will not document its usage and this only serves as a notice that it will be removed in the future._

${(<Deprecated>themed()</Deprecated>)}

The \`themed()\` function is a way to define a theme for usage exclusively within Styled Component's primitives. Since we're moving to using React Context, this has been deprecated in favour of defining a theme with the \`Theme\` component.

_Due to the fact that this helper was never documented and is now deprecated, we will not document its usage and this only serves as a notice that it will be removed in the future._
`;
