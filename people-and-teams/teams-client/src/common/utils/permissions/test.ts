import FeatureGates from '@atlaskit/feature-gate-js-client';
import { fg } from '@atlaskit/platform-feature-flags';

import { type TeamMembership } from '../../../types/membership';
import { type TeamPermission } from '../../../types/team';
import { isMember } from '../team';

import { vanityActions } from './constants';
import { hasPermission } from './has-permission';
import { AllTeamActions } from './types';

jest.mock('../team', () => ({
	...jest.requireActual('../team'),
	isMember: jest.fn(),
}));

jest.mock('@atlaskit/platform-feature-flags');

jest.mock('@atlaskit/feature-gate-js-client', () => ({
	...jest.requireActual('@atlaskit/feature-gate-js-client'),
	initialize: jest.fn(),
	initializeCalled: jest.fn(),
	initializeFromValues: jest.fn(),
	getExperimentValue: jest.fn(),
	checkGate: jest.fn(),
	initializeCompleted: () => true,
}));

const nonPermissions: (TeamPermission | undefined)[] = ['FULL_READ', 'NONE', undefined];

const allActionsExceptJoin = [
	...AllTeamActions.filter((a) => !['REQUEST_TO_JOIN', 'CANCEL_JOIN_REQUEST'].includes(a)),
];

const openActionsExceptJoin = [
	...AllTeamActions.filter(
		(a) =>
			![
				'REQUEST_TO_JOIN',
				'CANCEL_JOIN_REQUEST',
				'APPROVE_JOIN_REQUEST',
				'REJECT_JOIN_REQUEST',
			].includes(a),
	),
];

const currentMemberMembership: TeamMembership = {
	membershipId: {
		teamId: 'teamId',
		memberId: 'memberId',
	},
	state: 'FULL_MEMBER',
	role: 'REGULAR',
};

describe('With no browse people permissions', () => {
	it.each([...vanityActions])('members can %s changes to teams', (action) => {
		expect(hasPermission(action, 'OPEN', 'FULL_WRITE', false, currentMemberMembership)).toBe(true);
	});

	it.each([...AllTeamActions.filter((a) => !vanityActions.includes(a))])(
		'users with write permission cannot make membership changes - %s',
		(action) => {
			expect(hasPermission(action, 'OPEN', 'FULL_WRITE', false, currentMemberMembership)).toBe(
				false,
			);
		},
	);

	it.each([...AllTeamActions])('users without write permission cannot perform %s', (action) => {
		for (const permission of nonPermissions) {
			expect(hasPermission(action, 'OPEN', permission, false, currentMemberMembership)).toBe(false);
		}
	});
});

