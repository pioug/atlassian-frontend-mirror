import { fg } from '@atlaskit/platform-feature-flags/fg';

/**
 * A node type's base name, with a schema variant's suffix stripped: `panel`, `panel_c1` and
 * `panel_c1_root_only` all resolve to `panel`.
 *
 * Package-local rather than `getBaseNodeTypeName` from editor-common, which enumerates the variants
 * it happens to know (`panel_c1` alone) and is shared with features outside this one. Derived
 * instead of listed, so a variant added later needs no change here: the schema generator names a
 * variant `<type>_<variant>`, and every other node name in the ADF schema is camelCase, so the
 * first `_` is the boundary.
 *
 * Gated, so the diff behaves exactly as before for anyone outside the rollout.
 *
 * For taggability only — this gate is weaker than the ones attribution needs, so resolving a variant
 * in the styling decisions would move the legacy diff for readers who see no tags.
 */
export const resolveBaseNodeName = (name: string): string =>
	fg('confluence_ncs_step_diffing_version_history') ? name.split('_')[0] : name;
