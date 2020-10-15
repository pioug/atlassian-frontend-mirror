// WARNING! DO NOTE MOVE THIS EXPORT!
// mediaState should be exported BEFORE StreamsCache import later because
// StreamsCache will try to import mediaState from here.
export { mediaState } from './cache';
export type { CachedMediaState, StateDeferredValue } from './cache';
export { isClientBasedAuth, isAsapBasedAuth, authToOwner } from './auth';
export type {
  ClientBasedAuth,
  AsapBasedAuth,
  ClientAltBasedAuth,
  Auth,
  AuthContext,
  AuthProvider,
  MediaApiConfig,
  MediaClientConfig,
} from './auth';
