import { Router } from 'kakapo';

import { MEDIA_PLAYGROUND_BASE_URL } from '../../mediaBaseURLS';
import { type MediaDatabaseSchema, userAuthProvider, tenantAuthProvider } from '../database';

export function createMediaPlaygroundRouter(): Router<MediaDatabaseSchema> {
	const router = new Router<MediaDatabaseSchema>(
		{
			host: MEDIA_PLAYGROUND_BASE_URL,
			requestDelay: 10,
		},
		{ strategies: ['fetch'] },
	);

	router.get('/api/token/user/impersonation', userAuthProvider);

	router.post('/token/tenant', tenantAuthProvider);

	return router;
}
