import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  Footer for the side navigation that is composed of navigation footer and footer components.
  Like the header if you pass an interactive element as the custom component to the footer it will appear interactive.

  ${code`
import { NavigationFooter, Footer } from '@atlaskit/side-navigation';

<NavigationFooter>
  <Footer>My footer</Footer>
</NavigationFooter>
  `}

  ${(
    <Example
      title=""
      Component={require('../examples/navigation-footer.tsx').default}
      source={require('!!raw-loader!../examples/navigation-footer.tsx')}
    />
  )}

  ${(
    <Props
      heading="Navigation footer props"
      props={require('!!extract-react-types-loader!../src/components/NavigationFooter')}
    />
  )}

  ${(
    <Props
      heading="Footer props"
      props={require('!!extract-react-types-loader!../src/components/Footer')}
    />
  )}
`;
