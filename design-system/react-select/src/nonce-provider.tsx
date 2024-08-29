import React, { type ReactNode, useMemo } from 'react';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

interface NonceProviderProps {
	nonce: string;
	children: ReactNode;
	cacheKey: string;
}

const NonceProvider = ({ nonce, children, cacheKey }: NonceProviderProps) => {
	const emotionCache = useMemo(() => createCache({ key: cacheKey, nonce }), [cacheKey, nonce]);
	return <CacheProvider value={emotionCache}>{children}</CacheProvider>;
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default NonceProvider;
