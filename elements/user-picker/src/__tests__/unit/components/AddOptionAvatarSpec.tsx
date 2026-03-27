import EmailIcon from '@atlaskit/icon/core/email';
import { token } from '@atlaskit/tokens';
import { shallow } from 'enzyme';
import React from 'react';
import { AddOptionAvatar, type AddOptionAvatarProps } from '../../../components/AddOptionAvatar';

describe('AddOptionAvatar', () => {
	const shallowAddOptionAvatar = (props: AddOptionAvatarProps) =>
		shallow(<AddOptionAvatar {...props} />);

	it('should render email Icon', () => {
		const component = shallowAddOptionAvatar({
			label: 'Invite',
			isLozenge: false,
		});

		const inviteIcon = component.find(EmailIcon);
		expect(inviteIcon).toHaveLength(1);
		expect(inviteIcon.props()).toMatchObject({
			label: 'Invite',
			color: token('color.text.subtle', '#505258'),
		});
	});
});
