import { Rectangle } from '@atlaskit/media-ui/rectangle';

import { insetFittedViewport } from '../../../../utils/fit-viewport';

const stage = (clientWidth: number, clientHeight: number) =>
	({ clientWidth, clientHeight }) as HTMLElement;

describe('insetFittedViewport', () => {
	it('should take the horizontal gutters off both sides of the width and keep the height', () => {
		expect(insetFittedViewport(stage(848, 600))).toEqual(new Rectangle(800, 600));
	});

	it('should not go below zero width when the stage is narrower than its gutters', () => {
		expect(insetFittedViewport(stage(40, 600))).toEqual(new Rectangle(0, 600));
	});
});
