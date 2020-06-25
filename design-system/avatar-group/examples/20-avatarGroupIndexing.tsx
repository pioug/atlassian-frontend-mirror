import React, { Component } from 'react';

import { AppearanceType, SizeType } from '@atlaskit/avatar';
import Button, { ButtonGroup } from '@atlaskit/button';

import { RANDOM_USERS } from '../examples-util/data';
import { Note } from '../examples-util/helpers';
import AvatarGroup from '../src';

import { shuffle } from 'lodash';

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

export default class AvatarGroupExample extends Component<{}, State> {
  state: State = {
    avatarCount: 20,
    avatarCountMax: 18,
    gridWidth: 520,
    mode: 'stack',
    data: data,
  };

  shuffleAvatars = () => {
    const next = this.state;
    next.data = shuffle(this.state.data);
    this.setState(next);
  };

  render() {
    const { avatarCountMax, gridWidth, data } = this.state;
    const avatarSize = 'medium';

    return (
      <div>
        <Note size="large">Click button Shuffle to reorder all avatars.</Note>
        <div style={{ display: 'flex', marginTop: '1em' }}>
          <div style={{ flex: 1 }}>
            <ButtonGroup>
              <Button onClick={() => this.shuffleAvatars()}>Shuffle</Button>
            </ButtonGroup>
          </div>
        </div>

        <h5>Avatars</h5>

        <div style={{ maxWidth: gridWidth, position: 'relative' }}>
          <AvatarGroup
            appearance="grid"
            onAvatarClick={console.log}
            data={data}
            maxCount={avatarCountMax}
            size={avatarSize}
            testId="grid"
          />
        </div>
      </div>
    );
  }
}
