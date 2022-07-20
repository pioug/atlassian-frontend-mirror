/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Avatar } from '../src';
import { AvatarList } from '../src/avatar-list';
import { PredefinedAvatarList } from '../src/predefined-avatar-list';
import { PredefinedAvatarView } from '../src/predefined-avatar-view';

import { generateAvatars } from '../example-helpers';
import { IntlProvider } from 'react-intl-next';
import { wrapperStyles } from '../example-helpers/styles';

const avatars: Array<Avatar> = generateAvatars(5);

export default () => (
  <IntlProvider locale="en">
    <div>
      <div>
        <h1>Avatar List</h1>
        <div css={wrapperStyles}>
          <AvatarList avatars={avatars} />
        </div>
      </div>
      <div>
        <h1>Predefined Avatars (none preselected)</h1>
        <div css={wrapperStyles}>
          <PredefinedAvatarList
            avatars={avatars}
            onAvatarSelected={() => {
              console.log('onAvatarSelected');
            }}
          />
        </div>
      </div>
      <div>
        <h1>Predefined Avatars (preselected)</h1>
        <div css={wrapperStyles}>
          <PredefinedAvatarList
            avatars={avatars}
            selectedAvatar={avatars[2]}
            onAvatarSelected={() => {
              console.log('onAvatarSelected');
            }}
          />
        </div>
      </div>
      <div>
        <h1>Predefined Avatar View</h1>
        <div css={wrapperStyles}>
          <PredefinedAvatarView
            avatars={generateAvatars(25)}
            onAvatarSelected={() => {
              console.log('onAvatarSelected');
            }}
          />
        </div>
      </div>
    </div>
  </IntlProvider>
);
