// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React, { type ChangeEvent, type FC, type FormEvent, useState } from 'react';

import Button from '@atlaskit/button/new';
import { Box, Inline } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

import { Note } from '../examples-util/helpers';
import Avatar from '../src';

type State = {
  inputValue: string;
  imageUrl: string;
};

const initialState = {
  inputValue:
    'https://pbs.twimg.com/profile_images/568401563538841600/2eTVtXXO_400x400.jpeg',
  imageUrl: '',
};

// eslint-disable-next-line react/no-multi-comp
const ExternalSrcAvatar: FC = (props) => {
  const [{ inputValue, imageUrl }, setState] = useState<State>(initialState);
  const [avatarKey, setAvatarKey] = useState(0);

  const changeUrl = (event: ChangeEvent<HTMLInputElement>) =>
    setState({ imageUrl, inputValue: event.target.value });

  const loadImage = (event: FormEvent) => {
    event.preventDefault();
    setState({ imageUrl: inputValue, inputValue });
  };

  const resetState = () => setState(initialState);
  const forceRemount = () => setAvatarKey((k) => k + 1);

  let avatarName = 'Default Avatar';
  if (imageUrl === initialState.inputValue) {
    avatarName = 'Mike Cannon-Brookes';
  } else if (imageUrl.length) {
    avatarName = 'Custom Avatar';
  }

  return (
    <form onSubmit={loadImage}>
      <Note size="large">Try pasting a URL to see the loading behavior:</Note>
      <div
        style={{
          display: 'flex',
          gap: token('space.100', '8px'),
          marginBottom: token('space.100', '8px'),
          marginTop: token('space.100', '8px'),
          alignItems: 'end',
          justifyContent: 'center',
        }}
      >
        <label htmlFor="image-url" style={{ flexGrow: 1 }}>
          Image URL
          <Textfield
            id="image-url"
            onChange={changeUrl}
            style={{ flex: 1 }}
            value={inputValue}
          />
        </label>
        <Box paddingBlockEnd="space.050">
          <Inline space="space.100">
            <Button type="submit" appearance="primary">
              Load Image
            </Button>
            <Button onClick={resetState}>Reset</Button>
            <Button onClick={forceRemount}>Remount</Button>
          </Inline>
        </Box>
      </div>
      <Avatar key={avatarKey} name={avatarName} size="xlarge" src={imageUrl} />
    </form>
  );
};

export default ExternalSrcAvatar;
