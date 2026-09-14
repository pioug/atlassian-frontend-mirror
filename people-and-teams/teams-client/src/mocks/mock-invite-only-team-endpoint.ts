import { mockTeamRegex } from './endpoint-regexes';
import type { MockConfig } from './mock-config-2';
import { MOCK_INVITE_ONLY_TEAM_RESPONSE } from './responses';

export const mockInviteOnlyTeamEndpoint: any = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.get(
		mockTeamRegex,
		(test: string, options: { body: string }) => MOCK_INVITE_ONLY_TEAM_RESPONSE,
		{ method: 'GET', overwriteRoutes: true, delay },
	);
};
