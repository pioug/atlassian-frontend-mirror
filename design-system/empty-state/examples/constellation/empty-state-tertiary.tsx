import React from 'react';

import Button, { LinkButton } from '@atlaskit/button/new';

import EmptyState from '../../src';

const EmptyStateTertiaryActionExample = () => {
  return (
    <EmptyState
      header="You don't have access to this issue"
      description="Make sure the issue exists in this project. If it does, ask a project admin for permission to see the project's issues."
      primaryAction={<Button appearance="primary">Request access</Button>}
      secondaryAction={<Button>View permissions</Button>}
      tertiaryAction={
        <LinkButton
          appearance="link"
          href="http://www.atlassian.com"
          target="_blank"
        >
          About permissions
        </LinkButton>
      }
    />
  );
};

export default EmptyStateTertiaryActionExample;
