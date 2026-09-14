/// <reference types="node" />
// for typing `process`

export const addHeaders = (headers: Headers): Headers => {
	headers.append('X-ExperimentalApi', 'teams-beta');
	headers.append('X-ExperimentalApi', 'team-members-beta');
	headers.append('atl-client-name', process.env._PACKAGE_NAME_ as string);
	headers.append('atl-client-version', process.env._PACKAGE_VERSION_ as string);

	return headers;
};
