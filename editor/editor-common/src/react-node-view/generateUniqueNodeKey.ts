// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as uuid } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateUniqueNodeKey = (): any => {
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	return uuid();
};
