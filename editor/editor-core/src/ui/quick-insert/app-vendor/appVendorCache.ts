export type AppVendorEntry =
	| { status: 'pending' }
	| { name: string | null; status: 'resolved' }
	| { attempts: number; status: 'failed' };

/**
 * Vendor names keyed by lookup id, plus the subscribers to notify when they change.
 * Module scope so names survive editor and provider rebuilds for the rest of the page load.
 */
export const appVendorCache: {
	entries: Map<string, AppVendorEntry>;
	listeners: Set<() => void>;
} = {
	entries: new Map(),
	listeners: new Set(),
};
