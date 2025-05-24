import React from 'react';

import { hierarchy } from '@visx/hierarchy';
import { Zoom } from '@visx/zoom';

import { Box, xcss } from '@atlaskit/primitives';

import { CharlieHierarchy } from '../src';

import { rootNode } from './common/basic-hierachy';

const SCALE_MAX = 1.5;
const SCALE_MIN = 1 / 16;
const styles = xcss({
	width: '100%',
	height: '100%',
	backgroundColor: 'color.background.neutral.bold',
	color: 'color.text.inverse',
	textAlign: 'center',
});
export default function Basic() {
	const root = hierarchy(rootNode);

	return (
		<Zoom<SVGSVGElement>
			width={1000}
			height={1000}
			scaleXMin={SCALE_MIN}
			scaleXMax={SCALE_MAX}
			scaleYMin={SCALE_MIN}
			scaleYMax={SCALE_MAX}
			initialTransformMatrix={{
				scaleX: 1,
				scaleY: 1,
				skewX: 0,
				skewY: 0,
				translateX: document.body.clientWidth / 2,
				translateY: 120,
			}}
		>
			{(zoom) => (
				<CharlieHierarchy root={root} nodeSize={[100, 50]} size={[1000, 1000]} zoom={zoom}>
					{(node) => {
						return <Box xcss={styles}>{node.data.name}</Box>;
					}}
				</CharlieHierarchy>
			)}
		</Zoom>
	);
}
