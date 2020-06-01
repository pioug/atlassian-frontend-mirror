import React, { ReactNode } from 'react';

import Avatar from '../src';

function CustomComponent({
  children,
  testId,
}: {
  children: ReactNode;
  testId?: string;
}) {
  return <span data-testid={testId}>{children}</span>;
}

export default function WithCustomComponent() {
  return (
    <Avatar
      appearance="circle"
      src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
      size="xlarge"
      presence="busy"
      component={CustomComponent}
      href="#"
      testId={'yo'}
    />
  );
}
