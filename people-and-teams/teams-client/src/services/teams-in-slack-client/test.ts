import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { DEFAULT_CONFIG } from '../constants';
import { TeamsInSlackClient } from './TeamsInSlackClient';

const GLOBAL_EDGE_ORIGIN = new URL(DEFAULT_CONFIG.teamsInSlackServiceUrl).origin;
const HOST_PAGE_URL = 'https://jira.example.com/browse/PTC-17437';
const GLOBAL_EDGE_GATE = 'ptc-onboard-teams-slack-app-to-global-edge-url';

const buildSlackResponse = () => ({
	connected: true,
	slackChannelId: 'C123',
	slackChannelName: 'team-channel',
	usergroupHandle: 'team-handle',
});

const mockStaffySession = ({ authenticated }: { authenticated: boolean }) =>
	jest.spyOn(global, 'fetch').mockResolvedValue({ ok: authenticated } as Response);

const createClient = () => {
	const client = new TeamsInSlackClient();

	return {
		client,
		getResource: jest.spyOn(client, 'getResource').mockResolvedValue(buildSlackResponse()),
		deleteResource: jest.spyOn(client, 'deleteResource').mockResolvedValue(buildSlackResponse()),
		postResource: jest.spyOn(client, 'postResource').mockResolvedValue(buildSlackResponse()),
	};
};

const clearStaffyRedirectLatch = async () => {
	mockStaffySession({ authenticated: true });
	const { client } = createClient();
	await client.getTeamInSlack('latch-reset', 'Latch reset');
};

const originalLocation = window.location;

beforeEach(() => {
	Object.defineProperty(window, 'location', {
		configurable: true,
		writable: true,
		value: { href: HOST_PAGE_URL, assign: jest.fn() },
	});
});

afterEach(() => {
	jest.restoreAllMocks();
	Object.defineProperty(window, 'location', {
		configurable: true,
		writable: true,
		value: originalLocation,
	});
});

describe('TeamsInSlackClient Staffy authentication', () => {
	it('does not probe Staffy at all while the Global Edge gate is off', async () => {
		failGate(GLOBAL_EDGE_GATE);
		const probe = mockStaffySession({ authenticated: false });
		const { client, getResource } = createClient();

		await client.getTeamInSlack('team-id', 'Team name');

		expect(probe).not.toHaveBeenCalled();
		expect(window.location.assign).not.toHaveBeenCalled();
		expect(getResource).toHaveBeenCalled();
	});

	it('probes Staffy and proceeds when the session is valid', async () => {
		passGate(GLOBAL_EDGE_GATE);
		const probe = mockStaffySession({ authenticated: true });
		const { client, getResource } = createClient();

		await client.getTeamInSlack('team-id', 'Team name');

		expect(probe).toHaveBeenCalledWith(`${GLOBAL_EDGE_ORIGIN}/api/authping`, {
			credentials: 'include',
		});
		expect(window.location.assign).not.toHaveBeenCalled();
		expect(getResource).toHaveBeenCalled();
	});

	it('redirects the top-level window to Staffy login when the session is missing', async () => {
		passGate(GLOBAL_EDGE_GATE);
		await clearStaffyRedirectLatch();

		mockStaffySession({ authenticated: false });
		const { client, getResource } = createClient();

		await expect(client.getTeamInSlack('team-id', 'Team name')).rejects.toThrow(
			'Redirecting to Staffy login',
		);
		expect(window.location.assign).toHaveBeenCalledWith(
			`${GLOBAL_EDGE_ORIGIN}/staffy/login?return_to=${encodeURIComponent(HOST_PAGE_URL)}`,
		);
		expect(getResource).not.toHaveBeenCalled();
	});

	it('rejects without redirecting when skipAuthRedirect is set and the session is missing', async () => {
		passGate(GLOBAL_EDGE_GATE);
		mockStaffySession({ authenticated: false });
		const { client, getResource } = createClient();

		await expect(
			client.getTeamInSlack('team-id', 'Team name', { skipAuthRedirect: true }),
		).rejects.toThrow('Staffy session missing, skipping login redirect');
		expect(window.location.assign).not.toHaveBeenCalled();
		expect(getResource).not.toHaveBeenCalled();
	});

	it('still returns the Slack connection when skipAuthRedirect is set and the session is valid', async () => {
		passGate(GLOBAL_EDGE_GATE);
		mockStaffySession({ authenticated: true });
		const { client, getResource } = createClient();

		await client.getTeamInSlack('team-id', 'Team name', { skipAuthRedirect: true });

		expect(window.location.assign).not.toHaveBeenCalled();
		expect(getResource).toHaveBeenCalled();
	});

	it('leaves the single redirect available to a later request after skipping one', async () => {
		passGate(GLOBAL_EDGE_GATE);
		await clearStaffyRedirectLatch();

		mockStaffySession({ authenticated: false });
		const { client } = createClient();

		await expect(
			client.getTeamInSlack('team-id', 'Team name', { skipAuthRedirect: true }),
		).rejects.toThrow();
		await expect(client.getTeamInSlack('team-id', 'Team name')).rejects.toThrow();

		expect(window.location.assign).toHaveBeenCalledTimes(1);
	});

	it('skips the redirect for disconnectTeamInSlack when skipAuthRedirect is set', async () => {
		passGate(GLOBAL_EDGE_GATE);
		mockStaffySession({ authenticated: false });
		const { client, deleteResource } = createClient();

		await expect(
			client.disconnectTeamInSlack('team-id', { skipAuthRedirect: true }),
		).rejects.toThrow('Staffy session missing, skipping login redirect');
		expect(window.location.assign).not.toHaveBeenCalled();
		expect(deleteResource).not.toHaveBeenCalled();
	});

	it('skips the redirect for updateTeamInSlack when skipAuthRedirect is set', async () => {
		passGate(GLOBAL_EDGE_GATE);
		mockStaffySession({ authenticated: false });
		const { client, postResource } = createClient();

		await expect(
			client.updateTeamInSlack('team-id', 'C123', 'team-handle', { skipAuthRedirect: true }),
		).rejects.toThrow('Staffy session missing, skipping login redirect');
		expect(window.location.assign).not.toHaveBeenCalled();
		expect(postResource).not.toHaveBeenCalled();
	});
});
