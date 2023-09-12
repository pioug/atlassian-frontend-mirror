export {
  cleanUpAtTheStartOfDocument,
  insertBlockQuoteWithAnalytics,
  setBlockType,
  setBlockTypeWithAnalytics,
  setHeadingWithAnalytics,
  setNormalText,
  setNormalTextWithAnalytics,
} from './block-type';
export type { InputMethod } from './block-type';
export { deleteAndMoveCursor } from './delete-and-move-cursor';
export { deleteBlockContent } from './delete-block-content';
/**
 * @private
 * @deprecated use import from @atlaskit/editor-common/commands
 */
export { setHeading } from '@atlaskit/editor-common/commands';
