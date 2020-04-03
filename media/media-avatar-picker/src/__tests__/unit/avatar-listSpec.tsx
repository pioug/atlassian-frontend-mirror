import React from 'react';
import { shallow } from 'enzyme';
import { Avatar, AvatarList, AvatarListProps } from '../../avatar-list';
import { SmallAvatarImage } from '../../predefined-avatar-view/styled';

describe('Avatar List', () => {
  const selectedAvatar: Avatar = { dataURI: 'http://an.avatar.com/453' };
  const avatars = [selectedAvatar];

  const renderWithProps = (props: Partial<AvatarListProps>) =>
    shallow(<AvatarList avatars={[]} onItemClick={jest.fn()} {...props} />);

  it('should not select avatar by default', () => {
    const component = renderWithProps({ avatars });

    expect(component.find(SmallAvatarImage).prop('isSelected')).toBeFalsy();
  });

  it('should select avatar when giving one via props', () => {
    const component = renderWithProps({ avatars, selectedAvatar });

    expect(component.find(SmallAvatarImage).prop('isSelected')).toBeTruthy();
  });

  it('should call props click handler when avatar is clicked', () => {
    const onItemClick = jest.fn();
    const component = renderWithProps({ avatars, selectedAvatar, onItemClick });

    // click on the selected avatar
    component.find(SmallAvatarImage).simulate('click');

    expect(onItemClick).toBeCalledWith(selectedAvatar);
  });
});
