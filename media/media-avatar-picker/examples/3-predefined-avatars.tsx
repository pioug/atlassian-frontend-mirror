// eslint-disable-line no-console
import React from 'react';
import styled from 'styled-components';
import { Avatar } from '../src';
import { AvatarList } from '../src/avatar-list';
import { PredefinedAvatarList } from '../src/predefined-avatar-list';
import { PredefinedAvatarView } from '../src/predefined-avatar-view';

import { generateAvatars } from '../example-helpers';

const avatars: Array<Avatar> = generateAvatars(5);
const Wrapper: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  margin: 10px;
`;

export default () => (
  <div>
    <div>
      <h1>Avatar List</h1>
      <Wrapper>
        <AvatarList avatars={avatars} />
      </Wrapper>
    </div>
    <div>
      <h1>Predefined Avatars (none preselected)</h1>
      <Wrapper>
        <PredefinedAvatarList
          avatars={avatars}
          onAvatarSelected={() => {
            console.log('onAvatarSelected');
          }}
        />
      </Wrapper>
    </div>
    <div>
      <h1>Predefined Avatars (preselected)</h1>
      <Wrapper>
        <PredefinedAvatarList
          avatars={avatars}
          selectedAvatar={avatars[2]}
          onAvatarSelected={() => {
            console.log('onAvatarSelected');
          }}
        />
      </Wrapper>
    </div>
    <div>
      <h1>Predefined Avatar View</h1>
      <Wrapper>
        <PredefinedAvatarView
          avatars={generateAvatars(25)}
          onAvatarSelected={() => {
            console.log('onAvatarSelected');
          }}
        />
      </Wrapper>
    </div>
  </div>
);
