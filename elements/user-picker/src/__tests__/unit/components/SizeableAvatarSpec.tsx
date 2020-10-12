import Avatar from '@atlaskit/avatar';
import { shallow } from 'enzyme';
import React from 'react';
import { Props, SizeableAvatar } from '../../../components/SizeableAvatar';

describe('SizeableAvatar', () => {
  const shallowSizeableAvatar = (props: Partial<Props> = {}) =>
    shallow(<SizeableAvatar appearance="normal" {...props} />);

  it('should render Avatar', () => {
    const component = shallowSizeableAvatar({ appearance: 'normal' });
    const avatar = component.find(Avatar);
    expect(avatar).toHaveLength(1);
  });

  it('should render small Avatar with normal appearance', () => {
    const component = shallowSizeableAvatar({ appearance: 'normal' });
    const avatar = component.find(Avatar);
    expect(avatar.prop('size')).toEqual('small');
  });

  it('should render small Avatar with compact appearance', () => {
    const component = shallowSizeableAvatar({ appearance: 'compact' });
    const avatar = component.find(Avatar);
    expect(avatar.prop('size')).toEqual('small');
  });

  it('should render medium Avatar with big appearance', () => {
    const component = shallowSizeableAvatar({ appearance: 'big' });
    const avatar = component.find(Avatar);
    expect(avatar.prop('size')).toEqual('medium');
  });

  it('should render xsmall Avatar with multi appearance', () => {
    const component = shallowSizeableAvatar({ appearance: 'multi' });
    const avatar = component.find(Avatar);
    expect(avatar.prop('size')).toEqual('xsmall');
  });

  it('should set presence in Avatar component', () => {
    const component = shallowSizeableAvatar({ presence: 'online' });
    const avatar = component.find(Avatar);
    expect(avatar.prop('presence')).toEqual('online');
  });
});
