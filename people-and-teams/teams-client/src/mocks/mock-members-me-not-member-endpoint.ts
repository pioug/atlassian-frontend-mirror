import { mockMembersRegex } from './endpoint-regexes';
import type { MockConfig } from './mock-config-2';

export const mockMembersMeNotMemberEndpoint: any = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.get(mockMembersRegex, 404, {
		method: 'GET',
		overwriteRoutes: true,
		delay,
	});
};
