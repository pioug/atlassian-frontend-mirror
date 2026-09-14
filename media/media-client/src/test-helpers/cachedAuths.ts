import type { Auth } from '@atlaskit/media-core/auth';

export const cachedAuths: { [key: string]: Promise<Auth> } = {};
