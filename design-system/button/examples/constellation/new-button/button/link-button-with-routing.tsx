import React from 'react';

import { UNSAFE_LINK_BUTTON } from '../../../../src';

type MyRouterLinkConfig = {
  to: string;
  replace?: boolean;
};

const LinkButtonWithRoutingExample = () => {
  return (
    <UNSAFE_LINK_BUTTON<MyRouterLinkConfig>
      href={{
        to: '/about',
        replace: true,
      }}
    >
      Link button
    </UNSAFE_LINK_BUTTON>
  );
};

export default LinkButtonWithRoutingExample;
