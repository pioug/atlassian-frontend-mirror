/* eslint-disable @repo/internal/codegen/signed-source-integrity */
// We're only importing AtlassianLight as Light, Dark, and legacy color themes all share the same schema
import { InternalTokenIds as AtlassianLightInternalTokenIds } from './typescript/atlassian-light-types-internal';

// While there are no "Active" state tokens, this isn't a module.
// When a token state moves from 'experimental' to 'active', uncomment
// import { InternalTokenIds as AtlassianSpacingInternalTokenIds } from './typescript/atlassian-spacing-types-internal';

export type InternalTokenIds =
  | AtlassianLightInternalTokenIds
  // | AtlassianSpacingInternalTokenIds;
