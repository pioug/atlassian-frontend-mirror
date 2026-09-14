import { mockMembersRegex } from './endpoint-regexes';
import type { MockConfig } from './mock-config-2';
import { MOCK_MEMBERS_ME_REQUESTING_RESPONSE } from './responses';

export const mockMembersMeRequestingToJoinEndpoint: any = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.get(
		mockMembersRegex,
		(_: string, options: { body: string }) => MOCK_MEMBERS_ME_REQUESTING_RESPONSE,
		{ method: 'GET', overwriteRoutes: true, delay },
	);
};
