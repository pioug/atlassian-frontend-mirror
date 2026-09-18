import { HttpError } from '../../common/utils/error/HttpError';
import { SLOIgnoreHttpError } from '../../common/utils/error/SLOIgnoreHttpError';
import { RestClient } from '../rest-client';
import type { AddMembershipReponse } from './AddMembershipReponse';
import {
	type PublicApiTeamResponse,
	type PublicApiTeamResponseWithMembers,
} from './generated/data-contracts';
import type { Member } from './Member';
import type { RemoveMembershipReponse } from './RemoveMembershipReponse';
import { V1_URL } from './V1_URL';

const SENTRY_IGNORED_ERROR_MESSAGES_CREATE = ['TEAM_NOT_FOUND'];

export class PublicApiClient extends RestClient {
	constructor(serviceUrlRoot: string) {
		super({ serviceUrl: serviceUrlRoot });
	}

	async addUsersToTeam(teamId: string, members: Member[]): Promise<AddMembershipReponse> {
		if (!members || members.length === 0) {
			const missingMembersError = new Error('Missing members to add');
			this.logException(missingMembersError, 'addUsersToTeam');
			throw missingMembersError;
		}

		const membersWithIds = members.filter((member) => !!member.accountId);

		if (membersWithIds.length !== members.length) {
			this.logException(new Error('Missing accountIds for some members'), 'addUsersToTeam');
		}

		if (membersWithIds.length === 0) {
			const missingMembersError = new Error('Missing accountIds for all members');
			this.logException(missingMembersError, 'addUsersToTeam');
			throw missingMembersError;
		}

		try {
			const orgId = this.getOrgId();
			const url = `${V1_URL}/org/${orgId}/teams/${teamId}/members/add`;

			const response = await this.postResource<AddMembershipReponse>(url, {
				members: membersWithIds,
			});
			return response;
		} catch (e) {
			this.logException(e, 'addUsersToTeam');

			if (e instanceof HttpError && SENTRY_IGNORED_ERROR_MESSAGES_CREATE.includes(e.message)) {
				throw new SLOIgnoreHttpError(e);
			}

			throw e;
		}
	}

	async removeTeamMemberships(teamId: string, members: Member[]): Promise<RemoveMembershipReponse> {
		if (!members || members.length === 0) {
			const missingMembersError = new Error('Missing members to remove');
			this.logException(missingMembersError, 'removeTeamMemberships');
			throw missingMembersError;
		}

		const membersWithIds = members.filter((member) => !!member.accountId);

		if (membersWithIds.length !== members.length) {
			this.logException(new Error('Missing accountIds for some members'), 'addUsersToTeam');
		}

		if (membersWithIds.length === 0) {
			const missingMembersError = new Error('Missing accountIds for all members');
			this.logException(missingMembersError, 'removeTeamMemberships');
			throw missingMembersError;
		}

		try {
			const orgId = this.getOrgId();
			const url = `${V1_URL}/org/${orgId}/teams/${teamId}/members/remove`;

			const response = await this.postResource<RemoveMembershipReponse>(url, {
				members: membersWithIds,
			});
			return response;
		} catch (e) {
			this.logException(e, 'removeTeamMemberships');
			throw e;
		}
	}

	async getTeamDetails(teamId: string): Promise<PublicApiTeamResponse> {
		try {
			const orgId = this.getOrgId();
			const url = `${V1_URL}/org/${orgId}/teams/${teamId}`;

			const response = await this.getResource<PublicApiTeamResponse>(url);
			return response;
		} catch (e) {
			this.logException(e, 'getTeamDetails');
			throw e;
		}
	}

	async getTeamMembers(
		teamId: string,
		first: number = 50,
		after?: string,
	): Promise<PublicApiTeamResponseWithMembers> {
		try {
			const orgId = this.getOrgId();
			const url = `${V1_URL}/org/${orgId}/teams/${teamId}/members`;

			const response = await this.postResource<PublicApiTeamResponseWithMembers>(url, {
				after,
				first,
			});
			return response;
		} catch (e) {
			this.logException(e, 'getTeamMembers');
			throw e;
		}
	}

	async restoreTeam(teamId: string): Promise<void> {
		try {
			const orgId = this.getOrgId();
			const url = `${V1_URL}/org/${orgId}/teams/${teamId}/restore`;

			return this.postResource(url);
		} catch (e) {
			this.logException(e, 'restoreTeam');
			throw e;
		}
	}
}
