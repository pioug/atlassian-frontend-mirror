import { useCallback, useMemo, useState } from 'react';

import {
	akEditorFullWidthLayoutWidth,
	akEditorGutterPadding,
	akEditorGutterPaddingDynamic,
	breakoutWideScaleRatio,
} from '@atlaskit/editor-shared-styles';

import { type GuidelineConfig } from '../guideline';
import type { BreakoutMode, EditorContainerWidth } from '../types';

import type { Snap } from './types';

export const SNAP_GAP = 8;

type SnappingWidths = {
	[key: string]: number;
};

type SnappingWidthsKeyMapping = {
	[key: string]: string;
};

const GUIDELINE_KEYS: SnappingWidthsKeyMapping = {
	lineLength: 'grid',
	wide: 'wide',
	fullWidth: 'full_width',
};

const CURRENT_LAYOUT_KEYS: SnappingWidthsKeyMapping = {
	lineLength: 'center',
	wide: 'wide',
	fullWidth: 'full-width',
};

const roundToNearest = (value: number, interval: number = 0.5): number =>
	Math.round(value / interval) * interval;

export function useBreakoutGuidelines(
	getEditorWidth: () => EditorContainerWidth | undefined,
	isResizing: boolean,
	dynamicFullWidthGuidelineOffset: number = 0,
) {
	const widthState = getEditorWidth();

	const { lineLength, wide, fullWidth } = useMemo(() => {
		if (!isResizing) {
			return {};
		}

		const { width, lineLength } = widthState || {};
		const wide = lineLength ? Math.round(lineLength * breakoutWideScaleRatio) : undefined;
		const layoutCalculatedWidth = width
			? width - (akEditorGutterPaddingDynamic() + dynamicFullWidthGuidelineOffset) * 2
			: undefined;
		const fullWidth =
			width && layoutCalculatedWidth
				? Math.min(layoutCalculatedWidth, akEditorFullWidthLayoutWidth)
				: undefined;
		return {
			wide,
			fullWidth,
			lineLength,
		};
	}, [widthState, isResizing, dynamicFullWidthGuidelineOffset]);

	// calculate snapping width
	const defaultSnappingWidths: SnappingWidths | null = useMemo(() => {
		if (!fullWidth || !wide || !lineLength || fullWidth <= lineLength) {
			return null;
		}
		if (fullWidth - wide > SNAP_GAP) {
			return { lineLength, wide, fullWidth } as SnappingWidths;
		}
		if (fullWidth <= wide && fullWidth - lineLength > SNAP_GAP) {
			return { lineLength, fullWidth } as SnappingWidths;
		}
		return null;
	}, [fullWidth, lineLength, wide]);

	const snaps: Snap | null = useMemo(() => {
		if (!isResizing || !defaultSnappingWidths) {
			return null;
		}

		return {
			x: Object.values(defaultSnappingWidths),
		} as Snap;
	}, [defaultSnappingWidths, isResizing]);

	// calculate guidelines, and calculate which lines are active
	const [currentLayout, setCurrentLayout] = useState<BreakoutMode | null>(null);
	const guidelines = useMemo(() => {
		const guidelines: GuidelineConfig[] = [];
		if (!defaultSnappingWidths) {
			return guidelines;
		}

		Object.entries(defaultSnappingWidths).map(([key, value]) => {
			if (value) {
				guidelines.push({
					key: `${GUIDELINE_KEYS[key]}_left`,
					position: { x: -roundToNearest(value / 2) },
					active: currentLayout === CURRENT_LAYOUT_KEYS[key],
				});
				guidelines.push({
					key: `${GUIDELINE_KEYS[key]}_right`,
					position: { x: roundToNearest(value / 2) },
					active: currentLayout === CURRENT_LAYOUT_KEYS[key],
				});
			}
		});
		return guidelines;
	}, [defaultSnappingWidths, currentLayout]);

	const setCurrentWidth = useCallback(
		(newWidth: number | null) => {
			if (typeof newWidth !== 'number') {
				setCurrentLayout(null);
				return;
			}

			if (lineLength && Math.abs(newWidth - lineLength) < SNAP_GAP / 2) {
				setCurrentLayout('center');
			} else if (wide && Math.abs(newWidth - wide) < SNAP_GAP / 2) {
				setCurrentLayout('wide');
			} else if (
				fullWidth &&
				// we only allow snap from one side, so we don't use Math.abs here
				(fullWidth + akEditorGutterPadding - newWidth < SNAP_GAP / 2 || newWidth >= fullWidth)
			) {
				setCurrentLayout('full-width');
			} else {
				setCurrentLayout(null);
			}
		},
		[lineLength, wide, fullWidth],
	);

	return { snaps, currentLayout, guidelines, setCurrentWidth };
}
