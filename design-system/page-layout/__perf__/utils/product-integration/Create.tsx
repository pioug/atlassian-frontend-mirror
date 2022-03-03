import React from 'react';

import { Create } from '@atlaskit/atlassian-navigation';
import { token } from '@atlaskit/tokens';

const StyledTooltip = () => (
  <span>
    Create
    <span style={{ color: token('color.text.accent.orange', 'orange') }}>
      {' '}
      [c]
    </span>
  </span>
);

export const DefaultCreate = () => (
  <Create
    buttonTooltip={<StyledTooltip />}
    iconButtonTooltip="Create button"
    onClick={() => {}}
    text="Create"
    testId="create-cta"
  />
);
