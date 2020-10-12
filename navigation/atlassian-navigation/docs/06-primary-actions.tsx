import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  These actions are to be used with the \`primaryItems\` prop in the \`primaryItems\` of the Atlassian navigation component.

  ## Primary button

  Buttons to be used when navigating through pages in your application,
  or displaying modals,
  drawers,
  etc.

  ${code`
import { PrimaryButton } from '@atlaskit/atlassian-navigation';

<PrimaryButton>Explore</PrimaryButton>;
`}

  ${(
    <Example
      title="Primary button"
      Component={require('../examples/primary-button.tsx').default}
      source={require('!!raw-loader!../examples/primary-button.tsx')}
    />
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/components/PrimaryButton')}
    />
  )}

  ## Primary dropdown button

  Dropdown button to be used when composing with [Popup](/packages/design-system/popup) and [Menu](/packages/design-system/menu).

  ${code`
import { PrimaryDropdownButton } from '@atlaskit/atlassian-navigation';

<PrimaryDropdownButton>Explore</PrimaryDropdownButton>;
`}

  ${(
    <Example
      title="Primary dropdown button"
      Component={require('../examples/primary-dropdown-button.tsx').default}
      source={require('!!raw-loader!../examples/primary-dropdown-button.tsx')}
    />
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/components/PrimaryDropdownButton')}
    />
  )}
`;
