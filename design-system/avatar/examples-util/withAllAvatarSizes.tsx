// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React from 'react';

import Avatar from '../src';
import { AppearanceType } from '../src/types';

import { Block } from './helpers';

interface WithAllAvatarSizesProps {
  presence?: React.ReactNode;
  appearance?: AppearanceType;
}

export default (props: WithAllAvatarSizesProps) => {
  const { presence, ...rest } = props;

  return (
    <Block>
      <Avatar size="xxlarge" {...rest} />
      <Avatar size="xlarge" {...props} />
      <Avatar size="large" {...props} />
      <Avatar size="medium" {...props} />
      <Avatar size="small" {...props} />
      <Avatar size="xsmall" {...rest} />
    </Block>
  );
};
