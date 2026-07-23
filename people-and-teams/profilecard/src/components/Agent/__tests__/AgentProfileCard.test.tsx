import React from 'react';

import { screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { renderWithAnalyticsListener } from '@atlassian/ptc-test-utils';
import {
	clearFeatureGatesOverrides,
	overrideFeatureGatesExperiment,
} from '@atlassian/ptc-test-utils/feature-gates-test-helpers';

import { ProfileClient } from '../../../index';
import { getMockProfileClient } from '../../../mocks';
import type { RovoAgentProfileCardInfo } from '../../../types';
import AgentProfileCard from '../AgentProfileCard';

describe('ProfileCardTrigger', () => {
	const agent: RovoAgentProfileCardInfo = {
		id: '965df475-d134-43ac-8ec4-f4aafd0025c6',
		name: "Arezoo' agent ",
		description:
			'Get help writing a user manual page that you can use to share your preferred ways of working with your team. This fun and friendly Agent can show you how.',
		system_prompt_template: '',
		visibility: 'PUBLIC',

		user_defined_conversation_starters: [
			'Help me make my first User Manual.',
			'Help with my goals',
		],
		named_id: '965df475-d134-43ac-8ec4-f4aafd0025c6',
		creator: 'ari:cloud:identity::user/62321fb55b6d710070a1ce85',
		creator_type: 'CUSTOMER',
		favourite: true,
		is_default: false,
		deactivated: false,
		identity_account_id: 'ari:cloud:identity::user/712020:b719aaa1-2485-4dad-93d3-abc3c93862c6',
		creatorInfo: undefined,
		actor_type: 'AGENT',
		favourite_count: 0,
	};
	const mockClient = {
		...getMockProfileClient(ProfileClient, 0),
		getRovoAgentPermissions: jest.fn().mockResolvedValue({
			permissions: {
				AGENT_CREATE: { permitted: true },
				AGENT_UPDATE: { permitted: true },
				AGENT_DEACTIVATE: { permitted: true },
			},
		}),
	};

	const renderWithIntl = ({
		isLoading = false,
		hasError = false,
		hideMoreActions = false,
		hideAiDisclaimer = false,
		hideConversationStarters = false,
		hideAgentActions = false,
		hideStarButton = false,
		agentOverride = agent,
	}: {
		isLoading?: boolean;
		hasError?: boolean;
		hideMoreActions?: boolean;
		hideAiDisclaimer?: boolean;
		hideConversationStarters?: boolean;
		hideAgentActions?: boolean;
		hideStarButton?: boolean;
		agentOverride?: RovoAgentProfileCardInfo;
	}) => {
		return renderWithAnalyticsListener(
			<IntlProvider locale="en">
				<AgentProfileCard
					agent={agentOverride}
					resourceClient={mockClient}
					isLoading={isLoading}
					hasError={hasError}
					hideMoreActions={hideMoreActions}
					hideAiDisclaimer={hideAiDisclaimer}
					hideConversationStarters={hideConversationStarters}
					hideAgentActions={hideAgentActions}
					hideStarButton={hideStarButton}
				/>
			</IntlProvider>,
		);
	};

	describe('hideStarButton', () => {
		it('shows the favourite (star) button by default', () => {
			renderWithIntl({});
			expect(screen.getByRole('button', { name: /favourites/i })).toBeInTheDocument();
		});

		it('hides the favourite (star) button when hideStarButton is true', () => {
			renderWithIntl({ hideStarButton: true });
			expect(screen.queryByRole('button', { name: /favourites/i })).not.toBeInTheDocument();
		});
	});

	describe('analytics', () => {
		const profileCardEvent = {
			action: 'rendered',
			actionSubject: 'rovoAgentProfilecard',
			actionSubjectId: 'content',
			attributes: {
				firedAt: 1000,
				packageName: process.env._PACKAGE_NAME_,
				packageVersion: process.env._PACKAGE_VERSION_,
			},
		};

		const loadingProfileCardEvent = {
			action: 'rendered',
			actionSubject: 'rovoAgentProfilecard',
			actionSubjectId: 'spinner',
			attributes: {
				firedAt: 1000,
				packageName: process.env._PACKAGE_NAME_,
				packageVersion: process.env._PACKAGE_VERSION_,
			},
		};
		const errorProfileCardEvent = {
			action: 'rendered',
			actionSubject: 'profilecard',
			actionSubjectId: 'error',
			attributes: {
				firedAt: 1000,
				packageName: process.env._PACKAGE_NAME_,
				packageVersion: process.env._PACKAGE_VERSION_,
				hasRetry: false,
			},
		};
		beforeEach(() => {
			jest.spyOn(performance, 'now').mockReturnValue(1000);
		});

		it('should fire analytics hover profile card event', async () => {
			const { expectEventToBeFired } = renderWithIntl({ isLoading: true });
			expectEventToBeFired('ui', loadingProfileCardEvent);
		});
		it('should fire analytics hover profile card event', async () => {
			const { expectEventToBeFired } = renderWithIntl({ isLoading: false, hasError: true });
			expectEventToBeFired('ui', errorProfileCardEvent);
			expectEventToBeFired('ui', profileCardEvent);
		});
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderWithIntl({});
		await expect(container).toBeAccessible();
	});

	describe('hideMoreActions', () => {
		it('should pass hideMoreActions prop to AgentActions component when true', () => {
			renderWithIntl({ hideMoreActions: true });
			// When hideMoreActions is true, the dropdown menu should not be present
			expect(screen.queryByTestId('agent-dropdown-menu--trigger')).not.toBeInTheDocument();
		});

		it('should pass hideMoreActions prop to AgentActions component when false', () => {
			renderWithIntl({ hideMoreActions: false });
			// When hideMoreActions is false, the dropdown menu should be present
			expect(screen.getByTestId('agent-dropdown-menu--trigger')).toBeInTheDocument();
		});

		it('should render dropdown menu by default when hideMoreActions is not provided', () => {
			renderWithIntl({});
			// When hideMoreActions is not provided, the dropdown menu should be present
			expect(screen.getByTestId('agent-dropdown-menu--trigger')).toBeInTheDocument();
		});
	});

	describe('platform_editor_agent_mentions_drop_one_fixes', () => {
		const agentWithCreator: RovoAgentProfileCardInfo = {
			...agent,
			creatorInfo: {
				type: 'CUSTOMER',
				name: 'John Doe',
				profileLink: 'https://example.com/profile',
			},
		};

		eeTest.describe('platform_editor_agent_mentions', 'experiment on').variant(true, () => {
			ffTest.on('platform_editor_agent_mentions_drop_one_fixes', 'fg on', () => {
				it('hides the creator Rovo icon', () => {
					renderWithIntl({ agentOverride: agentWithCreator });

					expect(screen.queryByTestId('rovo-icon-wrapper')).not.toBeInTheDocument();
				});
			});

			ffTest.off('platform_editor_agent_mentions_drop_one_fixes', 'fg off', () => {
				it('shows the creator Rovo icon', () => {
					renderWithIntl({ agentOverride: agentWithCreator });

					expect(screen.getByTestId('rovo-icon-wrapper')).toBeInTheDocument();
				});
			});
		});

		eeTest.describe('platform_editor_agent_mentions', 'experiment off').variant(false, () => {
			it('shows the creator Rovo icon', () => {
				renderWithIntl({ agentOverride: agentWithCreator });

				expect(screen.getByTestId('rovo-icon-wrapper')).toBeInTheDocument();
			});
		});
	});

	describe('hideAiDisclaimer', () => {
		ffTest.on(
			'rovo_display_ai_disclaimer_on_agent_profile_card',
			'display work item disclosure',
			() => {
				it.each([
					{
						hideAiDisclaimer: false,
						description: 'by default (hideAiDisclaimer is false)',
						shouldRender: true,
					},
					{
						hideAiDisclaimer: undefined,
						description: 'when hideAiDisclaimer is undefined',
						shouldRender: true,
					},
					{
						hideAiDisclaimer: true,
						description: 'when hideAiDisclaimer is true',
						shouldRender: false,
					},
				])(
					'should $<shouldRender ? "" : "not ">render disclosure item $description',
					({ hideAiDisclaimer, shouldRender }) => {
						renderWithIntl({ hideAiDisclaimer });
						const disclaimer = screen.queryByText('Uses AI. Verify results.');

						if (shouldRender) {
							expect(disclaimer).toBeInTheDocument();
						} else {
							expect(disclaimer).not.toBeInTheDocument();
						}
					},
				);
			},
		);

		ffTest.off(
			'rovo_display_ai_disclaimer_on_agent_profile_card',
			'display work item disclosure',
			() => {
				it.each([
					{
						hideAiDisclaimer: true,
						description: 'when feature flag is off',
					},
					{
						hideAiDisclaimer: false,
						description: 'when hideAiDisclaimer is false and feature flag is off',
					},
					{
						hideAiDisclaimer: undefined,
						description: 'when hideAiDisclaimer is not provided and FG is off',
					},
				])('should not render disclosure item $description', ({ hideAiDisclaimer }) => {
					renderWithIntl(hideAiDisclaimer !== undefined ? { hideAiDisclaimer } : {});
					expect(screen.queryByText('Uses AI. Verify results.')).not.toBeInTheDocument();
				});
			},
		);
	});

	describe('hideConversationStarters', () => {
		const conversationStarterText = agent.user_defined_conversation_starters![0];

		ffTest.on('jira_ai_hide_conversation_starters_profilecard', 'feature gate enabled', () => {
			it('should hide conversation starters when hideConversationStarters is true', () => {
				renderWithIntl({ hideConversationStarters: true });
				expect(screen.queryByText(conversationStarterText)).not.toBeInTheDocument();
			});

			it('should show conversation starters when hideConversationStarters is false', () => {
				renderWithIntl({ hideConversationStarters: false });
				expect(screen.getByText(conversationStarterText)).toBeInTheDocument();
			});

			it('should show conversation starters by default', () => {
				renderWithIntl({});
				expect(screen.getByText(conversationStarterText)).toBeInTheDocument();
			});
		});

		ffTest.off('jira_ai_hide_conversation_starters_profilecard', 'feature gate disabled', () => {
			it('should show conversation starters even when hideConversationStarters is true', () => {
				renderWithIntl({ hideConversationStarters: true });
				expect(screen.getByText(conversationStarterText)).toBeInTheDocument();
			});
		});
	});

	describe('hideAgentActions', () => {
		it('should hide agent actions when hideAgentActions is true', () => {
			renderWithIntl({ hideAgentActions: true });
			expect(screen.queryByTestId('agent-dropdown-menu--trigger')).not.toBeInTheDocument();
			expect(screen.queryByRole('button', { name: /chat with agent/i })).not.toBeInTheDocument();
		});

		it('should show agent actions when hideAgentActions is false', () => {
			renderWithIntl({ hideAgentActions: false });
			expect(screen.getByTestId('agent-dropdown-menu--trigger')).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /chat with agent/i })).toBeInTheDocument();
		});

		it('should show agent actions by default', () => {
			renderWithIntl({});
			expect(screen.getByTestId('agent-dropdown-menu--trigger')).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /chat with agent/i })).toBeInTheDocument();
		});
	});

	describe('jira_hide_conversations_for_jca experiment', () => {
		const conversationStarterText = agent.user_defined_conversation_starters![0];

		// creator_type is 'ROVO_DEV' for both the original Rovo Dev agent and the renamed
		// Jira Coding Agent - they are distinguished by name only.
		const rovoDevAgent: RovoAgentProfileCardInfo = {
			...agent,
			name: 'Rovo Dev',
			creator_type: 'ROVO_DEV',
		};
		const jiraCodingAgent: RovoAgentProfileCardInfo = {
			...agent,
			name: 'Jira Coding Agent',
			creator_type: 'ROVO_DEV',
		};

		afterEach(() => {
			clearFeatureGatesOverrides();
		});

		describe('when the experiment is enabled', () => {
			beforeEach(async () => {
				await overrideFeatureGatesExperiment('jira_hide_conversations_for_jca', {
					isEnabled: true,
				});
			});

			it('should hide conversation starters and agent actions for the Jira Coding Agent', () => {
				renderWithIntl({ agentOverride: jiraCodingAgent });
				expect(screen.queryByText(conversationStarterText)).not.toBeInTheDocument();
				expect(screen.queryByRole('button', { name: /chat with agent/i })).not.toBeInTheDocument();
			});

			it('should hide conversation starters and agent actions for Rovo Dev', () => {
				renderWithIntl({ agentOverride: rovoDevAgent });
				expect(screen.queryByText(conversationStarterText)).not.toBeInTheDocument();
				expect(screen.queryByRole('button', { name: /chat with agent/i })).not.toBeInTheDocument();
			});

			it('should still show conversation starters and agent actions for a regular agent', () => {
				renderWithIntl({});
				expect(screen.getByText(conversationStarterText)).toBeInTheDocument();
				expect(screen.getByRole('button', { name: /chat with agent/i })).toBeInTheDocument();
			});
		});

		describe('when the experiment is disabled', () => {
			it('should show conversation starters and agent actions for the Jira Coding Agent', () => {
				renderWithIntl({ agentOverride: jiraCodingAgent });
				expect(screen.getByText(conversationStarterText)).toBeInTheDocument();
				expect(screen.getByRole('button', { name: /chat with agent/i })).toBeInTheDocument();
			});

			it('should hide conversation starters and agent actions for Rovo Dev', () => {
				renderWithIntl({ agentOverride: rovoDevAgent });
				expect(screen.queryByText(conversationStarterText)).not.toBeInTheDocument();
				expect(screen.queryByRole('button', { name: /chat with agent/i })).not.toBeInTheDocument();
			});

			it('should still show conversation starters and agent actions for a regular agent', () => {
				renderWithIntl({});
				expect(screen.getByText(conversationStarterText)).toBeInTheDocument();
				expect(screen.getByRole('button', { name: /chat with agent/i })).toBeInTheDocument();
			});
		});
	});
});
