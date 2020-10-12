import { mount } from 'enzyme';
import React from 'react';
import { AvatarItemOption } from '../../../components/AvatarItemOption';

describe('AvatarItemOption', () => {
  it('should render AvatarItem', () => {
    const primaryText = 'PrimaryText';
    const secondaryText = 'SecondaryText';
    const component = mount(
      <AvatarItemOption
        primaryText={primaryText}
        secondaryText={secondaryText}
        avatar="Avatar"
      />,
    );

    expect(component.text()).toContain(primaryText);
    expect(component.text()).toContain(secondaryText);
  });
});
