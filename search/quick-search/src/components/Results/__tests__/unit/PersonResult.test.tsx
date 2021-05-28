import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import Avatar from '@atlaskit/avatar';
import PersonResult from '../../PersonResult';

const DUMMY_AVATAR = <Avatar key="test-avatar" />;

describe('Person Result', () => {
  let personResultWrapper: ReactWrapper;
  beforeEach(() => {
    personResultWrapper = mount(
      <PersonResult resultId="testPerson" name="test" />,
    );
  });

  it('should render an avatar if `avatarUrl` is provided', () => {
    personResultWrapper.setProps({ avatarUrl: 'not null' });
    expect(personResultWrapper.find(Avatar)).toHaveLength(1);
  });

  it('should render an avatar if `avatarUrl` is not provided', () => {
    expect(personResultWrapper.find(Avatar)).toHaveLength(1);
  });

  it('should render an avatar if `avatar` is provided as a component', () => {
    personResultWrapper.setProps({ avatar: DUMMY_AVATAR });
    const avatar = personResultWrapper.find(Avatar);
    expect(avatar).toHaveLength(1);
    expect(avatar.key()).toEqual('test-avatar');
  });

  it('should render avatar component if both avatar props are set', () => {
    personResultWrapper.setProps({
      avatar: DUMMY_AVATAR,
      avatarUrl: 'not null',
    });
    const avatar = personResultWrapper.find(Avatar);
    expect(avatar).toHaveLength(1);
    expect(avatar.key()).toEqual('test-avatar');
  });

  it('should render `name` prop', () => {
    const name = 'Charlie Atlas';
    personResultWrapper.setProps({ name });
    expect(personResultWrapper.text()).toEqual(expect.stringContaining(name));
  });

  it("should render mentionName prop prepended with an '@' (w/ default mentionPrefix)", () => {
    const mentionName = 'atlassian';
    personResultWrapper.setProps({ mentionName });
    expect(personResultWrapper.text()).toEqual(
      expect.stringContaining(`@${mentionName}`),
    );
  });

  it('should render mentionPrefix prepended to mentionName', () => {
    const mentionName = 'atlassian';
    const mentionPrefix = '[at]';
    personResultWrapper.setProps({ mentionName, mentionPrefix });
    expect(personResultWrapper.text()).toEqual(
      expect.stringContaining(`${mentionPrefix}${mentionName}`),
    );
  });

  it('should not render mentionPrefix if mentionName is not provided', () => {
    const mentionPrefix = '[at]';
    personResultWrapper.setProps({ mentionPrefix });
    expect(personResultWrapper.text()).not.toEqual(
      expect.stringContaining(mentionPrefix),
    );
  });

  it('should render presenceMessage if provided', () => {
    const presenceMessage = "Gone fishin'";
    personResultWrapper.setProps({ presenceMessage });
    expect(personResultWrapper.text()).toEqual(
      expect.stringContaining(presenceMessage),
    );
  });

  it('known presence states are still valid', () => {
    personResultWrapper.setProps({ presenceState: 'online' });
    expect(personResultWrapper.find('AvatarPresence').find('svg')).toHaveLength(
      1,
    );
    personResultWrapper.setProps({ presenceState: 'offline' });
    expect(personResultWrapper.find('AvatarPresence').find('svg')).toHaveLength(
      1,
    );
    personResultWrapper.setProps({ presenceState: 'busy' });
    expect(personResultWrapper.find('AvatarPresence').find('svg')).toHaveLength(
      1,
    );
  });
});
