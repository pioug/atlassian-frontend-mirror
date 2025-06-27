/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { cssMap, jsx, keyframes } from '@compiled/react';

import { WidthObserver } from '@atlaskit/width-detector';

const startSize = 150;
const endSize = startSize * 3;

const growAndShrink = keyframes({
	'0%': {
		width: `${startSize}px`,
		background: 'skyblue',
	},
	'50%': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: `${endSize}px`,
		background: '#00ff0d2b',
	},
	'100%': {
		width: `${startSize}px`,
		background: 'skyblue',
	},
});

const styles = cssMap({
	resizingBox: {
		textAlign: 'center',
		background: 'rgba(0, 0, 0, 0.2)',
		color: '#333',
		animationName: growAndShrink,
		animationDuration: '5s',
		animationTimingFunction: 'ease-in-out',
		animationIterationCount: 'infinite',
		width: `${startSize}px`,
		height: '250px',
	},
	relativeWrapper: {
		position: 'relative',
	},
	container: {
		margin: '50px',
	},
});

export default function Example() {
	const [width, setWidth] = useState(0);

	return (
		<div>
			<div css={styles.container}>
				<div css={styles.resizingBox}>
					<p>
						I am resizing
						<br />
						<b> width: {width} </b>
					</p>
					<div css={styles.relativeWrapper}>
						<WidthObserver setWidth={setWidth} />
					</div>
				</div>
			</div>
		</div>
	);
}
