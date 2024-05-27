import { AvatarItem } from '@atlaskit/avatar';
import { shallow } from 'enzyme';
import noop from 'lodash/noop';
import React from 'react';
import { type Props } from '../../../components/SingleValue';
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
    shallow(
      <SingleValue
        children={null}
        hasValue={false}
        isMulti={false}
        isRtl={false}
        innerProps={noop as Props['innerProps']}
        getStyles={noop as Props['getStyles']}
        setValue={noop}
        isDisabled={false}
        clearValue={noop}
        cx={noop as Props['cx']}
        getValue={noop as Props['getValue']}
        options={[]}
        selectOption={noop}
        theme={{} as Props['theme']}
        data={data as Props['data']}
        selectProps={selectProps as unknown as Props['selectProps']}
        {...props}
      />,
    );

  it('should render SingleValue', () => {
    const component = shallowSingleValue();
    expect(component.find(AvatarItem).props()).toMatchObject({
      backgroundColor: 'transparent',
      primaryText: 'Jace Beleren',
      avatar: (
        <SizeableAvatar
          src="http://avatars.atlassian.com/jace.png"
          appearance="normal"
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
        />
      ),
    });
  });
});
