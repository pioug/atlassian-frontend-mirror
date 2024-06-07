import React from 'react';
import { type Avatar, AvatarList } from '../../avatar-list';
import { mountWithIntlContext } from '@atlaskit/media-test-helpers';

describe('Avatar List', () => {
	const selectedAvatar: Avatar = { dataURI: 'http://an.avatar.com/453' };
	const avatars = [selectedAvatar];

	it('should not select avatar by default', () => {
		const component = mountWithIntlContext(<AvatarList avatars={avatars} />);
		expect(component.find('input').prop('checked')).toEqual(false);
	});

	it('should select avatar when giving one via props', () => {
		const component = mountWithIntlContext(
			<AvatarList avatars={avatars} selectedAvatar={selectedAvatar} />,
		);
		expect(component.find('input').prop('checked')).toEqual(true);
	});

	it('should call props click handler when avatar is clicked', () => {
		const onItemClick = jest.fn();
		const component = mountWithIntlContext(
			<AvatarList avatars={avatars} selectedAvatar={selectedAvatar} onItemClick={onItemClick} />,
		);

		// click on the selected avatar
		component.find('input').simulate('change', {
			target: { value: selectedAvatar },
		});

		expect(onItemClick).toBeCalledWith(selectedAvatar);
	});
});
