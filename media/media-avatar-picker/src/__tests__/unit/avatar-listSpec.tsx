import React from 'react';
import { type Avatar, AvatarList } from '../../avatar-list';
import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing/skip-file-decorator';
import { ffTest } from '@atlassian/feature-flags-test-utils/test-runner';

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
		renderWithIntl(<AvatarList avatars={avatars} selectedAvatar={selectedAvatar} />);
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

	ffTest.on(
		'platform_media_a11y_avatar_radio_label',
		'when the avatar radio label gate is enabled',
		() => {
			it('gives each nameless avatar radio a positional accessible name', () => {
				renderWithIntl(<AvatarList avatars={[selectedAvatar, otherAvatar]} />);
				expect(screen.getByRole('radio', { name: 'Default avatar option 1' })).toBeInTheDocument();
				expect(screen.getByRole('radio', { name: 'Default avatar option 2' })).toBeInTheDocument();
			});

			it("keeps the avatar's own name as the accessible name when it has one", () => {
				renderWithIntl(
					<AvatarList avatars={[{ dataURI: 'http://an.avatar.com/1', name: 'Koala' }]} />,
				);
				expect(screen.getByRole('radio', { name: 'Koala' })).toBeInTheDocument();
			});
		},
	);

	ffTest.off(
		'platform_media_a11y_avatar_radio_label',
		'when the avatar radio label gate is disabled',
		() => {
			it('leaves nameless avatar radios without an accessible name (legacy behaviour)', () => {
				renderWithIntl(<AvatarList avatars={[selectedAvatar]} />);
				expect(
					screen.queryByRole('radio', { name: 'Default avatar option 1' }),
				).not.toBeInTheDocument();
				expect(screen.getByRole('radio')).toBeInTheDocument();
			});
		},
	);
});
