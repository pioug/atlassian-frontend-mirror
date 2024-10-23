import { getATLContextUrl, isFedRamp } from '@atlaskit/atlassian-context';
import { fg } from '@atlaskit/platform-feature-flags';
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

// ffTest checks that some feature gate is checked
const noopTestCase = () => {
	fg('enable_ptc_sharded_townsquare_calls');
};

describe('ProfileCardClient', () => {
	const mockAtlContextUrl = 'mock-atl-context-url';
	const mockCloudId = 'mock-cloud-id';
	const mockOrgId = 'mock-org-id';
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
		const mockGetOrgId = jest.fn();

		describe('without attempting scoping', () => {
			beforeEach(() => {
				mockTeamCentralCardClient.mockImplementation(() => ({
					getIsGlobalExperienceWorkspace: mockGetIsGlobalExperienceWorkspace,
					options: mockConfig,
				}));
			});

			describe('should return home for team central base URL if workspace is global experience', () => {
				// eslint-disable-next-line @atlaskit/platform/ensure-test-runner-arguments
				ffTest(
					'enable_ptc_sharded_townsquare_calls',
					async () => {
						mockGetATLContextUrl.mockReturnValue(mockAtlContextUrl);
						mockGetIsGlobalExperienceWorkspace.mockResolvedValue(true);
						mockIsFedRamp.mockReturnValue(false);

						const profileCardClient = new ProfileCardClient(mockConfig);

						const homeBaseUrl = await profileCardClient.getTeamCentralBaseUrl();

						expect(mockGetIsGlobalExperienceWorkspace).toHaveBeenCalledTimes(1);

						expect(mockGetATLContextUrl).toHaveBeenCalledTimes(1);
						expect(mockGetATLContextUrl).toHaveBeenCalledWith('home');

						expect(homeBaseUrl).toBe(mockAtlContextUrl);
					},
					noopTestCase,
				);
			});

			describe('should return team for team central base URL', () => {
				ffTest(
					'enable_ptc_sharded_townsquare_calls',
					async () => {
						mockGetATLContextUrl.mockReturnValue(mockAtlContextUrl);
						mockGetIsGlobalExperienceWorkspace.mockResolvedValue(false);
						mockIsFedRamp.mockReturnValue(false);

						const profileCardClient = new ProfileCardClient(mockConfig);

						const teamBaseUrl = await profileCardClient.getTeamCentralBaseUrl();

						expect(mockGetIsGlobalExperienceWorkspace).toHaveBeenCalledTimes(1);

						expect(mockGetATLContextUrl).toHaveBeenCalledTimes(1);
						expect(mockGetATLContextUrl).toHaveBeenCalledWith('team');

						expect(teamBaseUrl).toBe(mockAtlContextUrl);
					},
					async () => {
						mockIsFedRamp.mockReturnValue(false);

						const profileCardClient = new ProfileCardClient(mockConfig);

						const baseUrl = await profileCardClient.getTeamCentralBaseUrl();
						expect(baseUrl).toBe(mockTeamCentralBaseUrl);
					},
				);
			});
		});

		describe('attempt scoping', () => {
			beforeEach(() => {
				mockTeamCentralCardClient.mockImplementation(() => ({
					getIsGlobalExperienceWorkspace: mockGetIsGlobalExperienceWorkspace,
					getOrgId: mockGetOrgId,
					options: mockConfig,
				}));
			});

			describe('it should return home for team central base URL org-scoped if workspace is global experience, and org ID is defined', () => {
				// eslint-disable-next-line @atlaskit/platform/ensure-test-runner-arguments
				ffTest(
					'enable_ptc_sharded_townsquare_calls',
					async () => {
						mockGetATLContextUrl.mockReturnValue(mockAtlContextUrl);
						mockGetIsGlobalExperienceWorkspace.mockResolvedValue(true);
						mockIsFedRamp.mockReturnValue(false);
						mockGetOrgId.mockResolvedValue(mockOrgId);

						const profileCardClient = new ProfileCardClient(mockConfig);

						const homeBaseUrl = await profileCardClient.getTeamCentralBaseUrl({
							withOrgContext: true,
							withSiteContext: false,
						});

						expect(mockGetIsGlobalExperienceWorkspace).toHaveBeenCalledTimes(1);

						expect(mockGetOrgId).toHaveBeenCalledTimes(1);

						expect(mockGetATLContextUrl).toHaveBeenCalledTimes(1);
						expect(mockGetATLContextUrl).toHaveBeenCalledWith('home');

						expect(homeBaseUrl).toBe(`${mockAtlContextUrl}/o/${mockOrgId}`);
					},
					noopTestCase,
				);
			});

			describe('it should return home for team central base URL site-scoped if workspace is global experience, and org and cloud ID are defined', () => {
				// eslint-disable-next-line @atlaskit/platform/ensure-test-runner-arguments
				ffTest(
					'enable_ptc_sharded_townsquare_calls',
					async () => {
						mockGetATLContextUrl.mockReturnValue(mockAtlContextUrl);
						mockGetIsGlobalExperienceWorkspace.mockResolvedValue(true);
						mockIsFedRamp.mockReturnValue(false);
						mockGetOrgId.mockResolvedValue(mockOrgId);

						const profileCardClient = new ProfileCardClient(mockConfig);

						const homeBaseUrl = await profileCardClient.getTeamCentralBaseUrl({
							withOrgContext: true,
							withSiteContext: true,
						});

						expect(mockGetIsGlobalExperienceWorkspace).toHaveBeenCalledTimes(1);

						expect(mockGetOrgId).toHaveBeenCalledTimes(1);

						expect(mockGetATLContextUrl).toHaveBeenCalledTimes(1);
						expect(mockGetATLContextUrl).toHaveBeenCalledWith('home');

						expect(homeBaseUrl).toBe(`${mockAtlContextUrl}/o/${mockOrgId}/s/${mockCloudId}`);
					},
					noopTestCase,
				);
			});

			describe('it should return team for team central base URL unscoped if workspace is not global experience', () => {
				// eslint-disable-next-line @atlaskit/platform/ensure-test-runner-arguments
				ffTest(
					'enable_ptc_sharded_townsquare_calls',
					async () => {
						mockGetATLContextUrl.mockReturnValue(mockAtlContextUrl);
						mockGetIsGlobalExperienceWorkspace.mockResolvedValue(false);
						mockIsFedRamp.mockReturnValue(false);

						const profileCardClient = new ProfileCardClient(mockConfig);

						const teamBaseUrl = await profileCardClient.getTeamCentralBaseUrl({
							withOrgContext: true,
							withSiteContext: true,
						});

						expect(mockGetIsGlobalExperienceWorkspace).toHaveBeenCalledTimes(1);

						expect(mockGetATLContextUrl).toHaveBeenCalledTimes(1);
						expect(mockGetATLContextUrl).toHaveBeenCalledWith('team');

						expect(teamBaseUrl).toBe(mockAtlContextUrl);

						expect(mockGetOrgId).not.toHaveBeenCalled();
					},
					noopTestCase,
				);
			});

			describe('it should return undefined for team central base URL if org-scoping requested, workspace is global experience, but org ID is null', () => {
				// eslint-disable-next-line @atlaskit/platform/ensure-test-runner-arguments
				ffTest(
					'enable_ptc_sharded_townsquare_calls',
					async () => {
						mockGetATLContextUrl.mockReturnValue(mockAtlContextUrl);
						mockGetIsGlobalExperienceWorkspace.mockResolvedValue(true);
						mockIsFedRamp.mockReturnValue(false);
						mockGetOrgId.mockResolvedValue(null);

						const profileCardClient = new ProfileCardClient(mockConfig);

						const homeBaseUrl = await profileCardClient.getTeamCentralBaseUrl({
							withOrgContext: true,
							withSiteContext: true,
						});

						expect(mockGetIsGlobalExperienceWorkspace).toHaveBeenCalledTimes(1);

						expect(mockGetOrgId).toHaveBeenCalledTimes(1);

						expect(mockGetATLContextUrl).not.toHaveBeenCalled();

						expect(homeBaseUrl).toBeUndefined();
					},
					noopTestCase,
				);
			});

			it.skip('it should return undefined for team central base URL if site-scoping requested, workspace is global experience, org ID is defined, but cloud ID is undefined', () => {
				// this case is not possible, as the org ID is resolved from the cloud ID; keeping this here just to document this
			});
		});

		describe('team central unconfigured', () => {
			describe('it should return undefined for team central base URL if team central client is undefined', () => {
				ffTest('enable_ptc_sharded_townsquare_calls', async () => {
					mockIsFedRamp.mockReturnValue(true);

					const profileCardClient = new ProfileCardClient(mockConfig);

					const baseUrl = await profileCardClient.getTeamCentralBaseUrl();

					expect(baseUrl).toBeUndefined();
				});
			});

			describe('it should return undefined for team central base URL if the cloud ID is undefined', () => {
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
