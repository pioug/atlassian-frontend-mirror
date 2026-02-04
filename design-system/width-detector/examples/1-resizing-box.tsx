/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx, keyframes } from '@compiled/react';

import WidthDetector from '@atlaskit/width-detector';

const startSize = 100;
const endSize = startSize * 2;

const growAndShrink = keyframes({
	'0%': {
		width: `${startSize}px`,
		height: `${startSize}px`,
	},
	'50%': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: `${endSize}px`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: `${endSize}px`,
	},
	'100%': {
		width: `${startSize}px`,
		height: `${startSize}px`,
	},
});

const styles = cssMap({
	resizingBox: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		background: 'rgba(0, 0, 0, 0.2)',
		color: '#333',
		animationName: growAndShrink,
		animationDuration: '3s',
		animationTimingFunction: 'ease-in-out',
		animationIterationCount: 'infinite',
		width: `${startSize}px`,
		height: `${startSize}px`,
	},
	resultBox: {
		alignItems: 'center',
		backgroundColor: 'rebeccapurple',
		color: 'white',
		display: 'flex',
		height: '100%',
		justifyContent: 'center',
		whiteSpace: 'nowrap',
	},
	container: {
		display: 'flex',
	},
});

const displayResults = (width?: number) => <div css={styles.resultBox}>Width: {width}</div>;

export default function Example(): JSX.Element {
	return (
		<div>
			<p>
				The box on the left is the only thing causing resize. The purple box should update in
				response.
			</p>
			<div css={styles.container}>
				<div css={styles.resizingBox}>I am resizing</div>
				<WidthDetector>{displayResults}</WidthDetector>
			</div>
		</div>
	);
}
