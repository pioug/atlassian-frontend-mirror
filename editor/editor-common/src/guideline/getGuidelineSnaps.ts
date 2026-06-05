import memoizeOne from 'memoize-one';
import type { MemoizedFn } from 'memoize-one';

import type { RichMediaLayout } from '@atlaskit/adf-schema';

import type { GuidelineConfig, GuidelineSnap } from './types';
import { isVerticalPosition } from './utils';

export const getGuidelineSnaps: MemoizedFn<
	(
		guidelines: GuidelineConfig[],
		editorWidth: number,
		layout?: RichMediaLayout,
	) => {
		guidelineReference: {
			guidelineKey: string;
			width: number;
		}[];
		snaps: {
			x: number[] | undefined;
		};
	}
> = memoizeOne(
	(
		guidelines: GuidelineConfig[],
		editorWidth: number,
		layout: RichMediaLayout = 'center',
	): {
		guidelineReference: {
			guidelineKey: string;
			width: number;
		}[];
		snaps: {
			x: number[] | undefined;
		};
	} => {
		const offset = editorWidth / 2;
		const getPositionX = (position: GuidelineConfig['position']) => {
			return isVerticalPosition(position) ? position.x : 0;
		};

		const calcXSnaps = (guidelineReference: GuidelineSnap[]) => {
			const snapsWidth = guidelineReference.filter((g) => g.width > 0).map((g) => g.width);
			const uniqueSnapWidth = [...new Set(snapsWidth)];
			return snapsWidth.length ? uniqueSnapWidth : undefined;
		};

		const guidelinesSnapsReference = guidelines.map((guideline) => {
			const positionX = getPositionX(guideline.position);
			if (['align-end', 'wrap-right'].includes(layout)) {
				return {
					guidelineKey: guideline.key,
					width: offset - positionX,
				};
			} else if (['align-start', 'wrap-left'].includes(layout)) {
				return {
					guidelineKey: guideline.key,
					width: positionX + offset,
				};
			}
			return {
				guidelineKey: guideline.key,
				width: Math.abs(positionX) * 2,
			};
		});

		return {
			guidelineReference: guidelinesSnapsReference,
			snaps: {
				x: calcXSnaps(guidelinesSnapsReference),
			},
		};
	},
);
