// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React, { ChangeEvent, FC, FormEvent, useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import { ButtonProps } from '@atlaskit/button/types';
import { gridSize } from '@atlaskit/theme/constants';

import { Note } from '../examples-util/helpers';
import Avatar from '../src';

const Btn = (props: ButtonProps) => (
  <span style={{ marginLeft: gridSize() }}>
    <Button type="button" {...props} />
  </span>
);

type State = {
  inputValue: string;
  imageUrl: string;
};

const initialState = {
  inputValue:
    //eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
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
          marginBottom: gridSize(),
          marginTop: gridSize(),
        }}
      >
        <input
          onChange={changeUrl}
          style={{ flex: 1 }}
          type="text"
          value={inputValue}
        />
        <Btn type="submit" appearance="primary">
          Load Image
        </Btn>
        <Btn onClick={resetState}>Reset</Btn>
        <Btn onClick={forceRemount}>Remount</Btn>
      </div>
      <Avatar key={avatarKey} name={avatarName} size="xlarge" src={imageUrl} />
    </form>
  );
};

export default ExternalSrcAvatar;
