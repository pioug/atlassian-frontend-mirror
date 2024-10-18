import { getATLContextUrl, isFedRamp } from '@atlaskit/atlassian-context';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import ProfileCardClient from '../ProfileCardClient';
import TeamCentralCardClient from '../TeamCentralCardClient';

jest.mock('@atlaskit/atlassian-context', () => {
	const original = jest.requireActual('@atlaskit/atlassian-context');
	return {
		...original,
		getATLContextUrl: jest.fn(),
		isFedRamp: jest.fn(),
	};
});

jest.mock('../RovoAgentCardClient', () => jest.fn().mockImplementation(() => {}));

jest.mock('../TeamCentralCardClient', () => jest.fn());

jest.mock('../TeamProfileCardClient', () => jest.fn().mockImplementation(() => {}));

jest.mock('../UserProfileCardClient', () => jest.fn().mockImplementation(() => {}));

const mockGetATLContextUrl = getATLContextUrl as jest.Mock;
const mockIsFedRamp = isFedRamp as jest.Mock;
const mockTeamCentralCardClient = TeamCentralCardClient as jest.Mock;

describe('ProfileCardClient', () => {
	const mockAtlContextUrl = 'mock-atl-context-url';
	const mockCloudId = 'mock-cloud-id';
	const mockTeamCentralBaseUrl = 'mock-team-central-base-url';
	const mockTeamCentralUrl = 'mock-team-central-url';

	const mockConfig = {
		// not actually used since we're mocking stuff, but for the sake of completeness
		cloudId: mockCloudId,
		teamCentralBaseUrl: mockTeamCentralBaseUrl,
		teamCentralUrl: mockTeamCentralUrl,
	};

	const mockGetIsGlobalExperienceWorkspace = jest.fn();

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('constructor', () => {
		beforeEach(() => {
			mockIsFedRamp.mockReturnValue(false);
			mockTeamCentralCardClient.mockImplementation(() => ({}));
		});

		describe('has TeamCentralCardClient if enabled', () => {
			ffTest(
				'enable_ptc_sharded_townsquare_calls',
				async () => {
					const profileCardClient = new ProfileCardClient({});
					expect(profileCardClient.tcClient).not.toBeUndefined();
				},
				async () => {
					const profileCardClient = new ProfileCardClient({
						teamCentralUrl: 'valid-team-central-url',
					});
					expect(profileCardClient.tcClient).not.toBeUndefined();
				},
			);
		});

		describe('does not have TeamCentralCardClient if disabled', () => {
			ffTest(
				'enable_ptc_sharded_townsquare_calls',
				async () => {
					const profileCardClient = new ProfileCardClient({ teamCentralDisabled: true });
					expect(profileCardClient.tcClient).toBeUndefined();
				},
				async () => {
					const profileCardClient = new ProfileCardClient({});
					expect(profileCardClient.tcClient).toBeUndefined();
				},
			);
		});
	});

	describe('getTeamCentralBaseUrl', () => {
		describe('it should return the team central base URL', () => {
			beforeEach(() => {
				mockTeamCentralCardClient.mockImplementation(() => ({
					getIsGlobalExperienceWorkspace: mockGetIsGlobalExperienceWorkspace,
					options: mockConfig,
				}));
			});

			ffTest(
				'enable_ptc_sharded_townsquare_calls',
				async () => {
					mockGetATLContextUrl.mockReturnValue(mockAtlContextUrl);
					mockIsFedRamp.mockReturnValue(false);

					const profileCardClient = new ProfileCardClient(mockConfig);

					{
						mockGetIsGlobalExperienceWorkspace.mockResolvedValue(true);

						const homeBaseUrl = await profileCardClient.getTeamCentralBaseUrl();

						expect(mockGetIsGlobalExperienceWorkspace).toHaveBeenCalledTimes(1);

						expect(mockGetATLContextUrl).toHaveBeenCalledTimes(1);
						expect(mockGetATLContextUrl).toHaveBeenCalledWith('home');

						expect(homeBaseUrl).toBe(mockAtlContextUrl);
					}

					mockGetATLContextUrl.mockClear();
					mockGetIsGlobalExperienceWorkspace.mockClear();

					{
						mockGetIsGlobalExperienceWorkspace.mockResolvedValue(false);

						const teamBaseUrl = await profileCardClient.getTeamCentralBaseUrl();

						expect(mockGetIsGlobalExperienceWorkspace).toHaveBeenCalledTimes(1);

						expect(mockGetATLContextUrl).toHaveBeenCalledTimes(1);
						expect(mockGetATLContextUrl).toHaveBeenCalledWith('team');

						expect(teamBaseUrl).toBe(mockAtlContextUrl);
					}
				},
				async () => {
					mockIsFedRamp.mockReturnValue(false);

					const profileCardClient = new ProfileCardClient(mockConfig);

					const baseUrl = await profileCardClient.getTeamCentralBaseUrl();
					expect(baseUrl).toBe(mockTeamCentralBaseUrl);
				},
			);
		});

		describe('it should return undefined if team central client is undefined', () => {
			ffTest(
				'enable_ptc_sharded_townsquare_calls',
				async () => {
					mockIsFedRamp.mockReturnValue(true);

					const profileCardClient = new ProfileCardClient(mockConfig);

					const baseUrl = await profileCardClient.getTeamCentralBaseUrl();

					expect(baseUrl).toBeUndefined();
				},
				async () => {
					mockIsFedRamp.mockReturnValue(true);

					const profileCardClient = new ProfileCardClient(mockConfig);

					const baseUrl = await profileCardClient.getTeamCentralBaseUrl();

					expect(baseUrl).toBeUndefined();
				},
			);
		});

		ffTest('enable_ptc_sharded_townsquare_calls', async () => {
			mockIsFedRamp.mockReturnValue(true);
			mockTeamCentralCardClient.mockImplementation(() => ({
				getIsGlobalExperienceWorkspace: mockGetIsGlobalExperienceWorkspace,
				options: {
					...mockConfig,
					cloudId: undefined,
				},
			}));

			const profileCardClient = new ProfileCardClient({
				...mockConfig,
				cloudId: undefined,
			});

			const baseUrl = await profileCardClient.getTeamCentralBaseUrl();

			expect(baseUrl).toBeUndefined();
		});
	});

	describe('shouldShowGiveKudos', () => {
		describe('should return result from checkWorkspaceExists', () => {
			const mockCheckWorkspaceExists = jest.fn();

			beforeEach(() => {
				mockCheckWorkspaceExists.mockResolvedValue(true);
				mockTeamCentralCardClient.mockImplementation(() => ({
					checkWorkspaceExists: mockCheckWorkspaceExists,
					getIsGlobalExperienceWorkspace: mockGetIsGlobalExperienceWorkspace,
					options: mockConfig,
				}));
			});

			ffTest(
				'enable_ptc_sharded_townsquare_calls',
				async () => {
					mockGetATLContextUrl.mockReturnValue(mockAtlContextUrl);
					mockIsFedRamp.mockReturnValue(false);

					const profileCardClient = new ProfileCardClient(mockConfig);

					mockGetIsGlobalExperienceWorkspace.mockResolvedValue(true);

					const shouldShowGiveKudos = await profileCardClient.shouldShowGiveKudos();

					expect(mockCheckWorkspaceExists).toHaveBeenCalledTimes(1);

					expect(shouldShowGiveKudos).toBe(true);
				},
				async () => {
					mockIsFedRamp.mockReturnValue(false);

					const profileCardClient = new ProfileCardClient(mockConfig);

					const shouldShowGiveKudos = await profileCardClient.shouldShowGiveKudos();

					expect(mockCheckWorkspaceExists).toHaveBeenCalledTimes(1);

					expect(shouldShowGiveKudos).toBe(true);
				},
			);
		});

		it('should return false if team central client is undefined', async () => {
			mockIsFedRamp.mockReturnValue(true);

			const profileCardClient = new ProfileCardClient(mockConfig);

			const shouldShowGiveKudos = await profileCardClient.shouldShowGiveKudos();

			expect(shouldShowGiveKudos).toBe(false);
		});

		// not ffTest-ing this because shouldShowGiveKudos guards against tcClient being undefined,
		// and the only way the enable_ptc_sharded_townsquare_calls code path would have team central base URL comes back undefined
		// is if the client is undefined
		it('should return false if team central base URL comes back undefined', async () => {
			mockIsFedRamp.mockReturnValue(false);
			mockTeamCentralCardClient.mockImplementation(() => ({
				getIsGlobalExperienceWorkspace: mockGetIsGlobalExperienceWorkspace,
				options: {
					...mockConfig,
					teamCentralBaseUrl: undefined,
				},
			}));

			const profileCardClient = new ProfileCardClient({
				...mockConfig,
				teamCentralBaseUrl: undefined,
			});

			const shouldShowGiveKudos = await profileCardClient.shouldShowGiveKudos();

			expect(shouldShowGiveKudos).toBe(false);
		});
	});
});
