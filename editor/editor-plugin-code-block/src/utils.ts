export {
  findCodeBlock,
  transformSliceToJoinAdjacentCodeBlocks,
  transformSingleLineCodeBlockToCodeMark,
} from '@atlaskit/editor-common/transforms';
import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type {
  Selection,
  TextSelection,
} from '@atlaskit/editor-prosemirror/state';

export function getCursor(selection: Selection): ResolvedPos | undefined {
  return (selection as TextSelection).$cursor || undefined;
}
