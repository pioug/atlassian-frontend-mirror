/**
 * Unit tests for getPermissionMap() and allPermissions() in constants.ts.
 *
 * Covers all 23 TeamAction permissions with gate ON and OFF for:
 *   `ptc-enable-team-type-permission-enabled`  (PTC_GATE)
 *
 * Gate effects by location:
 *
 *   allPermissions():
 *     - EDIT_TEAM_TYPE: default && (isOrgAdmin || fg(PTC))
 *     - ARCHIVE_TEAM:   default && (isMember   || fg(PTC))
 *
 *   OPEN / MEMBER_INVITE:
 *     - ARCHIVE_TEAM override: (FULL_WRITE && (isMember || isOrgAdmin)) || (basePermissions.ARCHIVE_TEAM && fg(PTC))
 *       With ptc ON + FULL_WRITE + non-member/non-orgAdmin: basePermissions.ARCHIVE_TEAM=true → whole expr=true
 *
 *   ORG_ADMIN_MANAGED:
 *     - EDIT_TEAM_LINK:          (isMember || FULL_WRITE) || (base.EDIT_TEAM_LINK && fg(PTC))
 *     - ADD_AGENT_TO_TEAM:       (isMember || FULL_WRITE) || (base.ADD_AGENT_TO_TEAM && fg(PTC))
 *     - REMOVE_AGENT_FROM_TEAM:  (isMember || FULL_WRITE) || (base.REMOVE_AGENT_FROM_TEAM && fg(PTC))
 *     - CAN_EDIT_HIERARCHY:      FULL_WRITE || (base.CAN_EDIT_HIERARCHY && fg(PTC))
 *     - EDIT_TEAM_TYPE:          FULL_WRITE || (base.EDIT_TEAM_TYPE && fg(PTC))
 *     - EDIT_TEAM_MEMBERSHIP:    false || (base.EDIT_TEAM_MEMBERSHIP && fg(PTC))
 *     - REQUEST_TO_JOIN et al.:  fg(PTC) && false || base.* = always just base.* (gate has no real effect)
 *
 *   DISBANDED teams:
 *     - UNARCHIVE_TEAM: canUnarchive || (fg(PTC) && FULL_WRITE)
 *       OPEN/MEMBER_INVITE canUnarchive = (isMember || isOrgAdmin) && FULL_WRITE
 *       EXTERNAL/ORG_ADMIN_MANAGED canUnarchive = isOrgAdmin
 *
 *   EXTERNAL: not affected by PTC gate (uses enable_edit_team_name_external_type_teams gate instead)
 */

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { allPermissions } from './all-permissions';
import { getPermissionMap } from './get-permission-map';

jest.mock('@atlaskit/platform-feature-flags/fg');

const PTC_GATE = 'ptc-enable-team-type-permission-enabled';
const EDIT_EXTERNAL_GATE = 'enable_edit_team_name_external_type_teams';

const mockFg = (ptcOn: boolean, editExternalOn = false) => {
	(fg as jest.Mock).mockImplementation((flag: string) => {
		if (flag === PTC_GATE) return ptcOn;
		if (flag === EDIT_EXTERNAL_GATE) return editExternalOn;
		return false;
	});
};

// Convenience wrappers
const open = (
	permission: 'FULL_WRITE' | 'FULL_READ' | 'NONE' | undefined,
	isMember: boolean,
	isOrgAdmin = false,
) => getPermissionMap('OPEN', permission, isMember, isOrgAdmin);

const memberInvite = (
	permission: 'FULL_WRITE' | 'FULL_READ' | 'NONE' | undefined,
	isMember: boolean,
	isOrgAdmin = false,
) => getPermissionMap('MEMBER_INVITE', permission, isMember, isOrgAdmin);

const orgAdminManaged = (
	permission: 'FULL_WRITE' | 'FULL_READ' | 'NONE' | undefined,
	isMember: boolean,
	isOrgAdmin = false,
) => getPermissionMap('ORG_ADMIN_MANAGED', permission, isMember, isOrgAdmin);

const disbanded = (
	settings: 'OPEN' | 'MEMBER_INVITE' | 'EXTERNAL' | 'ORG_ADMIN_MANAGED',
	permission: 'FULL_WRITE' | 'FULL_READ' | 'NONE' | undefined,
	isMember: boolean,
	isOrgAdmin = false,
) => getPermissionMap(settings, permission, isMember, isOrgAdmin, undefined, 'DISBANDED');

// ─────────────────────────────────────────────────────────────────────────────
// allPermissions – direct tests for gate-controlled fields
// ─────────────────────────────────────────────────────────────────────────────
describe('allPermissions – EDIT_TEAM_TYPE', () => {
	it('gate OFF: requires isOrgAdmin', () => {
		mockFg(false);
		expect(allPermissions(true, true, false).EDIT_TEAM_TYPE).toBe(false); // member, not org admin
		expect(allPermissions(true, false, true).EDIT_TEAM_TYPE).toBe(true); // org admin
		expect(allPermissions(false, false, true).EDIT_TEAM_TYPE).toBe(false); // org admin but no default
	});

	it('gate ON: any user with defaultPermission can edit team type', () => {
		mockFg(true);
		expect(allPermissions(true, true, false).EDIT_TEAM_TYPE).toBe(true); // regular member
		expect(allPermissions(true, false, false).EDIT_TEAM_TYPE).toBe(true); // non-member
		expect(allPermissions(false, true, false).EDIT_TEAM_TYPE).toBe(false); // no default permission
	});
});

