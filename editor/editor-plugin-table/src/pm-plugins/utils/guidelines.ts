import { createFixedGuidelinesFromLengths } from '@atlaskit/editor-common/guideline';
import type { GuidelineConfig } from '@atlaskit/editor-common/guideline';

import type { GuidelineExcludeConfig } from './snapping';
import { calculateDefaultSnappings, calculateDefaultTablePreserveSnappings } from './snapping';

// NOTE: We have to take 1 pixel off every length due to the fact that the tbody is 1px smaller then the table container.
// If we don't do this then the guidelines will not align correctly to the edge of the table
export const defaultGuidelines = createFixedGuidelinesFromLengths([
	0,
	...calculateDefaultSnappings(-1),
]) as GuidelineConfig[];

export const PRESERVE_TABLE_GUIDELINES_LENGTH_OFFSET = -1;
export const defaultGuidelinesForPreserveTable = (
	lengthOffset: number,
	editorContainerWidth: number,
	exclude: GuidelineExcludeConfig = {
		innerGuidelines: false,
		breakoutPoints: false,
	},
) => {
	const lengths = calculateDefaultTablePreserveSnappings(
		lengthOffset, // was hardcoded to -1 here, created PRESERVE_TABLE_GUIDELINES_LENGTH_OFFSET instead.
		editorContainerWidth,
		exclude,
	);

	return createFixedGuidelinesFromLengths(lengths, undefined, true) as GuidelineConfig[];
};
