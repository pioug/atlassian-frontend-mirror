// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid/v4';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateUniqueNodeKey = (): any => {
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	return uuid();
};
