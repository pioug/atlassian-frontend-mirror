import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
  ${(
    <SectionMessage title="Important usage instructions">
      The <a href="section">section component</a> is required to be used to
      ensure spacing around blocks of items exists! Make sure to use it.
    </SectionMessage>
  )}

  Useful when wanting to create a item using a your own component that inherits the look and feel of a menu item.
  Use cases could include using your own router link component for example.

  Your custom component will be given all overflow props passed to the custom item component,
  as well as when using TypeScript will add the custom component props to the root component props type for type safety.

  ${code`
import { CustomItem, CustomItemComponentProps } from '@atlaskit/side-navigation';

const Container = (props: CustomItemComponentProps) => {
  return <span {...props}>{children}</span>;
};

<CustomItem component={Container}>Create article</CustomItem>
  `}

  ${(
    <Example
      title=""
      Component={require('../examples/custom-item.tsx').default}
      source={require('!!raw-loader!../examples/custom-item.tsx')}
    />
  )}

  ${(
    <Props
      heading="Props"
      // We point to the original props object because for some reason ERT can't follow package boundaries.
      props={require('!!extract-react-types-loader!../../../design-system/menu/extract-react-types/custom-item-hack-for-ert')}
    />
  )}
`;
