import React from 'react';
import Avatar from '../src';
import { Block } from './helpers';
import { omit } from '../src/utils';
import { AppearanceType } from '../src/types';

interface WithAllAvatarSizesProps {
  presence?: React.ReactNode;
  appearance?: AppearanceType;
}

export default (props: WithAllAvatarSizesProps) => {
  const modifiedProps = omit(props, 'presence', 'status');
  return (
    <Block>
      <Avatar size="xxlarge" {...modifiedProps} />
      <Avatar size="xlarge" {...props} />
      <Avatar size="large" {...props} />
      <Avatar size="medium" {...props} />
      <Avatar size="small" {...props} />
      <Avatar size="xsmall" {...modifiedProps} />
    </Block>
  );
};
