import React from 'react';
import FeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';
import { render, screen } from '@atlassian/testing-library';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { mockExp } from '@atlassian/experiment-test-utils/mock-exp';
import { resetAllExperiments } from '@atlassian/experiment-test-utils/reset-all-experiments';
import getAppearanceForAppType from '@atlaskit/avatar/get-appearance';
import { MentionAvatar } from '../../../components/MentionAvatar';

jest.mock('@atlaskit/feature-gate-js-client/feature-gates', () => ({
	__esModule: true,
	default: {
		getExperimentValue: jest.fn((_experimentName, _parameterName, defaultValue) => defaultValue),
	},
}));

const mockMentionAgentsExperiment = (enabled: boolean) => {
	resetAllExperiments();
	mockExp('rovo_chat_mention_agents', { isEnabled: enabled });
};

jest.mock('@atlaskit/avatar/avatar', () => ({
	...jest.requireActual('@atlaskit/avatar/avatar'),
	__esModule: true,
	default: jest.fn(({ appearance, ...props }: any) => (
		<div data-testid="base-avatar" data-appearance={appearance} {...props}>
			Base avatar
		</div>
	)),
}));
jest.mock('@atlaskit/avatar/get-appearance', () => ({
	...jest.requireActual('@atlaskit/avatar/get-appearance'),
	__esModule: true,
	default: jest.fn(),
}));

jest.mock('@atlaskit/teams-avatar/teams-avatar', () => ({
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
		failGate('jira_ai_agent_avatar_issue_view_comment_mentions');

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
			mockMentionAgentsExperiment(false);
		});

		it('should not call getAppearanceForAppType to set the avatar appearance when feature gate jira_ai_agent_avatar_issue_view_comment_mentions is disabled', async () => {
			failGate('jira_ai_agent_avatar_issue_view_comment_mentions');

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

		it('keeps agent APP mentions on the baseline appearance path when the experiment is disabled', async () => {
			mockMentionAgentsExperiment(false);
			passGate('jira_ai_agent_avatar_issue_view_comment_mentions');
			const mockGetAppearanceForAppType = getAppearanceForAppType as jest.Mock;
			mockGetAppearanceForAppType.mockReturnValue('circle');

			const props = {
				mention: {
					id: 'agent-123',
					avatarUrl: 'avatar-url',
					presence: { status: 'active' },
					userType: 'APP',
					appType: 'agent',
				},
			};

			render(<MentionAvatar {...props} />);

			const avatar = screen.getByTestId('base-avatar');
			expect(avatar).toHaveAttribute('data-appearance', 'circle');
			expect(mockGetAppearanceForAppType).toHaveBeenCalledWith('agent');

			await expect(document.body).toBeAccessible();
		});

		it('renders agent APP mentions as hexagon avatars when the experiment is enabled', async () => {
			mockMentionAgentsExperiment(true);

			const props = {
				mention: {
					id: 'agent-123',
					avatarUrl: 'avatar-url',
					presence: { status: 'active' },
					userType: 'APP',
					appType: 'agent',
				},
			};

			render(<MentionAvatar {...props} />);

			const avatar = screen.getByTestId('base-avatar');
			expect(avatar).toHaveAttribute('data-appearance', 'hexagon');
			expect(getAppearanceForAppType).not.toHaveBeenCalled();

			await expect(document.body).toBeAccessible();
		});

		it('keeps non-agent APP mentions on the baseline appearance path when mention agents are enabled', async () => {
			mockMentionAgentsExperiment(true);
			passGate('jira_ai_agent_avatar_issue_view_comment_mentions');
			const mockGetAppearanceForAppType = getAppearanceForAppType as jest.Mock;
			mockGetAppearanceForAppType.mockReturnValue('circle');

			const props = {
				mention: {
					id: 'app-123',
					avatarUrl: 'avatar-url',
					presence: { status: 'active' },
					userType: 'APP',
					appType: 'other-app',
				},
			};

			render(<MentionAvatar {...props} />);

			const avatar = screen.getByTestId('base-avatar');
			expect(avatar).toHaveAttribute('data-appearance', 'circle');
			expect(mockGetAppearanceForAppType).toHaveBeenCalledWith('other-app');
			expect(FeatureGates.getExperimentValue).not.toHaveBeenCalled();

			await expect(document.body).toBeAccessible();
		});
	});
});
