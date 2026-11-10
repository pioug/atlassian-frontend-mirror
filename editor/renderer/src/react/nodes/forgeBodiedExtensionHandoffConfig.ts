import { expVal } from '@atlaskit/platform-feature-experiments/exp-val';

/** Exact extension keys whose reservation is released by the Forge bridge ready message.
 * Keep this static so SSR and the first client render use the same allowlist.
 */
export const FORGE_BODIED_EXTENSION_BRIDGE_READY_KEYS: ReadonlySet<string> = new Set([
	// Aura Table Filter (production).
	'7be6519f-6039-4662-a5a4-2e38f785dc0a/f9fff7f6-4e74-44eb-9de4-f0be57852570/static/table-filter',
]);

/** Select a release policy without re-evaluating eligibility for explicitly selected instances. */
export function getForgeBodiedExtensionHandoffMode({
	extensionType,
	extensionKey,
	localId,
	isInline,
	preserveUntilReadyInstances,
}: {
	extensionKey: string;
	extensionType: string;
	isInline: () => boolean;
	localId?: string;
	preserveUntilReadyInstances?: ReadonlyMap<string, string>;
}): 'preserve-until-ready' | 'release-on-bridge-ready' | undefined {
	if (!localId) {
		return undefined;
	}
	// Keep both Aura cohorts under their existing experiment, even if also selected by a host.
	if (FORGE_BODIED_EXTENSION_BRIDGE_READY_KEYS.has(extensionKey)) {
		if (extensionType !== 'com.atlassian.ecosystem' || isInline()) {
			return undefined;
		}
		return expVal('cc_aura_table_filter_cls', 'isEnabled', false)
			? 'release-on-bridge-ready'
			: undefined;
	}
	return preserveUntilReadyInstances?.get(localId) === extensionKey
		? 'preserve-until-ready'
		: undefined;
}
