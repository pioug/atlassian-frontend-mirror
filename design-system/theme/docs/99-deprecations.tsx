import React, { FC } from 'react';

import { Example, md, Props } from '@atlaskit/docs';
import Lozenge from '@atlaskit/lozenge';

const Deprecated: FC = ({ children }) => (
  <h2>
    {children}{' '}
    <Lozenge appearance="removed" isBold>
      deprecated
    </Lozenge>
  </h2>
);

export default md`
This package is considered deprecated. The current version (12), will be the last major version of this package before the package as whole is either archived or re-purposed.

${(<Deprecated>AtlaskitThemeProvider</Deprecated>)}

Theme provider is a wrapper component that accepts a 'mode'. This mode is passed down to styled components below it, using the styled components library theme provider, while also providing some defaults.

Native Atlaskit components are set up to have both a 'light' mode and a 'dark' mode, and will respond to this, defaulting to the 'light' mode if no theme is provided.

The AtlaskitThemeProvider should wrap your entire app, to ensure all components are set to the same theme. Mixing dark and light moded components will severely impact accessibility.

${(
  <Example
    packageName="@atlaskit/theme"
    Component={require('../examples/atlaskit-theme-provider').default}
    source={require('!!raw-loader!../examples/atlaskit-theme-provider')}
    title="DEPRECATED AtlaskitThemeProvider"
  />
)}

### AtlaskitThemeProvider Props

${(
  <Props
    heading=""
    props={require('!!extract-react-types-loader!../src/components/atlaskit-theme-provider')}
  />
)}

${(<Deprecated>getTheme()</Deprecated>)}

Returns the current theme based on props. This has been deprecated in favour of simply accessing whatever you need using the \`Consumer\` or \`Theme\` components.

_Due to the fact that this helper was never documented and is now deprecated, we will not document its usage and this only serves as a notice that it will be removed in the future._

${(<Deprecated>themed()</Deprecated>)}

The \`themed()\` function is a way to define a theme for usage exclusively within Styled Component's primitives. Since we're moving to using React Context, this has been deprecated in favour of defining a theme with the \`Theme\` component.

_Due to the fact that this helper was never documented and is now deprecated, we will not document its usage and this only serves as a notice that it will be removed in the future._
`;
