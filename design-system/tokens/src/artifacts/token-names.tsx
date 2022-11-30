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
import {
  CSSTokenMap as AtlassianTypographyCSSTokenMap,
  default as atlassianTypographyTokenNames,
} from './typescript/atlassian-typography-token-names';

const tokens = {
  ...atlassianLightTokenNames,
  ...atlassianSpacingTokenNames,
  ...atlassianTypographyTokenNames,
} as const;

export type CSSTokenMap = AtlassianLightCSSTokenMap &
  AtlassianSpacingCSSTokenMap & AtlassianTypographyCSSTokenMap;

export type CSSToken = CSSTokenMap[keyof CSSTokenMap];

export default tokens;
