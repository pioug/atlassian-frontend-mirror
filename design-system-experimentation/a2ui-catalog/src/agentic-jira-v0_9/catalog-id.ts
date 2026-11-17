/**
 * `@atlaskit/a2ui-catalog/agentic-jira-v0_9/catalog-id` — wire identifier for
 * the Agentic Jira v0.9 catalog.
 *
 * Used by `createSurface({ catalogId })` to select this catalog. The catalog
 * is a superset of the ADS base catalog (`com.atlassian.ads/v0_9`): every ADS
 * base component plus the high-level agentic-workflow composites
 * (`MultipleChoiceQuestions`, `RepositoryPicker`, `ToolApproval`).
 *
 * ID structure: `<catalog name>/<A2UI protocol version>/<catalog major version>`.
 * The `/v0_9` segment ties it to A2UI protocol v0.9 (matching the ADS catalog
 * convention); the trailing `/v1` is this catalog's own major version.
 *
 * Versioning policy (per the A2UI spec's catalog versioning guidelines): on a
 * breaking change — adding/removing a container component, changing a
 * property's type, adding a required property without a default — mint a new
 * ID (`…/v2`) rather than mutating this catalog, and register both versions
 * side by side so catalog negotiation migrates surfaces with zero downtime.
 * Additive leaf components and optional properties are non-breaking and do
 * NOT require a bump.
 */

/** Wire identifier for this catalog (used by `createSurface.catalogId`). */
export const AGENTIC_JIRA_CATALOG_ID = 'com.atlassian.agentic-jira/v0_9/v1';
