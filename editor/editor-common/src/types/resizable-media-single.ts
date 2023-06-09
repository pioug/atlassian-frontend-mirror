import { ResolvedPos } from 'prosemirror-model';

export interface SnapPointsProps {
  $pos?: ResolvedPos | null;
  akEditorWideLayoutWidth: number;
  allowBreakoutSnapPoints?: boolean;
  containerWidth: number;
  gridSize: number;
  gridWidth: number;
  insideInlineLike: boolean;
  insideLayout: boolean;
  isVideoFile: boolean;
  lineLength: number;
  offsetLeft: number;
  wrappedLayout: boolean;
}
