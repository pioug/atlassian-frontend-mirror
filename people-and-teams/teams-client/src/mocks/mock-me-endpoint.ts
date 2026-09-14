import { mockMeRegex } from './endpoint-regexes';
import type { MockConfig } from './mock-config-2';
import { MOCK_ME_RESPONSE } from './responses';

export const mockMeEndpoint: any = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.get(mockMeRegex, (_: string, options: { body: string }) => MOCK_ME_RESPONSE, {
		method: 'GET',
		overwriteRoutes: true,
		delay,
	});
};
