import React, { type FC, useState } from 'react';

import shuffle from 'lodash/shuffle';

import { type AppearanceType, type SizeType } from '@atlaskit/avatar';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';

import { RANDOM_USERS } from '../examples-util/data';
import AvatarGroup from '../src';

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

const data = RANDOM_USERS.map((user) => ({
  ...user,
  appearance: 'circle' as AppearanceType,
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
    setState({
      ...state,
      data: shuffle(state.data),
    });
  };

  const avatarSize = 'medium';

  return (
    <div>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
      <div style={{ display: 'flex', marginTop: '1em' }}>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <div style={{ flex: 1 }}>
          <ButtonGroup label="Avatar options">
            <Button onClick={() => shuffleAvatars()}>Shuffle avatars</Button>
          </ButtonGroup>
        </div>
      </div>

      <h5>Avatars</h5>

{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
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
