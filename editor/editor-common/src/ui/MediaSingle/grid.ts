import type { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { akEditorBreakoutPadding, breakoutWideScaleRatio } from '@atlaskit/editor-shared-styles';

import type { EditorContainerWidth } from '../../types';

import { calcColumnsFromPx } from './calcColumnsFromPx';
import { calcPxFromColumns } from './calcPxFromColumns';
import { calcPxFromPct } from './calcPxFromPct';
import { wrappedLayouts } from './wrappedLayouts';
const validWidthModes: MediaSingleLayout[] = [
	'center',
	'wrap-left',
	'wrap-right',
	'align-start',
	'align-end',
];

export const layoutSupportsWidth = (layout: MediaSingleLayout): boolean =>
	validWidthModes.indexOf(layout) > -1;

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const calcPctWidth = (
	containerWidth: EditorContainerWidth,
	pctWidth?: number,
	origWidth?: number,
	origHeight?: number,
): number | undefined =>
	pctWidth &&
	origWidth &&
	origHeight &&
	Math.ceil(calcPxFromPct(pctWidth / 100, containerWidth.lineLength || containerWidth.width));

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const calcMediaPxWidth = (opts: {
	containerWidth: EditorContainerWidth;
	isFullWidthModeEnabled?: boolean;
	layout?: MediaSingleLayout;
	origHeight: number;
	origWidth: number;
	pctWidth?: number;
	pos?: number;
	resizedPctWidth?: number;
	state?: EditorState;
}): number => {
	const { origWidth, origHeight, layout, pctWidth, containerWidth, resizedPctWidth } = opts;
	const { width, lineLength } = containerWidth;
	const calculatedPctWidth = calcPctWidth(containerWidth, pctWidth, origWidth, origHeight);
	const calculatedResizedPctWidth = calcPctWidth(
		containerWidth,
		resizedPctWidth,
		origWidth,
		origHeight,
	);

	if (layout === 'wide') {
		if (lineLength) {
			const wideWidth = Math.ceil(lineLength * breakoutWideScaleRatio);
			return wideWidth > width ? lineLength : wideWidth;
		}
	} else if (layout === 'full-width') {
		return width - akEditorBreakoutPadding;
	} else if (calculatedPctWidth) {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		if (wrappedLayouts.indexOf(layout!) > -1) {
			if (calculatedResizedPctWidth) {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				if (resizedPctWidth! < 50) {
					return calculatedResizedPctWidth;
				}
				return calculatedPctWidth;
			}
			return calculatedPctWidth;
		}
		if (calculatedResizedPctWidth) {
			return calculatedResizedPctWidth;
		}
		return calculatedPctWidth;
	} else if (layout === 'center') {
		if (calculatedResizedPctWidth) {
			return calculatedResizedPctWidth;
		}
		return Math.min(origWidth, lineLength || width);
	} else if (layout && wrappedLayouts.indexOf(layout) !== -1) {
		// when layout is wrap-left, wrap-right, align-start, align-end
		// but no pctWidth is defined
		return Math.min(calcPxFromPct(0.5, lineLength || width), origWidth);
	}

	return origWidth;
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const snapToGrid = (
	gridWidth: number,
	width: number,
	height: number,
	lineLength: number,
	gridSize: number,
): {
	height: number;
	width: number;
} => {
	const pxWidth = calcPxFromPct(gridWidth / 100, lineLength);

	const columnSpan = Math.round(calcColumnsFromPx(pxWidth, lineLength, gridSize));

	const alignedWidth = calcPxFromColumns(columnSpan, lineLength, gridSize);

	return {
		height: (height / width) * alignedWidth,
		width: alignedWidth,
	};
};
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { calcPxFromColumns } from './calcPxFromColumns';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { calcColumnsFromPx } from './calcColumnsFromPx';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { calcPxFromPct } from './calcPxFromPct';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { calcPctFromPx } from './calcPctFromPx';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { wrappedLayouts } from './wrappedLayouts';
