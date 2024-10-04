import {
	type FrontendExperimentsResponse,
	type FrontendExperimentsResult,
} from '@atlaskit/feature-gate-fetcher';

export const getFrontendExperimentsResult = (
	frontendExperimentsResponse: FrontendExperimentsResponse,
): FrontendExperimentsResult => {
	const {
		clientSdkKey,
		experimentValues,
		customAttributes: customAttributesFromFetch,
	} = frontendExperimentsResponse;
	return {
		clientSdkKey,
		experimentValues,
		customAttributesFromFetch,
	};
};