describe('In open teams', () => {
	describe('When the user is a member', () => {
		beforeEach(() => {
			(isMember as jest.Mock).mockReturnValue(true);
			(fg as jest.Mock).mockImplementation(
				(flagName) => flagName === 'legion-enable-archive-teams',
			);
			(FeatureGates.getExperimentValue as jest.Mock).mockImplementation((exp) =>
				exp === 'new_team_profile' ? true : false,
			);
		});

		it.each([...openActionsExceptJoin])(
			'members with write permission can perform %s',
			(action) => {
				expect(hasPermission(action, 'OPEN', 'FULL_WRITE', true, currentMemberMembership)).toBe(
					true,
				);
			},
		);

		it.each([...AllTeamActions.filter((a) => a !== 'JOIN_TEAM')])(
			'members without write permission cannot do anything (except join), cannot %s',
			(action) => {
				for (const permission of nonPermissions) {
					expect(hasPermission(action, 'OPEN', permission, true, currentMemberMembership)).toBe(
						false,
					);
				}
			},
		);

		it.each(['FULL_READ', 'FULL_WRITE'] as TeamPermission[])(
			'members without write or read permission can join team - %s',
			(permission) => {
				expect(hasPermission('JOIN_TEAM', 'OPEN', permission, true, currentMemberMembership)).toBe(
					true,
				);
			},
		);
	});

	describe('When the user is not a member', () => {
		beforeEach(() => {
			(isMember as jest.Mock).mockReturnValue(false);
			(fg as jest.Mock).mockImplementation(
				(flagName) => flagName === 'legion-enable-archive-teams',
			);
			(FeatureGates.getExperimentValue as jest.Mock).mockImplementation((exp) =>
				exp === 'new_team_profile' ? true : false,
			);
		});

		test('anyone can join', () => {
			expect(hasPermission('JOIN_TEAM', 'OPEN', 'FULL_READ', true, currentMemberMembership)).toBe(
				true,
			);

			expect(hasPermission('JOIN_TEAM', 'OPEN', 'FULL_WRITE', true, currentMemberMembership)).toBe(
				true,
			);

			expect(hasPermission('JOIN_TEAM', 'OPEN', 'NONE', true, currentMemberMembership)).toBe(false);

			expect(hasPermission('JOIN_TEAM', 'OPEN', undefined, true, currentMemberMembership)).toBe(
				false,
			);
		});

		test('cannot leave team', () => {
			expect(hasPermission('LEAVE_TEAM', 'OPEN', 'FULL_READ', true, currentMemberMembership)).toBe(
				false,
			);

			expect(hasPermission('LEAVE_TEAM', 'OPEN', 'FULL_WRITE', true, currentMemberMembership)).toBe(
				false,
			);

			expect(hasPermission('LEAVE_TEAM', 'OPEN', 'NONE', true, currentMemberMembership)).toBe(
				false,
			);

			expect(hasPermission('LEAVE_TEAM', 'OPEN', undefined, true, currentMemberMembership)).toBe(
				false,
			);
		});
	});
});

describe('In invite-only teams', () => {
	describe('When the user is a member', () => {
		beforeEach(() => {
			(isMember as jest.Mock).mockReturnValue(true);
			(fg as jest.Mock).mockImplementation(
				(flagName) => flagName === 'legion-enable-archive-teams',
			);
			(FeatureGates.getExperimentValue as jest.Mock).mockImplementation((exp) =>
				exp === 'new_team_profile' ? true : false,
			);
		});

		it.each([...allActionsExceptJoin])('members with write permission can perform %s', (action) => {
			expect(
				hasPermission(action, 'MEMBER_INVITE', 'FULL_WRITE', true, currentMemberMembership),
			).toBe(true);
		});

		it.each([...allActionsExceptJoin])(
			'members without write permission cannot do %s',
			(action) => {
				for (const permission of nonPermissions) {
					expect(
						hasPermission(action, 'MEMBER_INVITE', permission, true, currentMemberMembership),
					).toBe(false);
				}
			},
		);
	});

	describe('When the user is not a member', () => {
		beforeEach(() => {
			(isMember as jest.Mock).mockReturnValue(false);
			(fg as jest.Mock).mockImplementation(
				(flagName) => flagName === 'legion-enable-archive-teams',
			);
			(FeatureGates.getExperimentValue as jest.Mock).mockImplementation((exp) =>
				exp === 'new_team_profile' ? true : false,
			);
		});

		it.each([...allActionsExceptJoin].filter((a) => a !== 'LEAVE_TEAM' && a !== 'ARCHIVE_TEAM'))(
			'users with write permission can %s',
			(action) => {
				expect(
					hasPermission(action, 'MEMBER_INVITE', 'FULL_WRITE', true, currentMemberMembership),
				).toBe(true);
			},
		);

		it.each([...allActionsExceptJoin])('users without write permission cannot do %s', (action) => {
			for (const permission of nonPermissions) {
				expect(
					hasPermission(action, 'MEMBER_INVITE', permission, true, currentMemberMembership),
				).toBe(false);
			}
		});

		it('users with write permission cannot leave team', () => {
			expect(
				hasPermission('LEAVE_TEAM', 'MEMBER_INVITE', 'FULL_WRITE', true, currentMemberMembership),
			).toBe(false);
		});
	});
});

