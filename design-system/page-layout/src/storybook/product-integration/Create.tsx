import React from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import { Create } from '@atlaskit/atlassian-navigation';
/* eslint-enable import/no-extraneous-dependencies */

const StyledTooltip = () => (
  <span>
    Create
    <span style={{ color: 'orange' }}> [c]</span>
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
