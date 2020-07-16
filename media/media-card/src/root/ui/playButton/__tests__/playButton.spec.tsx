import React from 'react';
import { shallow } from 'enzyme';
import { PlayButton } from '../playButton';
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play';
import { Wrapper, Background } from '../styled';

describe('PlayButton', () => {
  it('should render PlayButton properly', () => {
    const playButton = shallow(<PlayButton />);
    expect(playButton.find(Wrapper)).toHaveLength(1);
    expect(playButton.find(Background)).toHaveLength(1);
    expect(playButton.find(VidPlayIcon)).toHaveLength(1);
  });
});
