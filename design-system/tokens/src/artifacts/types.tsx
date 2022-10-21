/* eslint-disable @repo/internal/codegen/signed-source-integrity */
// We're only importing AtlassianLight as both Light and Dark share the same schema
import { ActiveTokens as AtlassianLightActiveTokens } from './typescript/atlassian-light-types';

// While there are no "Active" state tokens, this isn't a module.
// When a token state moves from 'experimental' to 'active', uncomment
// import { ActiveTokens as AtlassianSpacingActiveTokens } from './typescript/atlassian-spacing-types';

export type ActiveTokens =
  | AtlassianLightActiveTokens
  // | AtlassianSpacingActiveTokens;
