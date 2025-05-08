import { DEFAULT_CONFIG } from '../constants';

import { TeamCentralClient } from './index';

describe('TeamCentralClient', () => {
	let teamCentralClient: TeamCentralClient;

	beforeEach(() => {
		teamCentralClient = new TeamCentralClient(DEFAULT_CONFIG.stargateRoot, {
			logException: jest.fn(),
		});
	});

	it('should set baseUrl correctly', () => {
		const baseUrl = 'https://new-base-url.com';
		teamCentralClient.setBaseUrl(baseUrl);
		expect(teamCentralClient['serviceUrl']).toEqual(`${baseUrl}/watermelon/graphql`);

		// Test with cloudId
		const cloudId = 'cloudId';
		teamCentralClient.setContext({ cloudId });
		teamCentralClient.setBaseUrl(baseUrl);
		expect(teamCentralClient['serviceUrl']).toEqual(`${baseUrl}/townsquare/s/${cloudId}/graphql`);
	});
});
