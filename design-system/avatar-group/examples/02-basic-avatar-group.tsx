import React from 'react';

import { AppearanceType, SizeType } from '@atlaskit/avatar';

import { RANDOM_USERS } from '../examples-util/data';
import { ExampleGroup } from '../examples-util/helpers';
import AvatarGroup from '../src';

export default () => {
  const data = RANDOM_USERS.map((d) => ({
    email: d.email,
    key: d.email,
    name: d.name,
    appearance: 'circle' as AppearanceType,
    size: 'medium' as SizeType,
  }));

  return (
    <div style={{ maxWidth: 270 }}>
      <ExampleGroup heading="Display in a Stack">
        <AvatarGroup
          appearance="stack"
          onAvatarClick={console.log}
          data={data}
          size="large"
          testId="test"
        />
      </ExampleGroup>
      <ExampleGroup heading="Display as a Grid">
        <AvatarGroup
          appearance="grid"
          onAvatarClick={console.log}
          data={data}
          maxCount={14}
          size="large"
          testId="test"
        />
      </ExampleGroup>
    </div>
  );
};
