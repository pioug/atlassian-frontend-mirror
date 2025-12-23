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
		(a) =>
			!['REQUEST_TO_JOIN', 'CANCEL_JOIN_REQUEST', 'EDIT_TEAM_TYPE', 'CAN_EDIT_HIERARCHY'].includes(
				a,
			),
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
				flagName !== 'enable_edit_team_name_external_type_teams'
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

describe('In ORG_ADMIN_MANAGED teams', () => {
	beforeEach(() => {
		(FeatureGates.getExperimentValue as jest.Mock).mockImplementation((exp) =>
			exp === 'new_team_profile' ? true : false,
		);
	});

	describe('When the user is a member', () => {
		beforeEach(() => {
			(isMember as jest.Mock).mockReturnValue(true);
		});

		it.each(
			allActionsExceptJoinAndType.filter(
				(a) => a !== 'UNARCHIVE_TEAM' && a !== 'EDIT_TEAM_MEMBERSHIP',
			),
		)('members with write permission can perform %s', (action) => {
			expect(
				hasPermission(
					action,
					'ORG_ADMIN_MANAGED',
					'FULL_WRITE',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'ACTIVE',
				),
			).toBe(true);
		});

		it('members with write permission cannot unarchive disbanded teams (only org admins can)', () => {
			expect(
				hasPermission(
					'UNARCHIVE_TEAM',
					'ORG_ADMIN_MANAGED',
					'FULL_WRITE',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'DISBANDED',
				),
			).toBe(false);
		});

		it.each(
			AllTeamActions.filter(
				(a) =>
					!['REMOVE_AGENT_FROM_TEAM', 'ADD_AGENT_TO_TEAM', 'EDIT_TEAM_LINK'].some((s) =>
						a.includes(s),
					),
			),
		)('members without write permission cannot perform %s', (action) => {
			for (const permission of nonPermissions) {
				expect(
					hasPermission(
						action,
						'ORG_ADMIN_MANAGED',
						permission,
						true,
						currentMemberMembership,
						undefined,
						undefined,
						'ACTIVE',
					),
				).toBe(false);
			}
		});

		it('members without write permission can still edit team link', () => {
			expect(
				hasPermission(
					'EDIT_TEAM_LINK',
					'ORG_ADMIN_MANAGED',
					'FULL_READ',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'ACTIVE',
				),
			).toBe(true);
		});

		it('members without write permission can still add agents when feature enabled', () => {
			expect(
				hasPermission(
					'ADD_AGENT_TO_TEAM',
					'ORG_ADMIN_MANAGED',
					'FULL_READ',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'ACTIVE',
				),
			).toBe(true);
		});

		it('members without write permission can still remove agents when feature enabled', () => {
			expect(
				hasPermission(
					'REMOVE_AGENT_FROM_TEAM',
					'ORG_ADMIN_MANAGED',
					'FULL_READ',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'ACTIVE',
				),
			).toBe(true);
		});
	});

	describe('When the user is not a member', () => {
		beforeEach(() => {
			(isMember as jest.Mock).mockReturnValue(false);
		});

		it.each(
			AllTeamActions.filter(
				(a) => !['LEAVE_TEAM', 'UNARCHIVE_TEAM', 'EDIT_TEAM_MEMBERSHIP'].some((s) => a.includes(s)),
			),
		)('non-members with FULL_WRITE (no org admin) can perform %s', (action) => {
			expect(
				hasPermission(
					action,
					'ORG_ADMIN_MANAGED',
					'FULL_WRITE',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'ACTIVE',
				),
			).toBe(true);
		});

		it('non-members with FULL_WRITE cannot leave team (requires membership)', () => {
			expect(
				hasPermission(
					'LEAVE_TEAM',
					'ORG_ADMIN_MANAGED',
					'FULL_WRITE',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'ACTIVE',
				),
			).toBe(false);
		});

		it('non-members with FULL_WRITE cannot unarchive disbanded teams (requires org admin)', () => {
			expect(
				hasPermission(
					'UNARCHIVE_TEAM',
					'ORG_ADMIN_MANAGED',
					'FULL_WRITE',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'DISBANDED',
				),
			).toBe(false);
		});
	});

	describe('EDIT_TEAM_LINK permission special cases', () => {
		it('allows members to edit team link even without FULL_WRITE', () => {
			(isMember as jest.Mock).mockReturnValue(true);
			expect(
				hasPermission(
					'EDIT_TEAM_LINK',
					'ORG_ADMIN_MANAGED',
					'FULL_READ',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'ACTIVE',
				),
			).toBe(true);
		});

		it('allows non-members with FULL_WRITE to edit team link', () => {
			(isMember as jest.Mock).mockReturnValue(false);
			expect(
				hasPermission(
					'EDIT_TEAM_LINK',
					'ORG_ADMIN_MANAGED',
					'FULL_WRITE',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'ACTIVE',
				),
			).toBe(true);
		});

		it('does not allow non-members without FULL_WRITE to edit team link', () => {
			(isMember as jest.Mock).mockReturnValue(false);
			expect(
				hasPermission(
					'EDIT_TEAM_LINK',
					'ORG_ADMIN_MANAGED',
					'FULL_READ',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'ACTIVE',
				),
			).toBe(false);
		});

		it('does not allow org admins without FULL_WRITE to edit team link', () => {
			(isMember as jest.Mock).mockReturnValue(false);
			expect(
				hasPermission(
					'EDIT_TEAM_LINK',
					'ORG_ADMIN_MANAGED',
					'FULL_READ',
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

	describe('Agent management permissions', () => {
		beforeEach(() => {
			(FeatureGates.getExperimentValue as jest.Mock).mockImplementation((exp) =>
				exp === 'new_team_profile' ? true : false,
			);
		});

		it('allows members with FULL_WRITE to add agents', () => {
			(isMember as jest.Mock).mockReturnValue(true);
			expect(
				hasPermission(
					'ADD_AGENT_TO_TEAM',
					'ORG_ADMIN_MANAGED',
					'FULL_WRITE',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'ACTIVE',
				),
			).toBe(true);
		});

		it('allows members with FULL_WRITE to remove agents', () => {
			(isMember as jest.Mock).mockReturnValue(true);
			expect(
				hasPermission(
					'REMOVE_AGENT_FROM_TEAM',
					'ORG_ADMIN_MANAGED',
					'FULL_WRITE',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'ACTIVE',
				),
			).toBe(true);
		});

		it('allows non-members with FULL_WRITE to add agents', () => {
			(isMember as jest.Mock).mockReturnValue(false);
			expect(
				hasPermission(
					'ADD_AGENT_TO_TEAM',
					'ORG_ADMIN_MANAGED',
					'FULL_WRITE',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'ACTIVE',
				),
			).toBe(true);
		});

		it('allows non-members with FULL_WRITE to remove agents', () => {
			(isMember as jest.Mock).mockReturnValue(false);
			expect(
				hasPermission(
					'REMOVE_AGENT_FROM_TEAM',
					'ORG_ADMIN_MANAGED',
					'FULL_WRITE',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'ACTIVE',
				),
			).toBe(true);
		});

		it('does not allow non-members without FULL_WRITE to add agents', () => {
			(isMember as jest.Mock).mockReturnValue(false);
			expect(
				hasPermission(
					'ADD_AGENT_TO_TEAM',
					'ORG_ADMIN_MANAGED',
					'FULL_READ',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'ACTIVE',
				),
			).toBe(false);
		});

		it('does not allow non-members without FULL_WRITE to remove agents', () => {
			(isMember as jest.Mock).mockReturnValue(false);
			expect(
				hasPermission(
					'REMOVE_AGENT_FROM_TEAM',
					'ORG_ADMIN_MANAGED',
					'FULL_READ',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'ACTIVE',
				),
			).toBe(false);
		});
	});

	describe('ARCHIVE_TEAM permission', () => {
		describe('When archive teams feature is enabled', () => {
			beforeEach(() => {
				(FeatureGates.getExperimentValue as jest.Mock).mockImplementation((exp) =>
					exp === 'new_team_profile' ? true : false,
				);
			});

			it('allows users with FULL_WRITE to archive teams', () => {
				(isMember as jest.Mock).mockReturnValue(true);
				expect(
					hasPermission(
						'ARCHIVE_TEAM',
						'ORG_ADMIN_MANAGED',
						'FULL_WRITE',
						true,
						currentMemberMembership,
						undefined,
						undefined,
						'ACTIVE',
					),
				).toBe(true);
			});

			it('allows non-members with FULL_WRITE to archive teams', () => {
				(isMember as jest.Mock).mockReturnValue(false);
				expect(
					hasPermission(
						'ARCHIVE_TEAM',
						'ORG_ADMIN_MANAGED',
						'FULL_WRITE',
						true,
						currentMemberMembership,
						undefined,
						undefined,
						'ACTIVE',
					),
				).toBe(true);
			});

			it('does not allow users without FULL_WRITE to archive teams', () => {
				(isMember as jest.Mock).mockReturnValue(true);
				expect(
					hasPermission(
						'ARCHIVE_TEAM',
						'ORG_ADMIN_MANAGED',
						'FULL_READ',
						true,
						currentMemberMembership,
						undefined,
						undefined,
						'ACTIVE',
					),
				).toBe(false);
			});
		});

		describe('When archive teams feature is disabled', () => {
			beforeEach(() => {
				(fg as jest.Mock).mockImplementation(() => false);
				(FeatureGates.getExperimentValue as jest.Mock).mockImplementation(() => false);
			});

			it('does not allow anyone to archive teams', () => {
				(isMember as jest.Mock).mockReturnValue(true);
				expect(
					hasPermission(
						'ARCHIVE_TEAM',
						'ORG_ADMIN_MANAGED',
						'FULL_WRITE',
						true,
						currentMemberMembership,
						undefined,
						undefined,
						'ACTIVE',
					),
				).toBe(false);
			});
		});
	});

	describe('UNARCHIVE_TEAM permission on disbanded teams', () => {
		beforeEach(() => {
			(FeatureGates.getExperimentValue as jest.Mock).mockImplementation((exp) =>
				exp === 'new_team_profile' ? true : false,
			);
		});

		it('allows org admins to unarchive disbanded teams', () => {
			(isMember as jest.Mock).mockReturnValue(false);
			expect(
				hasPermission(
					'UNARCHIVE_TEAM',
					'ORG_ADMIN_MANAGED',
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
			).toBe(true);
		});

		it('does not allow members with FULL_WRITE to unarchive disbanded teams', () => {
			(isMember as jest.Mock).mockReturnValue(true);
			expect(
				hasPermission(
					'UNARCHIVE_TEAM',
					'ORG_ADMIN_MANAGED',
					'FULL_WRITE',
					true,
					currentMemberMembership,
					undefined,
					undefined,
					'DISBANDED',
				),
			).toBe(false);
		});

		it('does not allow non-org-admins to unarchive disbanded teams', () => {
			(isMember as jest.Mock).mockReturnValue(false);
			expect(
				hasPermission(
					'UNARCHIVE_TEAM',
					'ORG_ADMIN_MANAGED',
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
	});
});
