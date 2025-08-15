import { Router } from 'kakapo';
import { type MediaDatabaseSchema, userAuthProvider, tenantAuthProvider } from '../database';
import { MEDIA_PLAYGROUND_BASE_URL } from '../../mediaBaseURLS';

export function createMediaPlaygroundRouter() {
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
