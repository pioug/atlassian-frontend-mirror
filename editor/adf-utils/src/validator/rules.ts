import { isSafeUrl } from '@atlaskit/adf-schema/url';

export const validatorFnMap: {
	[key: string]: (value: string) => boolean;
} = {
	safeUrl: isSafeUrl,
};
