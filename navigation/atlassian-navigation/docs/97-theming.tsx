import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  Theming is enabled via the \`theme\` prop in the parent [Atlassian navigation](atlassian-navigation) component.

  ${code`
import {
  generateTheme,
  AtlassianNavigation
} from '@atlaskit/atlassian-navigation';

const theme = generateTheme({
  name: 'high-contrast',
  backgroundColor: '#272727',
  highlightColor: '#E94E34',
});

<AtlassianNavigation
  theme={theme}
  ...
/>
`}

  ${(
    <Example
      title="Themed navigation"
      Component={require('../examples/themed-navigation').default}
      source={require('!!raw-loader!../examples/themed-navigation')}
    />
  )}

  ## \`generateTheme({})\`

  Will return a theme function for you to pass into the Atlassian navigation component.
  Ensures all colors including text have an accessible contrast.

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/theme/themeGenerator')}
    />
  )}
`;
