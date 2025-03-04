import React from 'react';
import { render, screen } from '@testing-library/react';
import { MentionAvatar } from '../../../components/MentionAvatar';

jest.mock('@atlaskit/avatar', () => ({
	default: () => <div>Base avatar</div>,
	__esModule: true,
}));

jest.mock('@atlaskit/teams-avatar', () => ({
	default: () => <div>Team Avatar</div>,
	__esModule: true,
}));

describe('MentionAvatar', () => {
	it('renders the team avatar when the user type is TEAM', () => {
		const props = {
			mention: {
				id: '0',
				avatarUrl: 'avatar-url',
				presence: { status: 'active' },
				userType: 'TEAM',
			},
		};
		render(<MentionAvatar {...props} />);
		expect(screen.getByText('Team Avatar')).toBeInTheDocument();
		expect(screen.queryByText('Base avatar')).not.toBeInTheDocument();
	});

	it('renders the base avatar when the user type is not TEAM', () => {
		const props = {
			mention: {
				id: '0',
				avatarUrl: 'avatar-url',
				presence: { status: 'active' },
				userType: 'DEFAULT',
			},
		};
		render(<MentionAvatar {...props} />);
		expect(screen.getByText('Base avatar')).toBeInTheDocument();
		expect(screen.queryByText('Team Avatar')).not.toBeInTheDocument();
	});
});