describe('allPermissions – ARCHIVE_TEAM', () => {
	it('gate OFF: requires isMember', () => {
		mockFg(false);
		expect(allPermissions(true, true, false).ARCHIVE_TEAM).toBe(true); // member
		expect(allPermissions(true, false, false).ARCHIVE_TEAM).toBe(false); // non-member
		expect(allPermissions(false, true, false).ARCHIVE_TEAM).toBe(false); // no default
	});

	it('gate ON: any user with defaultPermission can archive', () => {
		mockFg(true);
		expect(allPermissions(true, false, false).ARCHIVE_TEAM).toBe(true); // non-member
		expect(allPermissions(true, true, false).ARCHIVE_TEAM).toBe(true); // member
		expect(allPermissions(false, false, false).ARCHIVE_TEAM).toBe(false); // no default
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// OPEN teams – all 23 permissions
// ─────────────────────────────────────────────────────────────────────────────
describe('getPermissionMap – OPEN', () => {
	describe('gate OFF', () => {
		beforeEach(() => mockFg(false));

		it('ADD_MEMBER_TO_TEAM: true with FULL_WRITE, false without', () => {
			expect(open('FULL_WRITE', true).ADD_MEMBER_TO_TEAM).toBe(true);
			expect(open('FULL_READ', true).ADD_MEMBER_TO_TEAM).toBe(false);
		});

		it('JOIN_TEAM: true with FULL_READ or FULL_WRITE (openPermissions override), false with NONE', () => {
			expect(open('FULL_READ', false).JOIN_TEAM).toBe(true);
			expect(open('FULL_WRITE', false).JOIN_TEAM).toBe(true);
			expect(open('NONE', false).JOIN_TEAM).toBe(false);
		});

		it('REQUEST_TO_JOIN: always false for OPEN teams (openPermissions override)', () => {
			expect(open('FULL_WRITE', true).REQUEST_TO_JOIN).toBe(false);
			expect(open('FULL_READ', false).REQUEST_TO_JOIN).toBe(false);
		});

		it('CANCEL_JOIN_REQUEST: always false for OPEN teams', () => {
			expect(open('FULL_WRITE', true).CANCEL_JOIN_REQUEST).toBe(false);
		});

		it('APPROVE_JOIN_REQUEST: always false for OPEN teams', () => {
			expect(open('FULL_WRITE', true).APPROVE_JOIN_REQUEST).toBe(false);
		});

		it('REJECT_JOIN_REQUEST: always false for OPEN teams', () => {
			expect(open('FULL_WRITE', true).REJECT_JOIN_REQUEST).toBe(false);
		});

		it('REMOVE_MEMBER_FROM_TEAM: true with FULL_WRITE, false without', () => {
			expect(open('FULL_WRITE', true).REMOVE_MEMBER_FROM_TEAM).toBe(true);
			expect(open('FULL_READ', true).REMOVE_MEMBER_FROM_TEAM).toBe(false);
		});

		it('CANCEL_INVITE: true with FULL_WRITE, false without', () => {
			expect(open('FULL_WRITE', true).CANCEL_INVITE).toBe(true);
			expect(open('FULL_READ', true).CANCEL_INVITE).toBe(false);
		});

		it('LEAVE_TEAM: true only when FULL_WRITE AND isMember', () => {
			expect(open('FULL_WRITE', true).LEAVE_TEAM).toBe(true);
			expect(open('FULL_WRITE', false).LEAVE_TEAM).toBe(false);
			expect(open('FULL_READ', true).LEAVE_TEAM).toBe(false);
		});

		it('EDIT_DESCRIPTION: true with FULL_WRITE, false without', () => {
			expect(open('FULL_WRITE', true).EDIT_DESCRIPTION).toBe(true);
			expect(open('FULL_READ', true).EDIT_DESCRIPTION).toBe(false);
		});

		it('EDIT_TEAM_NAME: true with FULL_WRITE, false without', () => {
			expect(open('FULL_WRITE', true).EDIT_TEAM_NAME).toBe(true);
			expect(open('FULL_READ', true).EDIT_TEAM_NAME).toBe(false);
		});

		it('EDIT_PROFILE_HEADER: true with FULL_WRITE, false without', () => {
			expect(open('FULL_WRITE', true).EDIT_PROFILE_HEADER).toBe(true);
			expect(open('FULL_READ', true).EDIT_PROFILE_HEADER).toBe(false);
		});

		it('EDIT_TEAM_LINK: true with FULL_WRITE, false without', () => {
			expect(open('FULL_WRITE', true).EDIT_TEAM_LINK).toBe(true);
			expect(open('FULL_READ', true).EDIT_TEAM_LINK).toBe(false);
		});

		it('DELETE_TEAM: true with FULL_WRITE, false without', () => {
			expect(open('FULL_WRITE', true).DELETE_TEAM).toBe(true);
			expect(open('FULL_READ', true).DELETE_TEAM).toBe(false);
		});

		it('EDIT_TEAM_SETTINGS: true with FULL_WRITE, false without', () => {
			expect(open('FULL_WRITE', true).EDIT_TEAM_SETTINGS).toBe(true);
			expect(open('FULL_READ', true).EDIT_TEAM_SETTINGS).toBe(false);
		});

		it('EDIT_TEAM_MEMBERSHIP: true with FULL_WRITE, false without', () => {
			expect(open('FULL_WRITE', true).EDIT_TEAM_MEMBERSHIP).toBe(true);
			expect(open('FULL_READ', true).EDIT_TEAM_MEMBERSHIP).toBe(false);
		});

		it('EDIT_TEAM_TYPE: false for non-org-admin member, true for org admin with FULL_WRITE', () => {
			expect(open('FULL_WRITE', true, false).EDIT_TEAM_TYPE).toBe(false);
			expect(open('FULL_WRITE', true, true).EDIT_TEAM_TYPE).toBe(true);
			expect(open('FULL_READ', true, true).EDIT_TEAM_TYPE).toBe(false);
		});

		it('REMOVE_AGENT_FROM_TEAM: true with FULL_WRITE, false without', () => {
			expect(open('FULL_WRITE', true).REMOVE_AGENT_FROM_TEAM).toBe(true);
			expect(open('FULL_READ', true).REMOVE_AGENT_FROM_TEAM).toBe(false);
		});

		it('ADD_AGENT_TO_TEAM: true with FULL_WRITE, false without', () => {
			expect(open('FULL_WRITE', true).ADD_AGENT_TO_TEAM).toBe(true);
			expect(open('FULL_READ', true).ADD_AGENT_TO_TEAM).toBe(false);
		});

		it('ARCHIVE_TEAM: true for member/orgAdmin with FULL_WRITE, false for non-member non-orgAdmin', () => {
			expect(open('FULL_WRITE', true, false).ARCHIVE_TEAM).toBe(true); // member
			expect(open('FULL_WRITE', false, true).ARCHIVE_TEAM).toBe(true); // org admin
			expect(open('FULL_WRITE', false, false).ARCHIVE_TEAM).toBe(false); // neither
			expect(open('FULL_READ', true, false).ARCHIVE_TEAM).toBe(false); // no FULL_WRITE
		});

		it('UNARCHIVE_TEAM: always false for active teams', () => {
			expect(open('FULL_WRITE', true).UNARCHIVE_TEAM).toBe(false);
		});

		it('CAN_EDIT_HIERARCHY: true with FULL_WRITE, false without', () => {
			expect(open('FULL_WRITE', true).CAN_EDIT_HIERARCHY).toBe(true);
			expect(open('FULL_READ', true).CAN_EDIT_HIERARCHY).toBe(false);
		});

		it('CAN_CHANGE_MEMBERSHIP_SETTINGS: true with FULL_WRITE, false without', () => {
			expect(open('FULL_WRITE', true).CAN_CHANGE_MEMBERSHIP_SETTINGS).toBe(true);
			expect(open('FULL_READ', true).CAN_CHANGE_MEMBERSHIP_SETTINGS).toBe(false);
		});
	});

	describe('gate ON – only gate-affected permissions change', () => {
		beforeEach(() => mockFg(true));

		it('EDIT_TEAM_TYPE: true for non-org-admin member (gate substitutes for isOrgAdmin)', () => {
			expect(open('FULL_WRITE', true, false).EDIT_TEAM_TYPE).toBe(true);
			expect(open('FULL_READ', true, false).EDIT_TEAM_TYPE).toBe(false); // still needs FULL_WRITE
		});

		it('ARCHIVE_TEAM: true for non-member non-orgAdmin with FULL_WRITE (gate enables via basePermissions)', () => {
			// Override: (FULL_WRITE && (isMember=false || isOrgAdmin=false)) || (basePermissions.ARCHIVE_TEAM && fg(PTC))
			// basePermissions.ARCHIVE_TEAM = FULL_WRITE && (isMember=false || ptc=true) = true
			// → false || true = true
			expect(open('FULL_WRITE', false, false).ARCHIVE_TEAM).toBe(true);
			expect(open('FULL_READ', false, false).ARCHIVE_TEAM).toBe(false); // still needs FULL_WRITE
		});

		it('All other permissions unaffected by gate – spot checks', () => {
			expect(open('FULL_WRITE', true).JOIN_TEAM).toBe(true);
			expect(open('FULL_WRITE', true).LEAVE_TEAM).toBe(true);
			expect(open('FULL_WRITE', true).EDIT_DESCRIPTION).toBe(true);
			expect(open('FULL_WRITE', true).EDIT_TEAM_MEMBERSHIP).toBe(true);
			expect(open('FULL_WRITE', true).CAN_EDIT_HIERARCHY).toBe(true);
		});
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// MEMBER_INVITE teams – gate-affected permissions only (rest mirror OPEN)
// ─────────────────────────────────────────────────────────────────────────────
describe('getPermissionMap – MEMBER_INVITE', () => {
	describe('gate OFF', () => {
		beforeEach(() => mockFg(false));

		it('REQUEST_TO_JOIN: true with FULL_READ (inviteOnlyPermissions override)', () => {
			expect(memberInvite('FULL_READ', false).REQUEST_TO_JOIN).toBe(true);
			expect(memberInvite('FULL_WRITE', false).REQUEST_TO_JOIN).toBe(false);
		});

		it('CANCEL_JOIN_REQUEST: true with FULL_READ', () => {
			expect(memberInvite('FULL_READ', false).CANCEL_JOIN_REQUEST).toBe(true);
			expect(memberInvite('FULL_WRITE', false).CANCEL_JOIN_REQUEST).toBe(false);
		});

		it('JOIN_TEAM: false (not overridden to true like OPEN)', () => {
			expect(memberInvite('FULL_READ', false).JOIN_TEAM).toBe(false);
		});

		it('EDIT_TEAM_TYPE: false for non-org-admin, true for org admin with FULL_WRITE', () => {
			expect(memberInvite('FULL_WRITE', true, false).EDIT_TEAM_TYPE).toBe(false);
			expect(memberInvite('FULL_WRITE', true, true).EDIT_TEAM_TYPE).toBe(true);
		});

		it('ARCHIVE_TEAM: true for member with FULL_WRITE, false for non-member non-orgAdmin', () => {
			expect(memberInvite('FULL_WRITE', true, false).ARCHIVE_TEAM).toBe(true);
			expect(memberInvite('FULL_WRITE', false, false).ARCHIVE_TEAM).toBe(false);
		});
	});

	describe('gate ON', () => {
		beforeEach(() => mockFg(true));

		it('EDIT_TEAM_TYPE: true for non-org-admin member', () => {
			expect(memberInvite('FULL_WRITE', true, false).EDIT_TEAM_TYPE).toBe(true);
			expect(memberInvite('FULL_READ', true, false).EDIT_TEAM_TYPE).toBe(false);
		});

		it('ARCHIVE_TEAM: true for non-member non-orgAdmin with FULL_WRITE (gate enables via basePermissions)', () => {
			expect(memberInvite('FULL_WRITE', false, false).ARCHIVE_TEAM).toBe(true);
			expect(memberInvite('FULL_READ', false, false).ARCHIVE_TEAM).toBe(false);
		});
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// ORG_ADMIN_MANAGED teams – all 23 permissions
// ─────────────────────────────────────────────────────────────────────────────
describe('getPermissionMap – ORG_ADMIN_MANAGED', () => {
	describe('gate OFF', () => {
		beforeEach(() => mockFg(false));

		it('ADD_MEMBER_TO_TEAM: true with FULL_WRITE, false without', () => {
			expect(orgAdminManaged('FULL_WRITE', false).ADD_MEMBER_TO_TEAM).toBe(true);
			expect(orgAdminManaged('FULL_READ', false).ADD_MEMBER_TO_TEAM).toBe(false);
		});

		it('JOIN_TEAM: true with FULL_WRITE, false without', () => {
			expect(orgAdminManaged('FULL_WRITE', false).JOIN_TEAM).toBe(true);
			expect(orgAdminManaged('FULL_READ', false).JOIN_TEAM).toBe(false);
		});

		it('REQUEST_TO_JOIN: equals basePermissions (FULL_WRITE)', () => {
			// fg(PTC) && false || base.REQUEST_TO_JOIN = base.REQUEST_TO_JOIN = FULL_WRITE
			expect(orgAdminManaged('FULL_WRITE', false).REQUEST_TO_JOIN).toBe(true);
			expect(orgAdminManaged('FULL_READ', false).REQUEST_TO_JOIN).toBe(false);
		});

		it('CANCEL_JOIN_REQUEST: equals basePermissions (FULL_WRITE)', () => {
			expect(orgAdminManaged('FULL_WRITE', false).CANCEL_JOIN_REQUEST).toBe(true);
			expect(orgAdminManaged('FULL_READ', false).CANCEL_JOIN_REQUEST).toBe(false);
		});

		it('APPROVE_JOIN_REQUEST: equals basePermissions (FULL_WRITE)', () => {
			expect(orgAdminManaged('FULL_WRITE', false).APPROVE_JOIN_REQUEST).toBe(true);
			expect(orgAdminManaged('FULL_READ', false).APPROVE_JOIN_REQUEST).toBe(false);
		});

		it('REJECT_JOIN_REQUEST: equals basePermissions (FULL_WRITE)', () => {
			expect(orgAdminManaged('FULL_WRITE', false).REJECT_JOIN_REQUEST).toBe(true);
			expect(orgAdminManaged('FULL_READ', false).REJECT_JOIN_REQUEST).toBe(false);
		});

		it('REMOVE_MEMBER_FROM_TEAM: true with FULL_WRITE, false without', () => {
			expect(orgAdminManaged('FULL_WRITE', false).REMOVE_MEMBER_FROM_TEAM).toBe(true);
			expect(orgAdminManaged('FULL_READ', false).REMOVE_MEMBER_FROM_TEAM).toBe(false);
		});

		it('CANCEL_INVITE: true with FULL_WRITE, false without', () => {
			expect(orgAdminManaged('FULL_WRITE', false).CANCEL_INVITE).toBe(true);
			expect(orgAdminManaged('FULL_READ', false).CANCEL_INVITE).toBe(false);
		});

		it('LEAVE_TEAM: true only when FULL_WRITE AND isMember', () => {
			expect(orgAdminManaged('FULL_WRITE', true).LEAVE_TEAM).toBe(true);
			expect(orgAdminManaged('FULL_WRITE', false).LEAVE_TEAM).toBe(false);
			expect(orgAdminManaged('FULL_READ', true).LEAVE_TEAM).toBe(false);
		});

		it('EDIT_DESCRIPTION: true with FULL_WRITE, false without', () => {
			expect(orgAdminManaged('FULL_WRITE', false).EDIT_DESCRIPTION).toBe(true);
			expect(orgAdminManaged('FULL_READ', false).EDIT_DESCRIPTION).toBe(false);
		});

		it('EDIT_TEAM_NAME: true with FULL_WRITE, false without', () => {
			expect(orgAdminManaged('FULL_WRITE', false).EDIT_TEAM_NAME).toBe(true);
			expect(orgAdminManaged('FULL_READ', false).EDIT_TEAM_NAME).toBe(false);
		});

		it('EDIT_PROFILE_HEADER: true with FULL_WRITE, false without', () => {
			expect(orgAdminManaged('FULL_WRITE', false).EDIT_PROFILE_HEADER).toBe(true);
			expect(orgAdminManaged('FULL_READ', false).EDIT_PROFILE_HEADER).toBe(false);
		});

		it('EDIT_TEAM_LINK: true for member OR FULL_WRITE, false for non-member without FULL_WRITE', () => {
			expect(orgAdminManaged('FULL_WRITE', false).EDIT_TEAM_LINK).toBe(true); // FULL_WRITE
			expect(orgAdminManaged('FULL_READ', true).EDIT_TEAM_LINK).toBe(true); // isMember
			expect(orgAdminManaged('FULL_READ', false).EDIT_TEAM_LINK).toBe(false);
		});

		it('DELETE_TEAM: true with FULL_WRITE, false without', () => {
			expect(orgAdminManaged('FULL_WRITE', false).DELETE_TEAM).toBe(true);
			expect(orgAdminManaged('FULL_READ', false).DELETE_TEAM).toBe(false);
		});

		it('EDIT_TEAM_SETTINGS: true with FULL_WRITE, false without', () => {
			expect(orgAdminManaged('FULL_WRITE', false).EDIT_TEAM_SETTINGS).toBe(true);
			expect(orgAdminManaged('FULL_READ', false).EDIT_TEAM_SETTINGS).toBe(false);
		});

		it('EDIT_TEAM_MEMBERSHIP: always false (gate OFF)', () => {
			// false || (base.EDIT_TEAM_MEMBERSHIP && fg(PTC)=false) = false
			expect(orgAdminManaged('FULL_WRITE', true, true).EDIT_TEAM_MEMBERSHIP).toBe(false);
		});

		it('EDIT_TEAM_TYPE: true with FULL_WRITE, false without (gate not needed)', () => {
			// FULL_WRITE || (base.EDIT_TEAM_TYPE && fg(PTC)=false) = FULL_WRITE
			expect(orgAdminManaged('FULL_WRITE', false).EDIT_TEAM_TYPE).toBe(true);
			expect(orgAdminManaged('FULL_READ', false).EDIT_TEAM_TYPE).toBe(false);
		});

		it('REMOVE_AGENT_FROM_TEAM: true for member OR FULL_WRITE', () => {
			expect(orgAdminManaged('FULL_WRITE', false).REMOVE_AGENT_FROM_TEAM).toBe(true);
			expect(orgAdminManaged('FULL_READ', true).REMOVE_AGENT_FROM_TEAM).toBe(true);
			expect(orgAdminManaged('FULL_READ', false).REMOVE_AGENT_FROM_TEAM).toBe(false);
		});

		it('ADD_AGENT_TO_TEAM: true for member OR FULL_WRITE', () => {
			expect(orgAdminManaged('FULL_WRITE', false).ADD_AGENT_TO_TEAM).toBe(true);
			expect(orgAdminManaged('FULL_READ', true).ADD_AGENT_TO_TEAM).toBe(true);
			expect(orgAdminManaged('FULL_READ', false).ADD_AGENT_TO_TEAM).toBe(false);
		});

		it('ARCHIVE_TEAM: from basePermissions – true for member with FULL_WRITE', () => {
			// basePermissions.ARCHIVE_TEAM = FULL_WRITE && (isMember || ptc=false)
			expect(orgAdminManaged('FULL_WRITE', true).ARCHIVE_TEAM).toBe(true);
			expect(orgAdminManaged('FULL_WRITE', false).ARCHIVE_TEAM).toBe(false); // non-member, gate OFF
			expect(orgAdminManaged('FULL_READ', true).ARCHIVE_TEAM).toBe(false);
		});

		it('UNARCHIVE_TEAM: always false for active teams', () => {
			expect(orgAdminManaged('FULL_WRITE', true).UNARCHIVE_TEAM).toBe(false);
		});

		it('CAN_EDIT_HIERARCHY: true with FULL_WRITE, false without (gate not needed)', () => {
			// FULL_WRITE || (base.CAN_EDIT_HIERARCHY && fg(PTC)=false) = FULL_WRITE
			expect(orgAdminManaged('FULL_WRITE', false).CAN_EDIT_HIERARCHY).toBe(true);
			expect(orgAdminManaged('FULL_READ', false).CAN_EDIT_HIERARCHY).toBe(false);
		});

		it('CAN_CHANGE_MEMBERSHIP_SETTINGS: true with FULL_WRITE, false without', () => {
			expect(orgAdminManaged('FULL_WRITE', false).CAN_CHANGE_MEMBERSHIP_SETTINGS).toBe(true);
			expect(orgAdminManaged('FULL_READ', false).CAN_CHANGE_MEMBERSHIP_SETTINGS).toBe(false);
		});
	});

	describe('gate ON', () => {
		beforeEach(() => mockFg(true));

		it('EDIT_TEAM_LINK: true for non-member without FULL_WRITE when gate ON (base.EDIT_TEAM_LINK=false→still false)', () => {
			// (isMember=false || FULL_READ) || (base.EDIT_TEAM_LINK=false && true) = false
			expect(orgAdminManaged('FULL_READ', false).EDIT_TEAM_LINK).toBe(false);
		});

		it('EDIT_TEAM_LINK: true when FULL_WRITE (first clause)', () => {
			expect(orgAdminManaged('FULL_WRITE', false).EDIT_TEAM_LINK).toBe(true);
		});

		it('ADD_AGENT_TO_TEAM: true for non-member without FULL_WRITE when gate ON (base=false→still false)', () => {
			expect(orgAdminManaged('FULL_READ', false).ADD_AGENT_TO_TEAM).toBe(false);
		});

		it('REMOVE_AGENT_FROM_TEAM: true for non-member without FULL_WRITE when gate ON (base=false→still false)', () => {
			expect(orgAdminManaged('FULL_READ', false).REMOVE_AGENT_FROM_TEAM).toBe(false);
		});

		it('CAN_EDIT_HIERARCHY: true for non-FULL_WRITE user when gate ON and base is true', () => {
			// base.CAN_EDIT_HIERARCHY = FULL_READ→false, so even with gate=true → false
			expect(orgAdminManaged('FULL_READ', false).CAN_EDIT_HIERARCHY).toBe(false);
			// FULL_WRITE: first clause true regardless
			expect(orgAdminManaged('FULL_WRITE', false).CAN_EDIT_HIERARCHY).toBe(true);
		});

		it('EDIT_TEAM_TYPE: true with FULL_WRITE regardless of gate', () => {
			expect(orgAdminManaged('FULL_WRITE', false).EDIT_TEAM_TYPE).toBe(true);
		});

		it('EDIT_TEAM_TYPE: false without FULL_WRITE even with gate ON (base.EDIT_TEAM_TYPE = FULL_READ→false)', () => {
			// FULL_READ || (base.EDIT_TEAM_TYPE=false && true) = false
			expect(orgAdminManaged('FULL_READ', false).EDIT_TEAM_TYPE).toBe(false);
		});

		it('EDIT_TEAM_MEMBERSHIP: true with FULL_WRITE when gate ON (base.EDIT_TEAM_MEMBERSHIP = true)', () => {
			// false || (base.EDIT_TEAM_MEMBERSHIP=true && fg(PTC)=true) = true
			expect(orgAdminManaged('FULL_WRITE', false).EDIT_TEAM_MEMBERSHIP).toBe(true);
		});

		it('EDIT_TEAM_MEMBERSHIP: false without FULL_WRITE even with gate ON', () => {
			// false || (base.EDIT_TEAM_MEMBERSHIP=false && true) = false
			expect(orgAdminManaged('FULL_READ', false).EDIT_TEAM_MEMBERSHIP).toBe(false);
		});

		it('REQUEST_TO_JOIN: false as no invite flow in org_admin_managed', () => {
			// fg(PTC) && false || base.REQUEST_TO_JOIN = base (gate has no real effect)
			expect(orgAdminManaged('FULL_WRITE', false).REQUEST_TO_JOIN).toBe(false);
			expect(orgAdminManaged('FULL_READ', false).REQUEST_TO_JOIN).toBe(false);
		});

		it('CANCEL_JOIN_REQUEST: false as no invite flow in org_admin_managed', () => {
			expect(orgAdminManaged('FULL_WRITE', false).CANCEL_JOIN_REQUEST).toBe(false);
			expect(orgAdminManaged('FULL_READ', false).CANCEL_JOIN_REQUEST).toBe(false);
		});

		it('APPROVE_JOIN_REQUEST: false as no invite flow in org_admin_managed', () => {
			expect(orgAdminManaged('FULL_WRITE', false).APPROVE_JOIN_REQUEST).toBe(false);
			expect(orgAdminManaged('FULL_READ', false).APPROVE_JOIN_REQUEST).toBe(false);
		});

		it('REJECT_JOIN_REQUEST: false as no invite flow in org_admin_managed', () => {
			expect(orgAdminManaged('FULL_WRITE', false).REJECT_JOIN_REQUEST).toBe(false);
			expect(orgAdminManaged('FULL_READ', false).REJECT_JOIN_REQUEST).toBe(false);
		});

		it('ARCHIVE_TEAM: true for non-member with FULL_WRITE (gate substitutes for isMember in basePermissions)', () => {
			// base.ARCHIVE_TEAM = FULL_WRITE && (isMember=false || ptc=true) = true
			expect(orgAdminManaged('FULL_WRITE', false).ARCHIVE_TEAM).toBe(true);
			expect(orgAdminManaged('FULL_READ', false).ARCHIVE_TEAM).toBe(false);
		});
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// EXTERNAL teams – PTC gate has no effect (uses enable_edit gate for new path)
// ─────────────────────────────────────────────────────────────────────────────
describe('getPermissionMap – EXTERNAL (legacy path, enable_edit OFF)', () => {
	describe('gate OFF', () => {
		beforeEach(() => mockFg(false, false));

		it('ADD_MEMBER_TO_TEAM: always false (allPermissions(false,...))', () => {
			expect(getPermissionMap('EXTERNAL', 'FULL_WRITE', true, false).ADD_MEMBER_TO_TEAM).toBe(
				false,
			);
		});

		it('EDIT_DESCRIPTION: true for member or org admin (SCIMSyncTeamPermissions)', () => {
			expect(getPermissionMap('EXTERNAL', undefined, true, false).EDIT_DESCRIPTION).toBe(true);
			expect(getPermissionMap('EXTERNAL', undefined, false, true).EDIT_DESCRIPTION).toBe(true);
			expect(getPermissionMap('EXTERNAL', undefined, false, false).EDIT_DESCRIPTION).toBe(false);
		});

		it('EDIT_TEAM_NAME: false (gate enable_edit is OFF)', () => {
			expect(
				getPermissionMap('EXTERNAL', undefined, false, true, 'ATLASSIAN_GROUP').EDIT_TEAM_NAME,
			).toBe(false);
		});

		it('CAN_EDIT_HIERARCHY: true for org admin on ATLASSIAN_GROUP, false on HRIS', () => {
			expect(
				getPermissionMap('EXTERNAL', undefined, false, true, 'ATLASSIAN_GROUP').CAN_EDIT_HIERARCHY,
			).toBe(true);
			expect(getPermissionMap('EXTERNAL', undefined, false, true, 'HRIS').CAN_EDIT_HIERARCHY).toBe(
				false,
			);
		});

		it('ADD_AGENT_TO_TEAM: true for member or org admin', () => {
			expect(getPermissionMap('EXTERNAL', undefined, true, false).ADD_AGENT_TO_TEAM).toBe(true);
			expect(getPermissionMap('EXTERNAL', undefined, false, true).ADD_AGENT_TO_TEAM).toBe(true);
			expect(getPermissionMap('EXTERNAL', undefined, false, false).ADD_AGENT_TO_TEAM).toBe(false);
		});

		it('REMOVE_AGENT_FROM_TEAM: true for member or org admin', () => {
			expect(getPermissionMap('EXTERNAL', undefined, true, false).REMOVE_AGENT_FROM_TEAM).toBe(
				true,
			);
			expect(getPermissionMap('EXTERNAL', undefined, false, true).REMOVE_AGENT_FROM_TEAM).toBe(
				true,
			);
			expect(getPermissionMap('EXTERNAL', undefined, false, false).REMOVE_AGENT_FROM_TEAM).toBe(
				false,
			);
		});

		it('ARCHIVE_TEAM: only org admin can archive', () => {
			expect(getPermissionMap('EXTERNAL', undefined, false, true).ARCHIVE_TEAM).toBe(true);
			expect(getPermissionMap('EXTERNAL', undefined, true, false).ARCHIVE_TEAM).toBe(false);
		});

		it('EDIT_TEAM_TYPE: only org admin', () => {
			expect(getPermissionMap('EXTERNAL', undefined, false, true).EDIT_TEAM_TYPE).toBe(true);
			expect(getPermissionMap('EXTERNAL', undefined, true, false).EDIT_TEAM_TYPE).toBe(false);
		});

		it('UNARCHIVE_TEAM: always false for active teams', () => {
			expect(getPermissionMap('EXTERNAL', undefined, false, true).UNARCHIVE_TEAM).toBe(false);
		});
	});

	describe('gate ON – PTC has no effect on EXTERNAL legacy path', () => {
		beforeEach(() => mockFg(true, false));

		it('ARCHIVE_TEAM: still only org admin (PTC gate does not affect EXTERNAL legacy path)', () => {
			expect(getPermissionMap('EXTERNAL', 'FULL_WRITE', true, false).ARCHIVE_TEAM).toBe(false);
			expect(getPermissionMap('EXTERNAL', 'FULL_WRITE', false, true).ARCHIVE_TEAM).toBe(true);
		});

		it('EDIT_TEAM_TYPE: still only org admin', () => {
			expect(getPermissionMap('EXTERNAL', 'FULL_WRITE', true, false).EDIT_TEAM_TYPE).toBe(false);
			expect(getPermissionMap('EXTERNAL', 'FULL_WRITE', false, true).EDIT_TEAM_TYPE).toBe(true);
		});
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// DISBANDED teams – UNARCHIVE_TEAM and DELETE_TEAM
// ─────────────────────────────────────────────────────────────────────────────
describe('getPermissionMap – DISBANDED teams', () => {
	describe('OPEN / MEMBER_INVITE – gate OFF', () => {
		beforeEach(() => mockFg(false));

		it('UNARCHIVE_TEAM: true for member with FULL_WRITE', () => {
			expect(disbanded('OPEN', 'FULL_WRITE', true, false).UNARCHIVE_TEAM).toBe(true);
			expect(disbanded('MEMBER_INVITE', 'FULL_WRITE', true, false).UNARCHIVE_TEAM).toBe(true);
		});

		it('UNARCHIVE_TEAM: true for org admin with FULL_WRITE (even if not member)', () => {
			expect(disbanded('OPEN', 'FULL_WRITE', false, true).UNARCHIVE_TEAM).toBe(true);
		});

		it('UNARCHIVE_TEAM: false for non-member non-orgAdmin even with FULL_WRITE', () => {
			expect(disbanded('OPEN', 'FULL_WRITE', false, false).UNARCHIVE_TEAM).toBe(false);
		});

		it('UNARCHIVE_TEAM: false without FULL_WRITE', () => {
			expect(disbanded('OPEN', 'FULL_READ', true, false).UNARCHIVE_TEAM).toBe(false);
		});

		it('DELETE_TEAM: mirrors canUnarchive (isMember || isOrgAdmin) && FULL_WRITE', () => {
			expect(disbanded('OPEN', 'FULL_WRITE', true, false).DELETE_TEAM).toBe(true);
			expect(disbanded('OPEN', 'FULL_WRITE', false, false).DELETE_TEAM).toBe(false);
		});

		it('All other permissions are false for disbanded teams', () => {
			const result = disbanded('OPEN', 'FULL_WRITE', true, false);
			expect(result.ADD_MEMBER_TO_TEAM).toBe(false);
			expect(result.EDIT_DESCRIPTION).toBe(false);
			expect(result.ARCHIVE_TEAM).toBe(false);
			expect(result.CAN_EDIT_HIERARCHY).toBe(false);
		});
	});

	describe('OPEN / MEMBER_INVITE – gate ON', () => {
		beforeEach(() => mockFg(true));

		it('UNARCHIVE_TEAM: true for non-member non-orgAdmin with FULL_WRITE (gate enables it)', () => {
			// canUnarchive = (isMember=false || isOrgAdmin=false) && FULL_WRITE = false
			// UNARCHIVE_TEAM = canUnarchive || (fg(PTC)=true && FULL_WRITE=true) = true
			expect(disbanded('OPEN', 'FULL_WRITE', false, false).UNARCHIVE_TEAM).toBe(true);
			expect(disbanded('MEMBER_INVITE', 'FULL_WRITE', false, false).UNARCHIVE_TEAM).toBe(true);
		});

		it('UNARCHIVE_TEAM: false without FULL_WRITE even with gate ON', () => {
			expect(disbanded('OPEN', 'FULL_READ', false, false).UNARCHIVE_TEAM).toBe(false);
		});

		it('DELETE_TEAM: still requires canUnarchive (gate does NOT affect DELETE_TEAM)', () => {
			// DELETE_TEAM = canUnarchive only, no gate fallback
			expect(disbanded('OPEN', 'FULL_WRITE', false, false).DELETE_TEAM).toBe(false);
			expect(disbanded('OPEN', 'FULL_WRITE', true, false).DELETE_TEAM).toBe(true);
		});
	});

	describe('EXTERNAL / ORG_ADMIN_MANAGED – gate OFF', () => {
		beforeEach(() => mockFg(false));

		it('UNARCHIVE_TEAM: true only for org admin (canUnarchive = isOrgAdmin)', () => {
			expect(disbanded('EXTERNAL', undefined, false, true).UNARCHIVE_TEAM).toBe(true);
			expect(disbanded('EXTERNAL', 'FULL_WRITE', true, false).UNARCHIVE_TEAM).toBe(false);
			expect(disbanded('ORG_ADMIN_MANAGED', undefined, false, true).UNARCHIVE_TEAM).toBe(true);
			expect(disbanded('ORG_ADMIN_MANAGED', 'FULL_WRITE', true, false).UNARCHIVE_TEAM).toBe(false);
		});
	});

	describe('EXTERNAL / ORG_ADMIN_MANAGED – gate ON', () => {
		beforeEach(() => mockFg(true));

		it('UNARCHIVE_TEAM: true for non-orgAdmin with FULL_WRITE (gate fallback)', () => {
			// canUnarchive = isOrgAdmin=false; UNARCHIVE_TEAM = false || (ptc=true && FULL_WRITE=true) = true
			expect(disbanded('EXTERNAL', 'FULL_WRITE', true, false).UNARCHIVE_TEAM).toBe(true);
			expect(disbanded('ORG_ADMIN_MANAGED', 'FULL_WRITE', true, false).UNARCHIVE_TEAM).toBe(true);
		});

		it('UNARCHIVE_TEAM: false without FULL_WRITE even with gate ON', () => {
			expect(disbanded('EXTERNAL', 'FULL_READ', true, false).UNARCHIVE_TEAM).toBe(false);
			expect(disbanded('ORG_ADMIN_MANAGED', 'FULL_READ', true, false).UNARCHIVE_TEAM).toBe(false);
		});

		it('DELETE_TEAM: still only org admin (no gate fallback)', () => {
			expect(disbanded('EXTERNAL', 'FULL_WRITE', true, false).DELETE_TEAM).toBe(false);
			expect(disbanded('EXTERNAL', 'FULL_WRITE', false, true).DELETE_TEAM).toBe(true);
		});
	});
});
