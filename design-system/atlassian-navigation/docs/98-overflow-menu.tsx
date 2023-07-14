import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  To support viewports of various sizes the primary navigation items supports being moved into an overflow menu.
  Make sure to interact with the overflow menu button in the example below,
  notice the items change appearance when they're inside the overflow menu.

  The overflow menu uses [Menu](/packages/design-system/menu) so make sure to use items from that package else you will get undefined behaviour.

  ${code`
import {
  PrimaryButton,
  PrimaryButtonProps,
  useOverflowStatus
} from '@atlaskit/atlassian-navigation';
import { ButtonItem } from '@atlaskit/menu';

(props: PrimaryButtonProps) => {
  const overflowStatus = useOverflowStatus();

  return overflowStatus.isVisible ? (
    <PrimaryButton {...props} />
  ) : (
    <ButtonItem>{props.children}</ButtonItem>
  );
};
`}

  ${(
    <Example
      title="Overflow menu"
      Component={require('../examples/overflow-menu').default}
      source={require('!!raw-loader!../examples/overflow-menu')}
    />
  )}

  ## \`useOverflowStatus()\`

  Used to get the current visibility of the navigation item.

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/controllers/overflow')}
    />
  )}
`;
