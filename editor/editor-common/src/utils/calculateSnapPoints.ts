import { akEditorBreakoutPadding } from '@atlaskit/editor-shared-styles';

import type { SnapPointsProps } from '../types';
import { calcPxFromColumns } from '../ui/MediaSingle/calcPxFromColumns';

export function calculateSnapPoints({
	$pos,
	akEditorWideLayoutWidth,
	allowBreakoutSnapPoints,
	containerWidth,
	gridSize,
	gridWidth,
	insideInlineLike,
	insideLayout,
	isVideoFile,
	lineLength,
	offsetLeft,
	wrappedLayout,
}: SnapPointsProps): number[] {
	const snapTargets: number[] = [];

	for (let i = 0; i < gridWidth; i++) {
		const pxFromColumns = calcPxFromColumns(i, lineLength, gridWidth);

		snapTargets.push(insideLayout ? pxFromColumns : pxFromColumns - offsetLeft);
	}
	// full width
	snapTargets.push(lineLength - offsetLeft);
	const columns = wrappedLayout || insideInlineLike ? 1 : 2;
	const minimumWidth = calcPxFromColumns(columns, lineLength, gridSize);

	let snapPoints = snapTargets.filter((width) => width >= minimumWidth);
	if (!$pos) {
		return snapPoints;
	}

	snapPoints = isVideoFile ? snapPoints.filter((width) => width > 320) : snapPoints;

	const isTopLevel = $pos.parent.type.name === 'doc';
	if (isTopLevel && allowBreakoutSnapPoints) {
		snapPoints.push(akEditorWideLayoutWidth);
		const fullWidthPoint = containerWidth - akEditorBreakoutPadding;
		if (fullWidthPoint > akEditorWideLayoutWidth) {
			snapPoints.push(fullWidthPoint);
		}
	}

	// EDM-1107: Ensure new snapPoints are sorted with existing points
	snapPoints = snapPoints.sort((a, b) => a - b);

	return snapPoints;
}
