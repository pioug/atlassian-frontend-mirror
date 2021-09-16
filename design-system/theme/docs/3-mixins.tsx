import React from 'react';

import { Example, md } from '@atlaskit/docs';

export default md`
  ### Typography

  Heading mixins for [Styled Components](https://www.styled-components.com/).
  If you're using another css-in-js solution you can use \`typography.headingSizes\` instead.
  Refer to the [design documentation](https://atlassian.design/guidelines/product/foundations/typography) for more information.

  ${(
    <Example
      highlight="3,12-20"
      packageName="@atlaskit/theme"
      Component={require('../examples/typography').default}
      source={require('!!raw-loader!../examples/typography')}
      title="Heading mixins"
    />
  )}

  ${(
    <Example
      highlight=""
      packageName="@atlaskit/theme"
      Component={require('../examples/fonts').default}
      source={require('!!raw-loader!../examples/fonts')}
      title="Fonts"
    />
  )}

  ### Elevation

  This will elevate an element (using box-shadow) over varying heights.

  ${(
    <Example
      packageName="@atlaskit/theme"
      Component={require('../examples/elevation').default}
      source={require('!!raw-loader!../examples/elevation')}
      title=""
    />
  )}

  ### Focus ring

  This mixin is deprecated; and is no longer supported. A better alternative is available in ['@atlaskit/focus-ring'](https://atlaskit.atlassian.com/packages/design-system/focus-ring).

  ### Visually hidden

  This mixin is deprecated; and is no longer supported. A better alternative is available in ['@atlaskit/visually-hidden'](https://atlaskit.atlassian.com/packages/design-system/visually-hidden).

`;
