/* eslint-disable @repo/internal/codegen/signed-source-integrity */
// We're only importing AtlassianLight as both Light and Dark share the same schema
import { default as atlassianLightRenameMapper } from './rename-mapping/atlassian-light';
import { default as atlassianSpacingRenameMapper } from './rename-mapping/atlassian-spacing';
import { default as atlassianTypographyRenameMapper } from './rename-mapping/atlassian-typography';

const renameMapper = [
  ...atlassianLightRenameMapper,
  ...atlassianSpacingRenameMapper,
  ...atlassianTypographyRenameMapper
];

export default renameMapper;
