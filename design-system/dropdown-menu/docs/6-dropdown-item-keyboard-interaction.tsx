import React from 'react';

import { code, Example, md } from '@atlaskit/docs';

export default md`
  You can use keyboard arrow keys to select dropdown items. You can also click
  the item by pressing **Enter** or **Space** key.

  **Edge Cases**:

  - When opening a modal dialog from a dropdown menu you may notice that it immediately
   interacts with the first focused element in the modal dialog. We can work around it
   by preventing default like in the example below.

${code`
  <DropdownItem onClick={e => e.preventDefault()}>
    Open modal
  </DropdownItem>
`}

  ${(
    <Example
      packageName="@atlaskit/dropdown-menu"
      Component={require('../examples/14-with-keyboard-interaction').default}
      title=""
      source={require('!!raw-loader!../examples/14-with-keyboard-interaction')}
    />
  )}
`;
