/**
 * @DSLCompatibilityException
 *
 * Pseudo groups are groups that don't exist in PM spec but are used to group nodes in ADF.
 *
 * PM spec transformer should flatten these groups.
 */
export const PSEUDO_GROUPS: Set<string> = new Set(['non_nestable_block_content']);
