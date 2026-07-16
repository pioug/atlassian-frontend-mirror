import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import FeatureGates from '@atlaskit/feature-gate-js-client';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { AgentProfileCreator, getAgentCreator } from './index';

describe('getAgentCreator', () => {
	[
		{
			testName: 'system',
			params: {
				creatorType: 'SYSTEM',
				userCreator: undefined,
				forgeCreator: undefined,
				authoringTeam: undefined,
			},
			expected: { type: 'SYSTEM' },
		},
		{
			testName: 'forge',
			params: {
				creatorType: 'FORGE',
				userCreator: { name: 'John Doe', profileLink: 'https://example.com' },
				forgeCreator: 'John Doe Forge',
				authoringTeam: undefined,
			},
			expected: { type: 'FORGE', name: 'John Doe Forge' },
		},
		{
			testName: 'third party',
			params: {
				creatorType: 'THIRD_PARTY',
				userCreator: { name: 'John Doe', profileLink: 'https://example.com' },
				forgeCreator: undefined,
				authoringTeam: undefined,
			},
			expected: { type: 'FORGE', name: '' },
		},
		{
			testName: 'remote A2A without feature flag returns undefined',
			params: {
				creatorType: 'REMOTE_A2A',
				userCreator: undefined,
				forgeCreator: 'Remote App Name',
				authoringTeam: undefined,
			},
			expected: undefined,
		},
		{
			testName: 'ootb',
			params: {
				creatorType: 'OOTB',
				forgeCreator: undefined,
				authoringTeam: undefined,
				userCreator: { name: 'John Doe', profileLink: 'https://example.com' },
			},
			expected: { type: 'OOTB' },
		},
		{
			testName: 'user creator only',
			params: {
				creatorType: 'CUSTOMER',
				userCreator: {
					name: 'John Doe',
					profileLink: 'https://example.com',
					status: 'active',
				},
				forgeCreator: undefined,
				authoringTeam: undefined,
			},
			expected: {
				type: 'CUSTOMER',
				name: 'John Doe',
				profileLink: 'https://example.com',
				status: 'active',
			},
		},
		{
			testName: 'user creator without status',
			params: {
				creatorType: 'CUSTOMER',
				userCreator: {
					name: 'John Doe',
					profileLink: 'https://example.com',
				},
				forgeCreator: undefined,
				authoringTeam: undefined,
			},
			expected: {
				type: 'CUSTOMER',
				name: 'John Doe',
				profileLink: 'https://example.com',
			},
		},
		{
			testName: 'user creator deactivated',
			params: {
				creatorType: 'CUSTOMER',
				userCreator: {
					name: 'John Doe',
					profileLink: 'https://example.com',
					status: 'inactive',
				},
				forgeCreator: undefined,
				authoringTeam: undefined,
			},
			expected: {
				type: 'CUSTOMER',
				name: 'John Doe',
				profileLink: 'https://example.com',
				status: 'inactive',
			},
		},
		{
			testName: 'user creator without profile link',
			params: {
				creatorType: 'CUSTOMER',
				userCreator: {
					name: 'John Doe',
					profileLink: '',
					status: 'active',
				},
				forgeCreator: undefined,
				authoringTeam: undefined,
			},
			expected: undefined,
		},
		{
			testName: 'unknown creator type',
			params: {
				creatorType: 'UNKNOWN',
				userCreator: undefined,
				forgeCreator: undefined,
				authoringTeam: undefined,
			},
			expected: undefined,
		},
	].forEach(({ testName, params, expected }) => {
		it(`should return the correct creator for ${testName}`, () => {
			const creator = getAgentCreator({
				creatorType: params.creatorType,
				userCreator: params.userCreator,
				forgeCreator: params.forgeCreator,
				authoringTeam: params.authoringTeam,
			});
			expect(creator).toEqual(expected);
		});
	});

	describe('with authoring team', () => {
		[
			{
				testName: 'user creator and authoring team',
				params: {
					creatorType: 'CUSTOMER',
					userCreator: { name: 'John Doe', profileLink: 'https://example.com' },
					authoringTeam: { displayName: 'Mock Team Name', profileLink: 'https://example.com/team' },
					forgeCreator: undefined,
				},
				expected: {
					type: 'CUSTOMER',
					name: 'Mock Team Name',
					profileLink: 'https://example.com/team',
				},
			},
		].forEach(({ testName, params, expected }) => {
			it(`should return the correct creator for ${testName}`, () => {
				const creator = getAgentCreator({
					creatorType: params.creatorType,
					userCreator: params.userCreator,
					forgeCreator: params.forgeCreator,
					authoringTeam: params.authoringTeam,
				});
				expect(creator).toEqual(expected);
			});
		});
	});

	ffTest.on('rovo_agent_support_a2a_avatar', 'with rovo_agent_support_a2a_avatar on', () => {
		it('should return FORGE creator for remote A2A with forge creator', () => {
			const creator = getAgentCreator({
				creatorType: 'REMOTE_A2A',
				userCreator: undefined,
				forgeCreator: 'Remote App Name',
				authoringTeam: undefined,
			});
			expect(creator).toEqual({ type: 'FORGE', name: 'Remote App Name' });
		});

		it('should return FORGE creator for remote A2A without forge creator', () => {
			const creator = getAgentCreator({
				creatorType: 'REMOTE_A2A',
				userCreator: undefined,
				forgeCreator: undefined,
				authoringTeam: undefined,
			});
			expect(creator).toEqual({ type: 'FORGE', name: '' });
		});
	});

	describe('with rovo_agent_support_a2a_avatar and jira_improve_agent_profile_for_a2a on', () => {
		it('should preserve the REMOTE_A2A creator type instead of collapsing to FORGE', () => {
			passGate('rovo_agent_support_a2a_avatar');
			passGate('jira_improve_agent_profile_for_a2a');

			const creator = getAgentCreator({
				creatorType: 'REMOTE_A2A',
				userCreator: undefined,
				forgeCreator: 'Remote App Name',
				authoringTeam: undefined,
			});
			expect(creator).toEqual({ type: 'REMOTE_A2A', name: 'Remote App Name' });
		});
	});
});

