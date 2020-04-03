import React from 'react';
import { shallow } from 'enzyme';
import ImageIcon from '@atlaskit/icon/glyph/image';
import AudioIcon from '@atlaskit/icon/glyph/audio';
import VideoIcon from '@atlaskit/icon/glyph/media-services/video';
import DocIcon from '@atlaskit/icon/glyph/document';
import UnknownIcon from '@atlaskit/icon/glyph/page';
import { MediaTypeIcon } from '../..';

describe('MediaTypeIcon', () => {
  it('should render an image icon when type=image', () => {
    const element = shallow(<MediaTypeIcon type="image" />);
    expect(element.find(ImageIcon).exists()).toBeTruthy();
  });

  it('should render an audio icon when type=audio', () => {
    const element = shallow(<MediaTypeIcon type="audio" />);
    expect(element.find(AudioIcon).exists()).toBeTruthy();
  });

  it('should render a video icon when type=video', () => {
    const element = shallow(<MediaTypeIcon type="video" />);
    expect(element.find(VideoIcon).exists()).toBeTruthy();
  });

  it('should render a doc icon when type=doc', () => {
    const element = shallow(<MediaTypeIcon type="doc" />);
    expect(element.find(DocIcon).exists()).toBeTruthy();
  });

  it('should render an unknown icon when type=unknown', () => {
    const element = shallow(<MediaTypeIcon type="unknown" />);
    expect(element.find(UnknownIcon).exists()).toBeTruthy();
  });
});
