import { mockTeamRegex } from './endpoint-regexes';
import type { MockConfig } from './mock-config-2';
import { MOCK_OPEN_TEAM_WRITE_PERMISSION_RESPONSE } from './responses';

export const mockOpenTeamWritePermissionEndpoint: any = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.get(
		mockTeamRegex,
		(test: string, options: { body: string }) => MOCK_OPEN_TEAM_WRITE_PERMISSION_RESPONSE,
		{ method: 'GET', overwriteRoutes: true, delay },
	);
};
