import type { ContextToken, SurfaceContext } from './types';

export const createSurfaceContext = <T>(token: ContextToken<T>, value: T): SurfaceContext => ({
	get: <Requested>(requestedToken: ContextToken<Requested>) =>
		requestedToken === token ? (value as unknown as Requested) : undefined,
});
