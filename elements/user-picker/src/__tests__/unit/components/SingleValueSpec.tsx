import { AvatarItem } from '@atlaskit/avatar';
import { shallow } from 'enzyme';
import React from 'react';
import { SingleValue } from '../../../components/SingleValue';
import { SizeableAvatar } from '../../../components/SizeableAvatar';

describe('SingleValue', () => {
  const data = {
    label: 'Jace Beleren',
    value: 'abc-123',
    data: {
      id: 'abc-123',
      name: 'Jace Beleren',
      publicName: 'jbeleren',
      avatarUrl: 'http://avatars.atlassian.com/jace.png',
      byline: 'teammate',
    },
  };

  const selectProps = {
    appearance: 'normal',
  };

  const shallowSingleValue = (props = {}) =>
    shallow(<SingleValue data={data} selectProps={selectProps} {...props} />);

  it('should render SingleValue', () => {
    const component = shallowSingleValue();
    expect(component.find(AvatarItem).props()).toMatchObject({
      backgroundColor: 'transparent',
      primaryText: 'Jace Beleren',
      avatar: (
        <SizeableAvatar
          src="http://avatars.atlassian.com/jace.png"
          appearance="normal"
          name="Jace Beleren"
        />
      ),
    });
  });

  it('should render SizeableAvatar when the appearance is compact', () => {
    const component = shallowSingleValue({
      selectProps: {
        appearance: 'compact',
      },
    });
    expect(component.find(AvatarItem).props()).toMatchObject({
      backgroundColor: 'transparent',
      primaryText: 'Jace Beleren',
      avatar: (
        <SizeableAvatar
          src="http://avatars.atlassian.com/jace.png"
          appearance="compact"
          name="Jace Beleren"
        />
      ),
    });
  });
});
