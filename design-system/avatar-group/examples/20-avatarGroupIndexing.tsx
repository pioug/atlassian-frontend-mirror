import React, { FC, useState } from 'react';

import { AppearanceType, SizeType } from '@atlaskit/avatar';
import Button, { ButtonGroup } from '@atlaskit/button';

import { RANDOM_USERS } from '../examples-util/data';
import { Note } from '../examples-util/helpers';
import AvatarGroup from '../src';

import shuffle from 'lodash/shuffle';

type State = {
  avatarCount: number;
  avatarCountMax: number;
  gridWidth: number;
  mode: 'stack' | 'grid';
  data: Array<any>;
};

function getStatus() {
  const chance = Math.random();
  switch (true) {
    case chance < 0.25:
      return 'approved';
    case chance < 0.5:
      return 'declined';
    default:
      return 'locked';
  }
}

const data = RANDOM_USERS.map(user => ({
  ...user,
  appearance: 'circle' as AppearanceType,
  enableTooltip: true,
  size: 'medium' as SizeType,
  status: getStatus(),
  href: '#',
  src: `https://ui-avatars.com/api/?size=48&background=0D8ABC&color=fff&name=${encodeURI(
    user.name,
  )}`,
}));

const AvatarGroupExample: FC = () => {
  const [state, setState] = useState<State>({
    avatarCount: 20,
    avatarCountMax: 18,
    gridWidth: 520,
    mode: 'stack',
    data,
  });

  const shuffleAvatars = () => {
    const next = state;
    next.data = shuffle(state.data);
    setState(next);
  };

  const avatarSize = 'medium';

  return (
    <div>
      <Note size="large">Click button Shuffle to reorder all avatars.</Note>
      <div style={{ display: 'flex', marginTop: '1em' }}>
        <div style={{ flex: 1 }}>
          <ButtonGroup>
            <Button onClick={() => shuffleAvatars()}>Shuffle</Button>
          </ButtonGroup>
        </div>
      </div>

      <h5>Avatars</h5>

      <div style={{ maxWidth: state.gridWidth, position: 'relative' }}>
        <AvatarGroup
          appearance="grid"
          onAvatarClick={console.log}
          data={state.data}
          maxCount={state.avatarCountMax}
          size={avatarSize}
          testId="grid"
        />
      </div>
    </div>
  );
};

export default AvatarGroupExample;
