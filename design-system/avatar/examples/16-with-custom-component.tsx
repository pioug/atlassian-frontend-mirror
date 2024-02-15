import React from 'react';

import Avatar from '../src';

export default function WithCustomComponent() {
  return (
    <Avatar
      name="Scott Farquhar"
      appearance="circle"
      src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
      size="xlarge"
      presence="busy"
      testId="yo"
    >
      {({ testId, ...props }) => <span data-testid={testId} {...props} />}
    </Avatar>
  );
}
