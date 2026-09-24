/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required, @atlaskit/volt-strict-mode/no-re-exports, @atlaskit/editor/no-re-export -- VOLTC-139 tracks removal of these deprecated APIs. */

import { type ChunkHashAlgorithm } from './ChunkHashAlgorithm';

export interface ClientAltBasedAuth {
	readonly id: string;
	readonly token: string;
	readonly baseUrl: string;
}

export interface ClientBasedAuth {
	readonly clientId: string;
	readonly token: string;
	readonly baseUrl: string;
}

export interface AsapBasedAuth {
	readonly asapIssuer: string;
	readonly token: string;
	readonly baseUrl: string;
}

export type Auth = ClientBasedAuth | AsapBasedAuth;

export interface MediaClientConfig {
	readonly authProvider: AuthProvider;
	readonly initialAuth?: Auth;
	readonly stargateBaseUrl?: string;
	readonly getAuthFromContext?: AuthFromContextProvider;
	/** @deprecated This option has no effect. SHA256 is used for all uploads. */
	readonly useSha256ForUploads?: boolean;
	readonly authProviderTimeoutMs?: number;
	readonly enforceDataSecurityPolicy?: boolean;
}

type MediaAccessUrn =
	| { type: 'clients'; actions: Array<'create'> }
	| { type: 'files'; actions: Array<'create'> }
	| { type: 'file'; id: string; actions: Array<'read' | 'update' | 'delete'> }
	| { type: 'chunk'; actions: Array<'create' | 'read'> }
	| { type: 'chunk'; eTag: string; actions: Array<'create' | 'read'> }
	| { type: 'uploads'; actions: Array<'create'> }
	| { type: 'upload'; id: string; actions: Array<'read' | 'update'> }
	| { type: 'collections'; actions: Array<'create'> }
	| { type: 'collection'; name: string; actions: Array<'read' | 'update' | 'insert' | 'delete'> };

export interface AuthContext {
	readonly access?: MediaAccessUrn[];
	/** @deprecated Use access `type: 'collection'` instead */
	readonly collectionName?: string;
}

export type AuthProvider = (context?: AuthContext) => Promise<Auth>;

export type AuthFromContextProvider = (contextId: string) => Promise<Auth>;

export type MediaApiConfig = {
	authProvider: AuthProvider;
	initialAuth?: Auth;
	chunkHashAlgorithm?: ChunkHashAlgorithm;
	authProviderTimeout?: number;
};
