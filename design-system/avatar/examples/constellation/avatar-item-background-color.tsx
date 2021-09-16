import React from 'react';

import Avatar, { AvatarItem } from '../../src';

const AvatarItemBackgroundColorExample = () => (
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  <AvatarItem backgroundColor="pink" avatar={<Avatar presence="online" />} />
);

export default AvatarItemBackgroundColorExample;
