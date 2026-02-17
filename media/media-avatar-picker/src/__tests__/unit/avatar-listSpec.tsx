import React from 'react';
import { type Avatar, AvatarList } from '../../avatar-list';
import { renderWithIntl } from '@atlaskit/media-test-helpers';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

// AvatarList has pre-existing a11y issues (radio without aria-label when avatar has no name)
skipAutoA11yFile();

describe('Avatar List', () => {
	const selectedAvatar: Avatar = { dataURI: 'http://an.avatar.com/453' };
	const otherAvatar: Avatar = { dataURI: 'http://another.avatar.com/789' };
	const avatars = [selectedAvatar];

	it('should not select avatar by default', () => {
		renderWithIntl(<AvatarList avatars={avatars} />);
		expect(screen.getByRole('radio', { checked: false })).toBeInTheDocument();
	});

	it('should select avatar when giving one via props', () => {
		renderWithIntl(
			<AvatarList avatars={avatars} selectedAvatar={selectedAvatar} />,
		);
		expect(screen.getByRole('radio', { checked: true })).toBeInTheDocument();
	});

	it('should call props click handler when avatar is clicked', async () => {
		const user = userEvent.setup();
		const onItemClick = jest.fn();
		// Use two avatars so clicking the unselected one triggers onChange
		renderWithIntl(
			<AvatarList
				avatars={[selectedAvatar, otherAvatar]}
				selectedAvatar={selectedAvatar}
				onItemClick={onItemClick}
			/>,
		);

		// click on the other (unselected) avatar to select it
		await user.click(screen.getByRole('radio', { checked: false }));

		expect(onItemClick).toBeCalledWith(otherAvatar);
	});
});
