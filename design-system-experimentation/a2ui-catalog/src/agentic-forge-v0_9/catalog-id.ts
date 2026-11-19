/**
 * `@atlaskit/a2ui-catalog/agentic-forge-v0_9/catalog-id` — wire identifier
 * for the Agentic Forge v0.9 catalog.
 *
 * Used by `createSurface({ catalogId })` to select this catalog. The catalog
 * is a dedicated Forge UI surface (not a superset of the ADS base catalog).
 * Hosts that want ADS components alongside Forge UI components compose catalogs themselves.
 *
 * ID structure: `<catalog name>/<A2UI protocol version>/<catalog major version>`.
 * The `/v0_9` segment ties it to A2UI protocol v0.9; the trailing `/v1` is this
 * catalog's own major version.
 *
 * Versioning policy: on a breaking change — changing a property's type or
 * adding a required property without a default — mint a new ID (`…/v2`) rather
 * than mutating this catalog, and register both versions side by side.
 * Additive optional properties are non-breaking and do NOT require a bump.
 */

/** Wire identifier for this catalog (used by `createSurface.catalogId`). */
export const AGENTIC_FORGE_CATALOG_ID = 'com.atlassian.agentic-forge/v0_9/v1';