describe('AgentProfileCreator', () => {
	const wrapper = ({ children }: any) => <IntlProvider locale="en">{children}</IntlProvider>;

	const mockUserCreator = {
		name: 'John Doe',
		profileLink: 'https://example.com',
		status: 'active',
	};

	test('accessibility', async () => {
		const { container } = render(
			<AgentProfileCreator
				creator={getAgentCreator({
					creatorType: 'CUSTOMER',
					userCreator: mockUserCreator,
				})}
				isLoading={false}
				onCreatorLinkClick={() => {}}
			/>,
			{ wrapper },
		);
		await expect(container).toBeAccessible();
	});

	test('render isLoading', () => {
		render(
			<AgentProfileCreator
				creator={getAgentCreator({ creatorType: 'CUSTOMER', userCreator: mockUserCreator })}
				isLoading={true}
				onCreatorLinkClick={() => {}}
			/>,
			{ wrapper },
		);

		expect(screen.getByTestId('agent-profile-creator-skeleton')).toBeInTheDocument();
	});

	test('render correctly for SYSTEM', () => {
		render(
			<AgentProfileCreator
				creator={getAgentCreator({ creatorType: 'SYSTEM' })}
				isLoading={false}
				onCreatorLinkClick={() => {}}
			/>,
			{ wrapper },
		);

		expect(screen.getByText('Atlassian')).toBeInTheDocument();
		expect(screen.queryByTestId('agent-profile-creator-skeleton')).not.toBeInTheDocument();
	});

	test('render correctly for OOTB', () => {
		render(
			<AgentProfileCreator
				creator={getAgentCreator({ creatorType: 'OOTB' })}
				isLoading={false}
				onCreatorLinkClick={() => {}}
			/>,
			{ wrapper },
		);

		expect(screen.getByText('Atlassian')).toBeInTheDocument();
		expect(screen.queryByTestId('agent-profile-creator-skeleton')).not.toBeInTheDocument();
	});

	test('render correctly for CUSTOMER', () => {
		render(
			<AgentProfileCreator
				creator={getAgentCreator({
					creatorType: 'CUSTOMER',
					userCreator: mockUserCreator,
				})}
				isLoading={false}
				onCreatorLinkClick={() => {}}
			/>,
			{ wrapper },
		);

		expect(screen.getByRole('link', { name: /John Doe/ })).toBeInTheDocument();
		expect(screen.queryByTestId('agent-profile-creator-skeleton')).not.toBeInTheDocument();
	});

	test('render correctly for CUSTOMER deactivated', () => {
		render(
			<AgentProfileCreator
				creator={getAgentCreator({
					creatorType: 'CUSTOMER',
					userCreator: {
						...mockUserCreator,
						status: 'inactive',
					},
				})}
				isLoading={false}
				onCreatorLinkClick={() => {}}
			/>,
			{ wrapper },
		);

		expect(screen.getByRole('link', { name: /John Doe \(deactivated\)/ })).toBeInTheDocument();
		expect(screen.queryByTestId('agent-profile-creator-skeleton')).not.toBeInTheDocument();
	});

	test('render correctly for FORGE', () => {
		render(
			<AgentProfileCreator
				creator={getAgentCreator({
					creatorType: 'FORGE',
					forgeCreator: 'John Doe Forge',
				})}
				isLoading={false}
				onCreatorLinkClick={() => {}}
			/>,
			{ wrapper },
		);

		expect(screen.getByText('Rovo Agent by John Doe Forge')).toBeInTheDocument();
		expect(screen.getByTestId('rovo-icon-wrapper')).toBeInTheDocument();
		expect(screen.queryByTestId('agent-profile-creator-skeleton')).not.toBeInTheDocument();
	});

	test('hides the Rovo icon when hideCreatorIcon is set', () => {
		render(
			<AgentProfileCreator
				creator={getAgentCreator({
					creatorType: 'FORGE',
					forgeCreator: 'John Doe Forge',
				})}
				isLoading={false}
				onCreatorLinkClick={() => {}}
				hideCreatorIcon
			/>,
			{ wrapper },
		);

		expect(screen.getByText('Rovo Agent by John Doe Forge')).toBeInTheDocument();
		expect(screen.queryByTestId('rovo-icon-wrapper')).not.toBeInTheDocument();
	});

	test('render correctly for REMOTE_A2A: "Agent by" copy without the Rovo logo', () => {
		passGate('jira_improve_agent_profile_for_a2a');

		render(
			<AgentProfileCreator
				creator={{ type: 'REMOTE_A2A', name: 'Cursor' }}
				isLoading={false}
				onCreatorLinkClick={() => {}}
			/>,
			{ wrapper },
		);

		expect(screen.getByText('Agent by Cursor')).toBeInTheDocument();
		expect(screen.queryByTestId('rovo-icon-wrapper')).not.toBeInTheDocument();
	});

	test('hides the creator line for REMOTE_A2A when rovo_hide_remote_a2a_agent_creator_exp is on', () => {
		passGate('jira_improve_agent_profile_for_a2a');
		const getExperimentValueSpy = jest
			.spyOn(FeatureGates, 'getExperimentValue')
			.mockImplementation((experiment, _key, defaultValue) => {
				if (experiment === 'rovo_hide_remote_a2a_agent_creator_exp') {
					return true;
				}
				return defaultValue;
			});

		try {
			render(
				<AgentProfileCreator
					creator={{ type: 'REMOTE_A2A', name: 'Cursor' }}
					isLoading={false}
					onCreatorLinkClick={() => {}}
				/>,
				{ wrapper },
			);

			expect(screen.queryByText('Agent by Cursor')).not.toBeInTheDocument();
			expect(screen.queryByTestId('rovo-icon-wrapper')).not.toBeInTheDocument();
		} finally {
			getExperimentValueSpy.mockRestore();
		}
	});

	test('should apply aria-hidden to the decorative rovo icon element', () => {
		render(
			<AgentProfileCreator
				creator={getAgentCreator({ creatorType: 'SYSTEM' })}
				isLoading={false}
				onCreatorLinkClick={() => {}}
			/>,
			{ wrapper },
		);
		// aria-hidden is applied on a wrapper element because RovoIcon does not support aria-hidden directly
		expect(screen.getByTestId('rovo-icon-wrapper')).toHaveAttribute('aria-hidden', 'true');
	});

	test('render correctly without creator', () => {
		const { container } = render(
			<AgentProfileCreator creator={undefined} isLoading={false} onCreatorLinkClick={() => {}} />,
			{ wrapper },
		);

		expect(container).toBeEmptyDOMElement();
	});
});
