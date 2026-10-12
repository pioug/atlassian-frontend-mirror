import { fg } from '@atlaskit/platform-feature-flags/fg';

import { SLOIgnoreError } from '../../common/utils/error/SLOIgnoreError';
import { type TeamSlackRequestOptions } from '../../types/slack';
import { DEFAULT_CONFIG } from '../constants';
import { RestClient } from '../rest-client';
import { redirectCount } from '../rest-client/utils/redirect-count';

const GLOBAL_EDGE_ORIGIN = new URL(DEFAULT_CONFIG.teamsInSlackServiceUrl).origin;

const defaultConfig = {
	get serviceUrl() {
		return fg('ptc-onboard-teams-slack-app-to-global-edge-url')
			? DEFAULT_CONFIG.teamsInSlackServiceUrl
			: `${DEFAULT_CONFIG.stargateRoot}/teamsslack/api/team`;
	},
};

// Shared in-flight probe: concurrent callers coalesce onto one fetch rather
// than each firing their own and racing on the flag.
let staffyAuthProbe: Promise<boolean> | null = null;

// Prevents an infinite redirect loop if Okta completes but auth still fails.
// Resets on full page reload — correct, since a reload after login should retry.
let staffyAuthAttempted = false;

interface TeamInSlackResponse {
	connected: boolean;
	slackChannelId: string;
	slackChannelName: string;
	usergroupHandle: string;
}

type TeamInSlackResult = TeamInSlackResponse & { id: string };

export class TeamsInSlackClient extends RestClient {
	constructor(config = {}) {
		super({ ...defaultConfig, ...config });
	}

	/**
	 * Pre-flight auth probe for Staffy Global Edge calls (COMMIT-27483).
	 * Fetches /api/authping with credentials:'include'. On failure (302→Okta),
	 * navigates to /staffy/login?return_to=<current URL> for top-level Okta SSO,
	 * or rejects without navigating when `skipAuthRedirect` is set.
	 * No-op when the gate is OFF (Stargate path).
	 */
	private async ensureStaffyAuth(options?: TeamSlackRequestOptions): Promise<void> {
		if (!fg('ptc-onboard-teams-slack-app-to-global-edge-url')) {
			return;
		}

		staffyAuthProbe ??= fetch(`${GLOBAL_EDGE_ORIGIN}/api/authping`, { credentials: 'include' })
			.then((r) => r.ok)
			.catch(() => false)
			.finally(() => {
				staffyAuthProbe = null;
			});

		const authenticated = await staffyAuthProbe;

		if (authenticated) {
			staffyAuthAttempted = false;
			return;
		}

		if (options?.skipAuthRedirect) {
			throw new SLOIgnoreError({ message: 'Staffy session missing, skipping login redirect' });
		}

		if (staffyAuthAttempted) {
			// Already redirected once — let the call proceed and surface the error.
			return;
		}

		staffyAuthAttempted = true;
		redirectCount.increment();
		const returnTo = encodeURIComponent(window.location.href);
		window.location.assign(`${GLOBAL_EDGE_ORIGIN}/staffy/login?return_to=${returnTo}`);
		throw new SLOIgnoreError({ message: 'Redirecting to Staffy login' });
	}

	async getTeamInSlack(
		teamId: string,
		teamName: string,
		options?: TeamSlackRequestOptions,
	): Promise<TeamInSlackResult> {
		await this.ensureStaffyAuth(options);
		return this.getResource<TeamInSlackResponse>(
			`/${teamId}?teamName=${encodeURIComponent(teamName)}`,
		).then((response) => ({ id: teamId, ...response }));
	}

	async disconnectTeamInSlack(
		teamId: string,
		options?: TeamSlackRequestOptions,
	): Promise<TeamInSlackResult> {
		await this.ensureStaffyAuth(options);
		return this.deleteResource<TeamInSlackResponse>(`/${teamId}`).then((response) => ({
			id: teamId,
			...response,
		}));
	}

	async updateTeamInSlack(
		teamId: string,
		channelId: string,
		usergroupHandle: string,
		options?: TeamSlackRequestOptions,
	): Promise<TeamInSlackResult> {
		await this.ensureStaffyAuth(options);
		return this.postResource<TeamInSlackResponse>(
			`/${teamId}?channel=${channelId}&groupName=${usergroupHandle}`,
		).then((response) => ({ id: teamId, ...response }));
	}
}
