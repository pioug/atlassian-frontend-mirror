import { Router } from 'kakapo';
import {
  type MediaDatabaseSchema,
  userAuthProvider,
  tenantAuthProvider,
} from '../database';

export function createMediaPlaygroundRouter() {
  const router = new Router<MediaDatabaseSchema>(
    {
      host: 'https://media-playground.dev.atl-paas.net',
      requestDelay: 10,
    },
    { strategies: ['fetch'] },
  );

  router.get('/api/token/user/impersonation', userAuthProvider);

  router.post('/token/tenant', tenantAuthProvider);

  return router;
}
