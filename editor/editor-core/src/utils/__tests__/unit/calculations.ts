import type { SnapPointsProps } from '@atlaskit/editor-common/types';
import { calculateSnapPoints } from '@atlaskit/editor-common/utils';
import { akEditorWideLayoutWidth } from '@atlaskit/editor-shared-styles';

describe('calculations', () => {
	describe('snapPoints', () => {
		it('should return snapPoints in ascending order', () => {
			const testResizableMediaSingleProps: SnapPointsProps = {
				$pos: {
					parent: {
						//@ts-ignore
						type: {
							name: 'doc',
						},
					},
				},
				akEditorWideLayoutWidth,
				allowBreakoutSnapPoints: true,
				containerWidth: 800,
				gridSize: 12,
				gridWidth: 12,
				insideInlineLike: false,
				insideLayout: true,
				isVideoFile: false,
				lineLength: 400,
				offsetLeft: 265,
				wrappedLayout: false,
			};
			const expectedSnapPointsResult = [
				46.66666666666667,
				82,
				117.33333333333334,
				135,
				152.66666666666669,
				188,
				223.33333333333334,
				258.6666666666667,
				294,
				329.33333333333337,
				364.6666666666667,
				akEditorWideLayoutWidth,
			];

			const snapPoints = calculateSnapPoints(testResizableMediaSingleProps);
			expect(snapPoints).toEqual(expectedSnapPointsResult);
		});
	});
});
