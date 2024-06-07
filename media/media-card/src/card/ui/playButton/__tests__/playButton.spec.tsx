import React from 'react';
import { shallow } from 'enzyme';
import { PlayButton } from '../playButton';
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play';
import { PlayButtonWrapper } from '../playButtonWrapper';
import { PlayButtonBackground } from '../playButtonBackground';

describe('PlayButton', () => {
	it('should render PlayButton properly', () => {
		const playButton = shallow(<PlayButton />);
		expect(playButton.find(PlayButtonWrapper)).toHaveLength(1);
		expect(playButton.find(PlayButtonBackground)).toHaveLength(1);
		expect(playButton.find(VidPlayIcon)).toHaveLength(1);
	});
});
