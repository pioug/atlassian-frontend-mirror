import { createFixedGuidelinesFromLengths } from '@atlaskit/editor-common/guideline';
import type { GuidelineConfig } from '@atlaskit/editor-common/guideline';

import {
  calculateDefaultSnappings,
  calculateDefaultTablePreserveSnappings,
} from './snapping';

// NOTE: We have to take 1 pixel off every length due to the fact that the tbody is 1px smaller then the table container.
// If we don't do this then the guidelines will not align correctly to the edge of the table
export const defaultGuidelines = createFixedGuidelinesFromLengths([
  0,
  ...calculateDefaultSnappings(-1),
]) as GuidelineConfig[];

export const defaultGuidelinesForPreserveTable = (
  editorContainerWidth: number,
) =>
  createFixedGuidelinesFromLengths([
    0,
    ...calculateDefaultTablePreserveSnappings(-1, editorContainerWidth),
  ]) as GuidelineConfig[];
