/* eslint-disable @repo/internal/codegen/signed-source-integrity */
// We're only importing AtlassianLight as both Light and Dark share the same schema
import { default as atlassianLightRenameMapper } from './rename-mapping/atlassian-light';
import { default as atlassianSpacingRenameMapper } from './rename-mapping/atlassian-spacing';

const renameMapper = [
  ...atlassianLightRenameMapper,
  ...atlassianSpacingRenameMapper,
];

export default renameMapper;
