import React from 'react';

import { AppearanceType, SizeType } from '@atlaskit/avatar';

import { RANDOM_USERS } from '../examples-util/data';
import AvatarGroup from '../src';

const Example = () => {
  const data = RANDOM_USERS.slice(0, 8).map((d) => ({
    email: d.email,
    key: d.email,
    name: d.name,
    appearance: 'circle' as AppearanceType,
    size: 'medium' as SizeType,
    enableTooltip: true,
  }));

  return (
    <AvatarGroup
      testId="overrides"
      appearance="stack"
      data={data}
      size="large"
      onAvatarClick={undefined}
    />
  );
};

export default Example;
