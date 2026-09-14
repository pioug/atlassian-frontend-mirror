import { getDocument } from '@atlaskit/browser-apis';

export const getEnvironment = (): 'prod' | 'staging' => {
	const browserDocument = getDocument();
	// @ts-expect-error
	return browserDocument?.querySelector('meta[name=ajs-environment]')?.content === 'staging'
		? 'staging'
		: 'prod';
};
