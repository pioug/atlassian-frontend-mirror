import React from 'react';
import { md } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
  ${(
    <SectionMessage
      appearance="warning"
      title="Note: @atlaskit/user-picker/smart-user-picker is deprecated."
    >
      Please use{' '}
      <a href="https://statlas.prod.atl-paas.net/atlassian-frontend/master#packages/smart-experiences/smart-user-picker">
        @atlassian/smart-user-picker
      </a>{' '}
      instead.
    </SectionMessage>
  )}
`;
