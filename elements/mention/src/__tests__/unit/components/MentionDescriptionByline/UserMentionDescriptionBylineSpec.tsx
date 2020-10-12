import { render } from 'enzyme';
import React from 'react';
import UserMentionDescriptionByline from '../../../../components/MentionDescriptionByline';
import { userMention } from './_commonData';
import { MentionDescription } from '../../../..';

const shallowRender = (mention: MentionDescription) =>
  render(<UserMentionDescriptionByline mention={mention} />);

describe('User mention description', () => {
  it('should render User Mention description component', () => {
    const component = shallowRender(userMention);
    expect(component).toMatchSnapshot();
  });

  it('should not show anything if name and nickname match', () => {
    const component = shallowRender({
      id: '12345',
      avatarUrl: 'www.example.com/image.png',
      name: 'Nickname',
      nickname: 'Nickname',
    });
    expect(component.text()).not.toContain('Nickname');
  });

  it('should show if name and nickname are different', () => {
    const component = shallowRender({
      id: '12345',
      avatarUrl: 'www.example.com/image.png',
      name: 'Different full name',
      nickname: 'Nickname',
    });
    expect(component.text()).toContain('Nickname');
  });

  it('should show if name and nickname have non-matching case', () => {
    const component = shallowRender({
      id: '12345',
      avatarUrl: 'www.example.com/image.png',
      name: 'Nickname',
      nickname: 'nickname',
    });
    expect(component.text()).toContain('nickname');
  });

  it('should show if name and nickname vary in whitespace', () => {
    const component = shallowRender({
      id: '12345',
      avatarUrl: 'www.example.com/image.png',
      name: 'Nick name',
      nickname: 'Nickname',
    });
    expect(component.text()).toContain('Nickname');
  });
});
