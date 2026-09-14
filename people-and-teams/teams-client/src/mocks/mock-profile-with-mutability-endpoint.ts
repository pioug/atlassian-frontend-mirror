import { mockProfileWithMutabilityRegex } from './endpoint-regexes';
import type { MockConfig } from './mock-config-2';
import { MOCK_PROFILE_MUTABILITY_RESPONSE } from './responses';

export const mockProfileWithMutabilityEndpoint: any = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.get(
		mockProfileWithMutabilityRegex,
		(_: string, options: { body: string }) => MOCK_PROFILE_MUTABILITY_RESPONSE,
		{ method: 'GET', overwriteRoutes: true, delay },
	);
};
