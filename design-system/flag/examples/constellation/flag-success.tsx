import React from 'react';

import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { G400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Flag from '../../src';

const FlagSuccessExample = () => {
  return (
    <Flag
      appearance="success"
      icon={
        <SuccessIcon
          label="Success"
          secondaryColor={token('color.background.success.bold', G400)}
        />
      }
      id="success"
      key="success"
      title="Welcome to the room"
      description="You’re now part of Coffee Club."
      actions={[{ content: 'Join the conversation', onClick: () => {} }]}
    />
  );
};

export default FlagSuccessExample;
