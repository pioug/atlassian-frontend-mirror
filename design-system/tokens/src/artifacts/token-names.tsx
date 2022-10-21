/* eslint-disable @repo/internal/codegen/signed-source-integrity */
// We're only importing AtlassianLight as both Light and Dark share the same schema
import {
  CSSTokenMap as AtlassianLightCSSTokenMap,
  default as atlassianLightTokenNames,
} from './typescript/atlassian-light-token-names';
import {
  CSSTokenMap as AtlassianSpacingCSSTokenMap,
  default as atlassianSpacingTokenNames,
} from './typescript/atlassian-spacing-token-names';

const tokens = {
    ...atlassianLightTokenNames,
  ...atlassianSpacingTokenNames,
} as const;

export type CSSTokenMap = AtlassianLightCSSTokenMap &
  AtlassianSpacingCSSTokenMap;

export type CSSToken = CSSTokenMap[keyof CSSTokenMap];

export default tokens;
