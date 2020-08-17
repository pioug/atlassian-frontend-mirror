import React from 'react';

import { mount } from 'enzyme';

import MediaSingle from '../../../ui/MediaSingle';
import { MediaWrapper } from '../../../ui/MediaSingle/styled';

describe('mediaSingle', () => {
  it('should pass correct ratio to mediaWrapper', () => {
    const wrapper = mount(
      <MediaSingle lineLength={30} layout="center" width={30} height={50}>
        <div>mediachild</div>
      </MediaSingle>,
    );

    const props = wrapper.find(MediaWrapper).props();
    expect(props.ratio).toBe('166.667');
  });

  it('should treat first child as media and wrap in MediaWrapper', () => {
    const media = <div>media</div>;
    const caption = <div>caption</div>;
    const wrapper = mount(
      <MediaSingle lineLength={30} layout="center" width={30} height={50}>
        {media}
        {caption}
      </MediaSingle>,
    );
    expect(wrapper.find(MediaWrapper).text()).toBe('media');
    expect(wrapper.text()).toBe('mediacaption');
  });
});
