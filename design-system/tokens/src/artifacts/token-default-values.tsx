/* eslint-disable @repo/internal/codegen/signed-source-integrity */
// We're only importing AtlassianLight as light is the default theme
import { default as atlassianLightDefaultTokenValues } from './typescript/atlassian-light-token-default-values';
import { default as atlassianSpacingDefaultTokenValues } from './typescript/atlassian-spacing-token-default-values';

const defaultTokens = {
  ...atlassianLightDefaultTokenValues,
  ...atlassianSpacingDefaultTokenValues,
};

export default defaultTokens;
