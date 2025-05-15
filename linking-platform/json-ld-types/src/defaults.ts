import type { JsonLd } from './jsonld';

interface JsonLdDefaults {
	meta: {
		public: JsonLd.Meta.Public;
		granted: JsonLd.Meta.Granted;
		unauthorized: JsonLd.Meta.Unauthorized;
		permissionDenied: JsonLd.Meta.PermissionDenied;
		notFound: JsonLd.Meta.NotFound;
	};
}

const defaultMetaPublic: JsonLd.Meta.Public = {
	visibility: 'public',
	access: 'granted',
};
const defaultMetaGranted: JsonLd.Meta.Granted = {
	visibility: 'restricted',
	access: 'granted',
};
const defaultMetaUnauthorized: JsonLd.Meta.Unauthorized = {
	visibility: 'restricted',
	access: 'unauthorized',
};
const defaultMetaPermissionDenied: JsonLd.Meta.PermissionDenied = {
	visibility: 'restricted',
	access: 'forbidden',
};
const defaultMetaNotFound: JsonLd.Meta.NotFound = {
	visibility: 'not_found',
	access: 'forbidden',
};

export const defaults: JsonLdDefaults = {
	meta: {
		public: defaultMetaPublic,
		granted: defaultMetaGranted,
		unauthorized: defaultMetaUnauthorized,
		permissionDenied: defaultMetaPermissionDenied,
		notFound: defaultMetaNotFound,
	},
};
