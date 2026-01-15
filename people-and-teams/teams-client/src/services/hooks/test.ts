import { renderHook } from '@testing-library/react';

import { teamsClient } from '../main';

import { useTeamsClientSetup, useTeamsClientSetupNext } from './use-teams-client-setup';

jest.mock('../main');

describe('useTeamsClientSetup', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('should call setTeamClientRootUrl and teamsClient.setBaseUrl when stargateRoot is defined', () => {
		const stargateRoot = 'https://stargate.example.com';
		renderHook(() => useTeamsClientSetup(stargateRoot));

		expect(teamsClient.setBaseUrl).toHaveBeenCalledWith(stargateRoot);
	});

	it('should not call setTeamClientRootUrl and teamsClient.setBaseUrl when stargateRoot is not defined', () => {
		// @ts-ignore
		renderHook(() => useTeamsClientSetup(undefined));

		expect(teamsClient.setBaseUrl).not.toHaveBeenCalled();
	});

	it('should call teamsClient.setContext with cloudId when cloudId is defined', () => {
		const cloudId = 'cloud-id-123';
		renderHook(() => useTeamsClientSetup('https://stargate.example.com', cloudId, 'org-id'));

		expect(teamsClient.setContext).toHaveBeenCalledWith({
			cloudId,
			orgId: 'org-id',
		});
	});

	it('should call teamsClient.setContext with cloudId when cloudId is defined & stargate is undefined', () => {
		const cloudId = 'cloud-id-123';
		renderHook(() => useTeamsClientSetup(undefined, cloudId, 'org-id'));

		expect(teamsClient.setContext).toHaveBeenCalledWith({
			cloudId,
			orgId: 'org-id',
		});
	});
});

describe('useTeamsClientSetupNext', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('should call setTeamClientRootUrl and teamsClient.setBaseUrl when stargateRoot is defined', () => {
		const stargateRoot = 'https://stargate.example.com';
		renderHook(() => useTeamsClientSetupNext({ stargateRoot }));

		expect(teamsClient.setBaseUrl).toHaveBeenCalledWith(stargateRoot);
	});

	it('should not call setTeamClientRootUrl and teamsClient.setBaseUrl when stargateRoot is not defined', () => {
		// @ts-ignore
		renderHook(() => useTeamsClientSetupNext({}));

		expect(teamsClient.setBaseUrl).not.toHaveBeenCalled();
	});

	it('should call teamsClient.setContext with cloudId when cloudId is defined', () => {
		const cloudId = 'cloud-id-123';
		renderHook(() => useTeamsClientSetupNext({ cloudId, orgId: 'org-id' }));

		expect(teamsClient.setContext).toHaveBeenCalledWith({
			cloudId,
			orgId: 'org-id',
		});
	});

	it('should call teamsClient.setContext with cloudId when cloudId is defined & stargate is undefined', () => {
		const cloudId = 'cloud-id-123';
		renderHook(() => useTeamsClientSetupNext({ cloudId, orgId: 'org-id' }));

		expect(teamsClient.setContext).toHaveBeenCalledWith({
			cloudId,
			orgId: 'org-id',
		});
	});

	it('should call teamsClient.setTeamCentralContext with stargateRoot, cloudId, orgId, and userId', () => {
		const stargateRoot = 'https://stargate.example.com';
		const cloudId = 'cloud-id-123';
		const orgId = 'org-id-456';
		const userId = 'user-id-789';

		renderHook(() =>
			useTeamsClientSetupNext({ stargateRoot, cloudId, orgId, principalUserId: userId }),
		);

		expect(teamsClient.setTeamCentralContext).toHaveBeenCalledWith(stargateRoot, {
			cloudId,
			orgId,
			userId,
		});
	});

	it('should not call teamsClient.setTeamCentralContext when stargateRoot is not defined', () => {
		const cloudId = 'cloud-id-123';
		const orgId = 'org-id-456';
		const userId = 'user-id-789';

		renderHook(() => useTeamsClientSetupNext({ cloudId, orgId, principalUserId: userId }));

		expect(teamsClient.setTeamCentralContext).not.toHaveBeenCalled();
	});
});
