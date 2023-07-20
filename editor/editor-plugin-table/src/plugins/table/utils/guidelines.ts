import { createFixedGuidelinesFromLengths } from '@atlaskit/editor-common/guideline';
import type { GuidelineConfig } from '@atlaskit/editor-plugin-guideline';
import {
  akEditorDefaultLayoutWidth,
  akEditorFullWidthLayoutWidth,
  akEditorWideLayoutWidth,
} from '@atlaskit/editor-shared-styles';

export const defaultGuidelineWidths = [
  akEditorDefaultLayoutWidth,
  akEditorWideLayoutWidth,
  akEditorFullWidthLayoutWidth,
];

export const defaultGuidelines = createFixedGuidelinesFromLengths(
  defaultGuidelineWidths,
) as GuidelineConfig[];
