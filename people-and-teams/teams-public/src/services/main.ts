import { aggClient } from './agg-client';
import { type ClientContextProps, type TeamContainers } from './types';

type AwaitedReturn<T extends (...args: any) => any> = Awaited<ReturnType<T>>;

export class TeamsClient {
	private readonly _aggClient = aggClient;

	constructor(
		/**
		 * @param {ClientContextProps} context - Context including CloudId & OrgId to be used for all requests
		 */
		context?: ClientContextProps,
	) {
		if (context) {
			this.setContext(context);
		}
	}

	/**
	 * Sets the base URL to be used in the client requests
	 * @param {string} baseUrl - The new base URL
	 */
	setBaseUrl(baseUrl: string) {
		this._aggClient.setBaseUrl(baseUrl);
	}

	/**
	 * Sets context including CloudId & OrgId to be used for all requests
	 */
	setContext(context: ClientContextProps) {
		this._aggClient.setContext(context);
	}

	/**
	 * Get the containers for a given team
	 * @param {string} teamId
	 * @returns {Promise<TeamContainers>}
	 */
	async getTeamContainers(teamId: string): Promise<TeamContainers> {
		return this._aggClient.getTeamContainers(teamId);
	}

	/**
	 * Unlink a container from a team
	 * @param {string} teamId
	 * @param {string} containerId
	 * @returns {Promise<void>}
	 */
	async unlinkTeamContainer(
		teamId: string,
		containerId: string,
	): Promise<AwaitedReturn<typeof this._aggClient.unlinkTeamContainer>> {
		return this._aggClient.unlinkTeamContainer(teamId, containerId);
	}
}

export const teamsClient = new TeamsClient();
