import React from 'react';

import { Flex, xcss } from '@atlaskit/primitives';

export interface BasicFilterContainerProps {}

const basicFilterContainerStyles = xcss({
  paddingLeft: 'space.100',
});

const BasicFilterContainer = ({}: BasicFilterContainerProps) => {
  return (
    <Flex
      xcss={basicFilterContainerStyles}
      gap="space.100"
      testId="clol-basic-filter-container"
    >
      <>{/** TODO: https://product-fabric.atlassian.net/browse/EDM-9486 */}</>
      <>{/** TODO: https://product-fabric.atlassian.net/browse/EDM-9485 */}</>
    </Flex>
  );
};

export default BasicFilterContainer;
