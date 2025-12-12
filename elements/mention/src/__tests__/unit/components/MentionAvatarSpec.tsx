import React from 'react';
import { render, screen } from '@testing-library/react';
import { MentionAvatar } from '../../../components/MentionAvatar';
import { fg } from '@atlaskit/platform-feature-flags';
import { getAppearanceForAppType } from '@atlaskit/avatar';

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

jest.mock('@atlaskit/avatar', () => ({
	default: jest.fn(({ appearance, ...props }: any) => (
		<div data-testid="base-avatar" data-appearance={appearance} {...props}>
			Base avatar
		</div>
	)),
	getAppearanceForAppType: jest.fn(),
	__esModule: true,
}));

jest.mock('@atlaskit/teams-avatar', () => ({
	default: () => <div>Team Avatar</div>,
	__esModule: true,
}));

describe('MentionAvatar', () => {
	it('renders the team avatar when the user type is TEAM', async () => {
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

		await expect(document.body).toBeAccessible();
	});

	it('renders the base avatar when the user type is not TEAM', async () => {
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

		await expect(document.body).toBeAccessible();
	});

	describe('Avatar appearance with appType', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('should not call getAppearanceForAppType to set the avatar appearance when feature gate jira_ai_agent_avatar_issue_view_comment_mentions is disabled', async () => {
			(fg as jest.Mock).mockReturnValue(false);

			const mockGetAppearanceForAppType = getAppearanceForAppType as jest.Mock;
			mockGetAppearanceForAppType.mockReturnValue('hexagon');

			const props = {
				mention: {
					id: 'agent-123',
					avatarUrl: 'avatar-url',
					presence: { status: 'active' },
					appType: 'agent',
				},
			};

			render(<MentionAvatar {...props} />);

			const avatar = screen.getByTestId('base-avatar');
			expect(avatar).toBeInTheDocument();

			expect(mockGetAppearanceForAppType).not.toHaveBeenCalled();
			expect(avatar).not.toHaveAttribute('data-appearance');

			await expect(document.body).toBeAccessible();
		});

		it('should call getAppearanceForAppType to set the avatar appearance with appType', async () => {
			(fg as jest.Mock).mockReturnValue(true);

			const APP_TYPE = 'agent';
			const APPEARANCE = 'hexagon';
			const mockGetAppearanceForAppType = getAppearanceForAppType as jest.Mock;
			mockGetAppearanceForAppType.mockReturnValue(APPEARANCE);

			const props = {
				mention: {
					id: 'agent-123',
					avatarUrl: 'avatar-url',
					presence: { status: 'active' },
					appType: APP_TYPE,
				},
			};

			render(<MentionAvatar {...props} />);

			const avatar = screen.getByTestId('base-avatar');
			expect(avatar).toBeInTheDocument();

			expect(mockGetAppearanceForAppType).toHaveBeenCalledWith(APP_TYPE);
			expect(avatar).toHaveAttribute('data-appearance', APPEARANCE);

			await expect(document.body).toBeAccessible();
		});
	});
});
