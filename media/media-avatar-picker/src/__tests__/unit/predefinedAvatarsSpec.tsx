import React from 'react';
import { shallow } from 'enzyme';
import {
  PredefinedAvatarView,
  PredefinedAvatarViewProps,
} from '../../predefined-avatar-view';

describe('PredefinedAvatarView', () => {
  const setup = (props?: Partial<PredefinedAvatarViewProps>) => {
    const avatars: any = [];
    const onAvatarSelected = jest.fn();
    const component = shallow(
      <PredefinedAvatarView
        avatars={avatars}
        onAvatarSelected={onAvatarSelected}
        {...props}
      />,
    );

    return {
      avatars,
      onAvatarSelected,
      component,
    };
  };

  describe('header text', () => {
    it('should use different caption text when predefinedAvatarsText is passed', () => {
      const { component } = setup();
      expect(
        (component.find('.description').props() as any).children.props
          .defaultMessage,
      ).toEqual('Default avatars');
      component.setProps({
        predefinedAvatarsText: 'default icons',
      });
      expect(component.find('.description').text()).toEqual('default icons');
    });
  });
});
