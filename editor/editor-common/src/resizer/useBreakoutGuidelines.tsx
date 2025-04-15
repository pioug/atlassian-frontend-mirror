import { useCallback, useMemo, useState } from 'react';

import {
	akEditorGutterPadding,
	akEditorGutterPaddingDynamic,
	breakoutWideScaleRatio,
} from '@atlaskit/editor-shared-styles';

import type { GuidelineConfig } from '../guideline';
import type { BreakoutMode, EditorContainerWidth } from '../types';

import type { Snap } from './types';

export const SNAP_GAP = 8;

const roundToNearest = (value: number, interval: number = 0.5): number =>
	Math.round(value / interval) * interval;

export function useBreakoutGuidelines(
	getEditorWidth: () => EditorContainerWidth | undefined,
	isResizing: boolean,
) {
	const widthState = getEditorWidth();

	const { lineLength, wide, fullWidth } = useMemo(() => {
		if (!isResizing) {
			return {};
		}

		const { width, lineLength } = widthState || {};
		const wide = lineLength ? Math.round(lineLength * breakoutWideScaleRatio) : undefined;
		const fullWidth = width ? Math.min(width - akEditorGutterPaddingDynamic() * 2) : undefined;
		return {
			wide,
			fullWidth,
			lineLength,
		};
	}, [widthState, isResizing]);

	const snaps: Snap | null = useMemo(() => {
		if (!isResizing) {
			return null;
		}

		const xSnaps: number[] = [];
		if (typeof lineLength === 'number') {
			xSnaps.push(lineLength);
		}
		if (typeof wide === 'number') {
			xSnaps.push(wide);
		}
		if (typeof fullWidth === 'number') {
			xSnaps.push(fullWidth - akEditorGutterPadding);
		}

		return {
			x: xSnaps,
		} as Snap;
	}, [isResizing, wide, fullWidth, lineLength]);

	const [currentLayout, setCurrentLayout] = useState<BreakoutMode | null>(null);

	const guidelines = useMemo(() => {
		const guidelines: GuidelineConfig[] = [];

		if (!isResizing) {
			return guidelines;
		}

		if (lineLength) {
			guidelines.push({
				key: 'grid_left',
				position: { x: -roundToNearest(lineLength / 2) },
				active: currentLayout === 'center',
			});
			guidelines.push({
				key: 'grid_right',
				position: { x: roundToNearest(lineLength / 2) },
				active: currentLayout === 'center',
			});
		}

		if (wide) {
			guidelines.push({
				key: 'wide_left',
				position: { x: -roundToNearest(wide / 2) },
				active: currentLayout === 'wide',
			});
			guidelines.push({
				key: 'wide_right',
				position: { x: roundToNearest(wide / 2) },
				active: currentLayout === 'wide',
			});
		}
		if (fullWidth) {
			guidelines.push({
				key: 'full_width_left',
				position: { x: -roundToNearest(fullWidth / 2) },
				active: currentLayout === 'full-width',
			});
			guidelines.push({
				key: 'full_width_right',
				position: { x: roundToNearest(fullWidth) / 2 },
				active: currentLayout === 'full-width',
			});
		}
		return guidelines;
	}, [isResizing, lineLength, wide, fullWidth, currentLayout]);

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
				(Math.abs(newWidth - fullWidth + akEditorGutterPadding) < SNAP_GAP / 2 ||
					newWidth >= fullWidth)
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
