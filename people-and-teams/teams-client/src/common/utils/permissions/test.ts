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
const allActionsExceptJoinAndType = [
	...AllTeamActions.filter(
		(a) => !['REQUEST_TO_JOIN', 'CANCEL_JOIN_REQUEST', 'EDIT_TEAM_TYPE'].includes(a),
	),
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

const openActionsExceptJoinAndType = [
	...AllTeamActions.filter(
		(a) =>
			![
				'REQUEST_TO_JOIN',
				'CANCEL_JOIN_REQUEST',
				'APPROVE_JOIN_REQUEST',
				'REJECT_JOIN_REQUEST',
				'EDIT_TEAM_TYPE',
			].includes(a),
	),
];

const allActionsExceptUnarchive = [...AllTeamActions.filter((a) => a !== 'UNARCHIVE_TEAM')];

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

		it.each([...openActionsExceptJoinAndType])(
			'members with write permission can perform %s',
			(action) => {
				// For UNARCHIVE_TEAM, pass DISBANDED state, otherwise pass ACTIVE
				const state = action === 'UNARCHIVE_TEAM' ? 'DISBANDED' : 'ACTIVE';
				expect(
					hasPermission(
						action,
						'OPEN',
						'FULL_WRITE',
						true,
						currentMemberMembership,
						undefined,
						undefined,
						state,
					),
				).toBe(true);
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

	describe('When the user is an org admin', () => {
		beforeEach(() => {
			(isMember as jest.Mock).mockReturnValue(true);
			(fg as jest.Mock).mockImplementation(
				(flagName) => flagName === 'legion-enable-archive-teams',
			);
			(FeatureGates.getExperimentValue as jest.Mock).mockImplementation((exp) =>
				exp === 'new_team_profile' ? true : false,
			);
		});

		it.each([...openActionsExceptJoin])('org admins can perform %s', (action) => {
			// For UNARCHIVE_TEAM, pass DISBANDED state, otherwise pass ACTIVE
			const state = action === 'UNARCHIVE_TEAM' ? 'DISBANDED' : 'ACTIVE';

			expect(
				hasPermission(
					action,
					'OPEN',
					'FULL_WRITE',
					true,
					currentMemberMembership,
					{
						canCreateTeams: true,
						canViewTeams: true,
						canAdminTeams: true,
					},
					undefined,
					state,
				),
			).toBe(true);
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

		it.each([...allActionsExceptJoinAndType])(
			'members with write permission can perform %s',
			(action) => {
				// For UNARCHIVE_TEAM, pass DISBANDED state, otherwise pass ACTIVE
				const state = action === 'UNARCHIVE_TEAM' ? 'DISBANDED' : 'ACTIVE';
				expect(
					hasPermission(
						action,
						'MEMBER_INVITE',
						'FULL_WRITE',
						true,
						currentMemberMembership,
						undefined,
						undefined,
						state,
					),
				).toBe(true);
			},
		);

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

		it.each(
			[...allActionsExceptJoinAndType].filter(
				(a) => a !== 'LEAVE_TEAM' && a !== 'ARCHIVE_TEAM' && a !== 'UNARCHIVE_TEAM',
			),
		)('users with write permission can %s', (action) => {
			const state = 'ACTIVE';
			expect(
				hasPermission(
					action,
					'MEMBER_INVITE',
					'FULL_WRITE',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					state,
				),
			).toBe(true);
		});

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

	describe('When the user is an org admin', () => {
		beforeEach(() => {
			(isMember as jest.Mock).mockReturnValue(true);
			(fg as jest.Mock).mockImplementation(
				(flagName) => flagName === 'legion-enable-archive-teams',
			);
			(FeatureGates.getExperimentValue as jest.Mock).mockImplementation((exp) =>
				exp === 'new_team_profile' ? true : false,
			);
		});

		it.each([...allActionsExceptJoin])('org admins can perform %s', (action) => {
			// For UNARCHIVE_TEAM, pass DISBANDED state, otherwise pass ACTIVE
			const state = action === 'UNARCHIVE_TEAM' ? 'DISBANDED' : 'ACTIVE';
			expect(
				hasPermission(
					action,
					'MEMBER_INVITE',
					'FULL_WRITE',
					true,
					currentMemberMembership,
					{
						canCreateTeams: true,
						canViewTeams: true,
						canAdminTeams: true,
					},
					undefined,
					state,
				),
			).toBe(true);
		});
	});
});

describe('In SCIM-synced teams', () => {
	beforeEach(() => {
		(fg as jest.Mock).mockImplementation(
			(flagName) =>
				flagName !== 'enable_edit_team_name_external_type_teams' ||
				flagName !== 'legion-enable-archive-teams',
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
			expect(
				hasPermission(
					action,
					'EXTERNAL',
					undefined,
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'ACTIVE',
				),
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
					].some((s) => a.includes(s)),
			),
		)('members cannot perform %s', (action) => {
			expect(
				hasPermission(
					action,
					'EXTERNAL',
					undefined,
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'ACTIVE',
				),
			).toBe(false);
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
					'EDIT_TEAM_TYPE',
				].some((s) => a.includes(s)),
			),
		)('members can perform %s', (action) => {
			const state = action === 'UNARCHIVE_TEAM' ? 'DISBANDED' : 'ACTIVE';
			expect(
				hasPermission(
					action,
					'EXTERNAL',
					undefined,
					true,
					currentMemberMembership,
					{
						canCreateTeams: true,
						canViewTeams: true,
						canAdminTeams: true,
					},
					undefined,
					state,
				),
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
						'EDIT_TEAM_TYPE',
					].some((s) => a.includes(s)),
			),
		)('members cannot perform %s', (action) => {
			expect(
				hasPermission(
					action,
					'EXTERNAL',
					undefined,
					true,
					currentMemberMembership,
					{
						canCreateTeams: true,
						canViewTeams: true,
						canAdminTeams: true,
					},
					undefined,
					'ACTIVE',
				),
			).toBe(false);
		});
	});
});

describe('Disbanded team permissions', () => {
	beforeEach(() => {
		(isMember as jest.Mock).mockReturnValue(true);
	});

	it.each(AllTeamActions.filter((a) => a !== 'UNARCHIVE_TEAM' && a !== 'DELETE_TEAM'))(
		'returns false for all actions except UNARCHIVE_TEAM and DELETE_TEAM when team is disbanded - %s',
		(action) => {
			expect(
				hasPermission(
					action,
					'OPEN',
					'FULL_WRITE',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'DISBANDED',
				),
			).toBe(false);
		},
	);

	it.each(allActionsExceptUnarchive.filter((a) => a !== 'DELETE_TEAM'))(
		'org admin also cannot perform actions on disbanded teams except UNARCHIVE_TEAM and DELETE_TEAM - %s',
		(action) => {
			expect(
				hasPermission(
					action,
					'OPEN',
					'FULL_WRITE',
					true,
					currentMemberMembership,
					{
						canCreateTeams: true,
						canViewTeams: true,
						canAdminTeams: true,
					},
					undefined,
					'DISBANDED',
				),
			).toBe(false);
		},
	);

	it.each(
		allActionsExceptUnarchive.filter((a) =>
			[
				'EDIT_DESCRIPTION',
				'EDIT_TEAM_LINK',
				'EDIT_TEAM_SETTINGS',
				'REMOVE_AGENT_FROM_TEAM',
				'ADD_AGENT_TO_TEAM',
				'ARCHIVE_TEAM',
			].some((s) => a.includes(s)),
		),
	)('allows actions when team is active with same permissions - %s', (action) => {
		const result = hasPermission(
			action,
			'OPEN',
			'FULL_WRITE',
			true,
			currentMemberMembership,
			undefined,
			undefined,
			'ACTIVE',
		);
		expect(result).toBe(true);
	});
});

describe('ARCHIVE_TEAM and UNARCHIVE_TEAM permissions', () => {
	beforeEach(() => {
		(isMember as jest.Mock).mockReturnValue(true);
	});

	describe('ARCHIVE_TEAM', () => {
		it('returns false when team is already disbanded', () => {
			expect(
				hasPermission(
					'ARCHIVE_TEAM',
					'OPEN',
					'FULL_WRITE',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'DISBANDED',
				),
			).toBe(false);
		});

		it('returns false when team is already disbanded even for org admin', () => {
			expect(
				hasPermission(
					'ARCHIVE_TEAM',
					'EXTERNAL',
					undefined,
					true,
					currentMemberMembership,
					{
						canCreateTeams: true,
						canViewTeams: true,
						canAdminTeams: true,
					},
					undefined,
					'DISBANDED',
				),
			).toBe(false);
		});

		describe('OPEN teams', () => {
			it('checks permission normally when team is active for member with FULL_WRITE', () => {
				const result = hasPermission(
					'ARCHIVE_TEAM',
					'OPEN',
					'FULL_WRITE',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'ACTIVE',
				);
				expect(result).toBe(true);
			});

			it('returns false for member without FULL_WRITE when team is active', () => {
				const result = hasPermission(
					'ARCHIVE_TEAM',
					'OPEN',
					'FULL_READ',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'ACTIVE',
				);
				expect(result).toBe(false);
			});
		});

		describe('MEMBER_INVITE teams', () => {
			it('checks permission normally when team is active for member with FULL_WRITE', () => {
				const result = hasPermission(
					'ARCHIVE_TEAM',
					'MEMBER_INVITE',
					'FULL_WRITE',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'ACTIVE',
				);
				expect(result).toBe(true);
			});
		});

		describe('EXTERNAL teams', () => {
			it('checks permission normally for org admin when team is active', () => {
				const result = hasPermission(
					'ARCHIVE_TEAM',
					'EXTERNAL',
					undefined,
					true,
					currentMemberMembership,
					{
						canCreateTeams: true,
						canViewTeams: true,
						canAdminTeams: true,
					},
					undefined,
					'ACTIVE',
				);
				expect(result).toBe(true);
			});

			it('checks permission normally for non-org-admin when team is active', () => {
				const result = hasPermission(
					'ARCHIVE_TEAM',
					'EXTERNAL',
					undefined,
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'ACTIVE',
				);
				expect(result).toBe(false);
			});
		});
	});

	describe('UNARCHIVE_TEAM', () => {
		it('returns false when team is not disbanded (ACTIVE)', () => {
			expect(
				hasPermission(
					'UNARCHIVE_TEAM',
					'OPEN',
					'FULL_WRITE',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'ACTIVE',
				),
			).toBe(false);
		});

		it('returns false when team is not disbanded (PURGED)', () => {
			expect(
				hasPermission(
					'UNARCHIVE_TEAM',
					'OPEN',
					'FULL_WRITE',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'PURGED',
				),
			).toBe(false);
		});

		describe('OPEN teams', () => {
			it('allows member with FULL_WRITE to unarchive disbanded team', () => {
				expect(
					hasPermission(
						'UNARCHIVE_TEAM',
						'OPEN',
						'FULL_WRITE',
						true,
						currentMemberMembership,
						undefined,
						undefined,
						'DISBANDED',
					),
				).toBe(true);
			});

			it('returns false for member without FULL_WRITE permission', () => {
				expect(
					hasPermission(
						'UNARCHIVE_TEAM',
						'OPEN',
						'FULL_READ',
						true,
						currentMemberMembership,
						undefined,
						undefined,
						'DISBANDED',
					),
				).toBe(false);
			});

			it('returns false for non-member', () => {
				(isMember as jest.Mock).mockReturnValue(false);
				expect(
					hasPermission(
						'UNARCHIVE_TEAM',
						'OPEN',
						'FULL_WRITE',
						true,
						currentMemberMembership,
						undefined,
						undefined,
						'DISBANDED',
					),
				).toBe(false);
				(isMember as jest.Mock).mockReturnValue(true);
			});
		});

		describe('MEMBER_INVITE teams', () => {
			it('allows member with FULL_WRITE to unarchive disbanded team', () => {
				expect(
					hasPermission(
						'UNARCHIVE_TEAM',
						'MEMBER_INVITE',
						'FULL_WRITE',
						true,
						currentMemberMembership,
						undefined,
						undefined,
						'DISBANDED',
					),
				).toBe(true);
			});

			it('returns false for member without FULL_WRITE permission', () => {
				expect(
					hasPermission(
						'UNARCHIVE_TEAM',
						'MEMBER_INVITE',
						'FULL_READ',
						true,
						currentMemberMembership,
						undefined,
						undefined,
						'DISBANDED',
					),
				).toBe(false);
			});
		});

		describe('EXTERNAL teams', () => {
			it('allows org admin to unarchive disbanded team', () => {
				expect(
					hasPermission(
						'UNARCHIVE_TEAM',
						'EXTERNAL',
						undefined,
						true,
						currentMemberMembership,
						{
							canCreateTeams: true,
							canViewTeams: true,
							canAdminTeams: true,
						},
						undefined,
						'DISBANDED',
					),
				).toBe(true);
			});

			it('returns false for non-org-admin even with FULL_WRITE permission', () => {
				expect(
					hasPermission(
						'UNARCHIVE_TEAM',
						'EXTERNAL',
						'FULL_WRITE',
						true,
						currentMemberMembership,
						{
							canCreateTeams: false,
							canViewTeams: false,
							canAdminTeams: false,
						},
						undefined,
						'DISBANDED',
					),
				).toBe(false);
			});

			it('returns false for member without org admin privileges', () => {
				expect(
					hasPermission(
						'UNARCHIVE_TEAM',
						'EXTERNAL',
						undefined,
						true,
						currentMemberMembership,
						undefined,
						undefined,
						'DISBANDED',
					),
				).toBe(false);
			});
		});
	});

	describe('DELETE_TEAM on disbanded teams', () => {
		beforeEach(() => {
			(fg as jest.Mock).mockImplementation(
				(flagName) => flagName === 'legion-enable-archive-teams',
			);
			(FeatureGates.getExperimentValue as jest.Mock).mockImplementation((exp) =>
				exp === 'new_team_profile' ? true : false,
			);
		});

		it('allows member with FULL_WRITE to delete disbanded OPEN team', () => {
			expect(
				hasPermission(
					'DELETE_TEAM',
					'OPEN',
					'FULL_WRITE',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'DISBANDED',
				),
			).toBe(true);
		});

		it('allows member with FULL_WRITE to delete disbanded MEMBER_INVITE team', () => {
			expect(
				hasPermission(
					'DELETE_TEAM',
					'MEMBER_INVITE',
					'FULL_WRITE',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'DISBANDED',
				),
			).toBe(true);
		});

		it('allows org admin to delete disbanded EXTERNAL team', () => {
			expect(
				hasPermission(
					'DELETE_TEAM',
					'EXTERNAL',
					undefined,
					true,
					currentMemberMembership,
					{
						canCreateTeams: true,
						canViewTeams: true,
						canAdminTeams: true,
					},
					undefined,
					'DISBANDED',
				),
			).toBe(true);
		});

		it('returns false for non-org-admin on disbanded EXTERNAL team', () => {
			expect(
				hasPermission(
					'DELETE_TEAM',
					'EXTERNAL',
					undefined,
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'DISBANDED',
				),
			).toBe(false);
		});
	});
});
