import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import {
	mockRunItLaterSynchronously,
	renderWithAnalyticsListener,
} from '@atlassian/ptc-test-utils';

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
	const mockClient = getMockProfileClient(ProfileClient, 0);

	const renderWithIntl = ({
		isLoading = false,
		hasError = false,
	}: {
		isLoading?: boolean;
		hasError?: boolean;
	}) => {
		return renderWithAnalyticsListener(
			<IntlProvider locale="en">
				<AgentProfileCard
					agent={agent}
					resourceClient={mockClient}
					isLoading={isLoading}
					hasError={hasError}
				/>
			</IntlProvider>,
		);
	};

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
			mockRunItLaterSynchronously();
			jest.spyOn(performance, 'now').mockReturnValue(1000);
		});

		ffTest.off('ptc-enable-profile-card-analytics-refactor', 'legacy analytics', () => {
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
	});
});
