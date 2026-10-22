import { FORGE_EXTENSION_TYPE } from '@atlaskit/editor-common/extensions/manifest-helpers';
import type { MenuItem } from '@atlaskit/editor-common/extensions/types/utils';

const FORGE_APP_ARI_PREFIX = 'ari:cloud:ecosystem::app/';

/** How to look up the Marketplace partner of the app that contributes an extension item. */
export type AppVendorLookup = {
	/** Stable cache key shared by every item from the same app. */
	id: string;
	kind: 'forge' | 'connect';
	/** Forge app ARI or Connect app key. */
	value: string;
};

/** Returns a lookup only for ecosystem apps; Atlassian-owned items have no Marketplace partner. */
export const getAppVendorLookup = ({
	app,
	extensionType,
}: Pick<MenuItem, 'app' | 'extensionType'>): AppVendorLookup | undefined => {
	if (app?.source !== 'ecosystem' || !app.key) {
		return undefined;
	}

	if (extensionType === FORGE_EXTENSION_TYPE) {
		// Marketplace returns null for a bare Forge app UUID, so always send the full ARI.
		const value = app.key.startsWith(FORGE_APP_ARI_PREFIX)
			? app.key
			: `${FORGE_APP_ARI_PREFIX}${app.key}`;
		return { id: `forge:${value}`, kind: 'forge', value };
	}

	return { id: `connect:${app.key}`, kind: 'connect', value: app.key };
};