describe('In SCIM-synced teams', () => {
	beforeEach(() => {
		(fg as jest.Mock).mockImplementation(
			(flagName) => flagName !== 'enable_edit_team_name_external_type_teams' || flagName !== 'legion-enable-archive-teams',
		);
		(FeatureGates.getExperimentValue as jest.Mock).mockImplementation((exp) =>
			exp === 'new_team_profile' ? true : false,
		);
	});
	describe('When the user is a member', () => {
		beforeEach(() => {
			(isMember as jest.Mock).mockReturnValue(true);
		});
		it.each(
			AllTeamActions.filter((a) =>
				[
					'EDIT_DESCRIPTION',
					'EDIT_TEAM_LINK',
					'EDIT_TEAM_SETTINGS',
					'REMOVE_AGENT_FROM_TEAM',
					'ADD_AGENT_TO_TEAM',
				].some((s) => a.includes(s)),
			),
		)('members can perform %s', (action) => {
			expect(hasPermission(action, 'EXTERNAL', undefined, true, currentMemberMembership)).toBe(
				true,
			);
		});

		it.each(
			AllTeamActions.filter(
				(a) =>
					![
						'EDIT_DESCRIPTION',
						'EDIT_TEAM_LINK',
						'EDIT_TEAM_SETTINGS',
						'REMOVE_AGENT_FROM_TEAM',
						'ADD_AGENT_TO_TEAM',
					].some((s) => a.includes(s)),
			),
		)('members cannot perform %s', (action) => {
			expect(hasPermission(action, 'EXTERNAL', undefined, true, currentMemberMembership)).toBe(
				false,
			);
		});
	});
	describe('When the user is not a member', () => {
		beforeEach(() => {
			(isMember as jest.Mock).mockReturnValue(false);
		});
		it.each(AllTeamActions)('members cannot perform %s', (action) => {
			expect(hasPermission(action, 'EXTERNAL', undefined, true, currentMemberMembership)).toBe(
				false,
			);
		});
	});
	describe('When the user is an org admin', () => {
		beforeEach(() => {
			(isMember as jest.Mock).mockReturnValue(false);
			(fg as jest.Mock).mockImplementation(
				(flagName) => flagName === 'legion-enable-archive-teams',
			);
			(FeatureGates.getExperimentValue as jest.Mock).mockImplementation((exp) =>
				exp === 'new_team_profile' ? true : false,
			);
		});
		it.each(
			AllTeamActions.filter((a) =>
				[
					'EDIT_DESCRIPTION',
					'EDIT_TEAM_LINK',
					'EDIT_TEAM_SETTINGS',
					'REMOVE_AGENT_FROM_TEAM',
					'ADD_AGENT_TO_TEAM',
					'ARCHIVE_TEAM',
				].some((s) => a.includes(s)),
			),
		)('members can perform %s', (action) => {
			expect(
				hasPermission(action, 'EXTERNAL', undefined, true, currentMemberMembership, {
					canCreateTeams: true,
					canViewTeams: true,
					canAdminTeams: true,
				}),
			).toBe(true);
		});

		it.each(
			AllTeamActions.filter(
				(a) =>
					![
						'EDIT_DESCRIPTION',
						'EDIT_TEAM_LINK',
						'EDIT_TEAM_SETTINGS',
						'REMOVE_AGENT_FROM_TEAM',
						'ADD_AGENT_TO_TEAM',
						'ARCHIVE_TEAM',
					].some((s) => a.includes(s)),
			),
		)('members cannot perform %s', (action) => {
			expect(
				hasPermission(action, 'EXTERNAL', undefined, true, currentMemberMembership, {
					canCreateTeams: true,
					canViewTeams: true,
					canAdminTeams: true,
				}),
			).toBe(false);
		});
	});
});
