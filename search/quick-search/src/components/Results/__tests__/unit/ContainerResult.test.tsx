import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import Avatar from '@atlaskit/avatar';
import ContainerResult from '../../ContainerResult';

const DUMMY_AVATAR = <Avatar key="test-avatar" />;

describe('Container Result', () => {
  let resultWrapper: ReactWrapper;
  beforeEach(() => {
    resultWrapper = mount(<ContainerResult resultId="testId" name="test" />);
  });

  it('should render an avatar if `avatarUrl` is provided', () => {
    resultWrapper.setProps({ avatarUrl: 'not null' });
    expect(resultWrapper.find(Avatar)).toHaveLength(1);
  });

  it('should render an avatar if `avatarUrl` is not provided', () => {
    expect(resultWrapper.find(Avatar)).toHaveLength(1);
  });

  it('should render an avatar if `avatar` is provided as a component', () => {
    resultWrapper.setProps({ avatar: DUMMY_AVATAR });
    const avatar = resultWrapper.find(Avatar);
    expect(avatar).toHaveLength(1);
    expect(avatar.key()).toEqual('test-avatar');
  });

  it('should render avatar component if both avatar props are set', () => {
    resultWrapper.setProps({ avatar: DUMMY_AVATAR, avatarUrl: 'not null' });
    const avatar = resultWrapper.find(Avatar);
    expect(avatar).toHaveLength(1);
    expect(avatar.key()).toEqual('test-avatar');
  });

  it('should render `name` prop', () => {
    const name = "Phillip Jacobs' Personal Space";
    resultWrapper.setProps({ name });
    expect(resultWrapper.text()).toEqual(expect.stringContaining(name));
  });

  it('should render lock icon on private room results', () => {
    resultWrapper.setProps({ isPrivate: true });
    expect(resultWrapper.find(Avatar).at(0).prop('status')).toBe('locked');
  });

  it('should pass null status prop to Avatar on non-private room results', () => {
    // No privacy prop supplied
    expect(resultWrapper.find(Avatar).at(0).prop('status')).toBe(null);
  });
});
