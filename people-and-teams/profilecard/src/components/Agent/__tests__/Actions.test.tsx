import React from 'react';

import { screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import {
	mockRunItLaterSynchronously,
	renderWithAnalyticsListener,
} from '@atlassian/ptc-test-utils';

import type { RovoAgentProfileCardInfo } from '../../../types';
import { AgentActions } from '../Actions';

jest.mock('../../../util/performance', () => ({
	getPageTime: jest.fn().mockImplementation(() => 1000),
}));

Object.defineProperty(performance, 'now', {
	writable: true,
	value: jest.fn().mockReturnValue(1000),
});

mockRunItLaterSynchronously();
describe('ErrorMessage', () => {
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
		getRovoAgentPermissions: jest.fn().mockResolvedValue({
			permissions: {
				AGENT_CREATE: { permitted: true },
				AGENT_UPDATE: { permitted: true },
				AGENT_DEACTIVATE: { permitted: true },
			},
		}),
	};
	const event = {
		action: 'clicked',
		actionSubject: 'button',
		actionSubjectId: 'deleteAgentButton',
		attributes: {
			source: 'agentProfileCard',
			agentId: agent.id,
		},
	};
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const renderAgentActions = () => {
		return renderWithAnalyticsListener(
			<IntlProvider locale="en">
				<AgentActions
					agent={agent}
					onEditAgent={jest.fn()}
					onCopyAgent={jest.fn()}
					onDuplicateAgent={jest.fn()}
					onDeleteAgent={jest.fn()}
					onChatClick={jest.fn()}
					onViewFullProfileClick={jest.fn()}
					resourceClient={mockClient as any}
				/>
			</IntlProvider>,
		);
	};

	ffTest.off('ptc-enable-profile-card-analytics-refactor', 'legacy analytics', () => {
		it('should fire the delete agent button event', async () => {
			const { user, expectEventToBeFired } = renderAgentActions();
			await user.click(screen.getByTestId('agent-dropdown-menu--trigger'));
			await user.click(screen.getByText('Delete Agent'));
			expectEventToBeFired('ui', event);
		});
	});

	ffTest.on('ptc-enable-profile-card-analytics-refactor', 'new analytics', () => {
		it('should fire the delete agent button event', async () => {
			const { user, expectEventToBeFired } = renderAgentActions();
			await user.click(screen.getByTestId('agent-dropdown-menu--trigger'));
			await user.click(screen.getByText('Delete Agent'));
			expectEventToBeFired('ui', event);
		});
	});
});
