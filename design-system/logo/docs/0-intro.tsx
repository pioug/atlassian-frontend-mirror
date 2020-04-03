import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  Use the logo component to output SVG versions of the company and product logos.

  If you are not using tree-shaking, and are importing logos, you should likely use the
  direct path to the logos file. [This example](./logo/example/getAbsolutePath) will give you
  the exact path you need.

  ## Usage

  ${code`import { AtlassianLogo, AtlassianIcon, AtlassianWordmark } from '@atlaskit/logo';`}

  ${(
    <Example
      packageName="@atlaskit/logo"
      Component={require('../examples/0-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/0-basic')}
    />
  )}

  ${(
    <Props
      heading="Logo Props"
      props={require('!!extract-react-types-loader!../src/AtlassianLogo/Logo')}
    />
  )}

`;
