import React from 'react';
import { shallow } from 'enzyme';
import { IconMessage } from '..';
import { IconMessageWrapper } from '../styled';
import { messages } from '@atlaskit/media-ui';

describe('iconMessage', () => {
  it('should be rendered properly', () => {
    const message = shallow(
      <IconMessage messageDescriptor={messages.creating_preview} />,
    );
    const wrapper = message.find(IconMessageWrapper);
    expect(wrapper).toHaveLength(1);
  });
});
