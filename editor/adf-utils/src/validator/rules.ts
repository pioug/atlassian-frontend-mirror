import { isSafeUrl } from '@atlaskit/adf-schema/url';

export const validatorFnMap: {
	[key: string]: (value: string) => boolean;
} = {
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	safeUrl: isSafeUrl,
};
