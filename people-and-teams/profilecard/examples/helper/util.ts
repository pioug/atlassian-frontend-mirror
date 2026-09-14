import { modifyResponse } from '../../src/client/modifyResponse';
import ProfileClient from '../../src/client/ProfileCardClient';
import getMockProfileClientUtil from '../../src/mocks/mock-profile-client';
import getMockTeamClient from '../../src/mocks/mock-team-client';
import type { ProfilecardProps, ProfileClientOptions } from '../../src/types';

export const getMockProfileClient = (
	cacheSize: number,
	cacheMaxAge: number,
	extraProps: ProfilecardProps = {},
	extraOptions?: ProfileClientOptions,
): any => {
	const MockProfileClient = getMockProfileClientUtil(
		ProfileClient,
		// @ts-ignore
		(response) => {
			return {
				...modifyResponse(response),
				...extraProps,
			};
		},
	);

	return new MockProfileClient({
		cacheSize,
		cacheMaxAge,
		...extraOptions,
	});
};

export default null;

export { getMockTeamClient };
