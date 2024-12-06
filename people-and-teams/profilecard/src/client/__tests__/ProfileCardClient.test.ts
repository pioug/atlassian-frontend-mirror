import { getATLContextUrl, isFedRamp } from '@atlaskit/atlassian-context';

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
	const mockOrgId = 'mock-org-id';

	const mockConfig = {
		// not actually used since we're mocking stuff, but for the sake of completeness
		cloudId: mockCloudId,
	};

	const mockGetIsGlobalExperienceWorkspace = jest.fn();

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('constructor', () => {
		beforeEach(() => {
			mockTeamCentralCardClient.mockImplementation(() => ({}));
		});

		it('has TeamCentralCardClient if enabled', () => {
			mockIsFedRamp.mockReturnValue(false);
			const profileCardClient = new ProfileCardClient({});
			expect(profileCardClient.tcClient).not.toBeUndefined();
		});

		it('does not have TeamCentralCardClient if disabled', () => {
			mockIsFedRamp.mockReturnValue(false);
			const profileCardClient = new ProfileCardClient({ teamCentralDisabled: true });
			expect(profileCardClient.tcClient).toBeUndefined();
		});

		it('does not have TeamCentralCardClient if FedRAMP', () => {
			mockIsFedRamp.mockReturnValue(true);
			const profileCardClient = new ProfileCardClient({});
			expect(profileCardClient.tcClient).toBeUndefined();
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

			it('should return home for team central base URL if workspace is global experience', async () => {
				mockGetATLContextUrl.mockReturnValue(mockAtlContextUrl);
				mockGetIsGlobalExperienceWorkspace.mockResolvedValue(true);
				mockIsFedRamp.mockReturnValue(false);

				const profileCardClient = new ProfileCardClient(mockConfig);

				const homeBaseUrl = await profileCardClient.getTeamCentralBaseUrl();

				expect(mockGetIsGlobalExperienceWorkspace).toHaveBeenCalledTimes(1);

				expect(mockGetATLContextUrl).toHaveBeenCalledTimes(1);
				expect(mockGetATLContextUrl).toHaveBeenCalledWith('home');

				expect(homeBaseUrl).toBe(mockAtlContextUrl);
			});

			it('should return team for team central base URL', async () => {
				mockGetATLContextUrl.mockReturnValue(mockAtlContextUrl);
				mockGetIsGlobalExperienceWorkspace.mockResolvedValue(false);
				mockIsFedRamp.mockReturnValue(false);

				const profileCardClient = new ProfileCardClient(mockConfig);

				const teamBaseUrl = await profileCardClient.getTeamCentralBaseUrl();

				expect(mockGetIsGlobalExperienceWorkspace).toHaveBeenCalledTimes(1);

				expect(mockGetATLContextUrl).toHaveBeenCalledTimes(1);
				expect(mockGetATLContextUrl).toHaveBeenCalledWith('team');

				expect(teamBaseUrl).toBe(mockAtlContextUrl);
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

			it('it should return home for team central base URL org-scoped if workspace is global experience, and org ID is defined', async () => {
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
			});

			it('it should return home for team central base URL site-scoped if workspace is global experience, and org and cloud ID are defined', async () => {
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
			});

			it('it should return team for team central base URL unscoped if workspace is not global experience', async () => {
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
			});

			it('it should return undefined for team central base URL if org-scoping requested, workspace is global experience, but org ID is null', async () => {
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
			});

			it.skip('it should return undefined for team central base URL if site-scoping requested, workspace is global experience, org ID is defined, but cloud ID is undefined', () => {
				// this case is not possible, as the org ID is resolved from the cloud ID; keeping this here just to document this
			});
		});

		describe('team central unconfigured', () => {
			it('it should return undefined for team central base URL if team central client is undefined', async () => {
				mockIsFedRamp.mockReturnValue(true);

				const profileCardClient = new ProfileCardClient(mockConfig);

				const baseUrl = await profileCardClient.getTeamCentralBaseUrl();

				expect(baseUrl).toBeUndefined();
			});

			it('it should return undefined for team central base URL if the cloud ID is undefined', async () => {
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

	describe('shouldShowGiveKudos', () => {
		it('should return result from checkWorkspaceExists', async () => {
			const mockCheckWorkspaceExists = jest.fn().mockResolvedValue(true);
			mockTeamCentralCardClient.mockImplementation(() => ({
				checkWorkspaceExists: mockCheckWorkspaceExists,
				getIsGlobalExperienceWorkspace: mockGetIsGlobalExperienceWorkspace,
				options: mockConfig,
			}));

			mockGetATLContextUrl.mockReturnValue(mockAtlContextUrl);
			mockIsFedRamp.mockReturnValue(false);

			const profileCardClient = new ProfileCardClient(mockConfig);

			mockGetIsGlobalExperienceWorkspace.mockResolvedValue(true);

			const shouldShowGiveKudos = await profileCardClient.shouldShowGiveKudos();

			expect(mockCheckWorkspaceExists).toHaveBeenCalledTimes(1);

			expect(shouldShowGiveKudos).toBe(true);
		});

		it('should return false if team central client is undefined', async () => {
			mockIsFedRamp.mockReturnValue(true);

			const profileCardClient = new ProfileCardClient(mockConfig);

			const shouldShowGiveKudos = await profileCardClient.shouldShowGiveKudos();

			expect(shouldShowGiveKudos).toBe(false);
		});
	});
});
