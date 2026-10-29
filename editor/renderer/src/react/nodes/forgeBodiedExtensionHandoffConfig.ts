/** Exact extension keys whose native body is retained until Forge reports ready.
 * Keep this static so SSR and the first client render use the same allowlist.
 */
export const FORGE_BODIED_EXTENSION_HANDOFF_KEYS: ReadonlySet<string> = new Set([
	// Aura Table Filter (production).
	'7be6519f-6039-4662-a5a4-2e38f785dc0a/f9fff7f6-4e74-44eb-9de4-f0be57852570/static/table-filter',
]);
