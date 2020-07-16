import React from 'react';
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play';
import { Wrapper, Background } from './styled';

export const PlayButton = () => {
  return (
    <Wrapper>
      <Background />
      <VidPlayIcon label="play" size="large" />
    </Wrapper>
  );
};
