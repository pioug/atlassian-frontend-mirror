/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';

import WidthDetector from '@atlaskit/width-detector';

const containerMaxWidth = 800;

const styles = cssMap({
	container: {
		boxSizing: 'border-box',
		position: 'relative',
		width: '100%',
		height: 100,
		maxWidth: containerMaxWidth,
		margin: '10px 0',
		padding: 10,
		backgroundColor: '#333',
	},
	box: {
		backgroundColor: 'rebeccapurple',
		color: 'white',
		justifyContent: 'center',
		whiteSpace: 'nowrap',
	},
	text: {
		padding: 10,
	},
});

let n = 0;

export default function Example(): JSX.Element {
	return (
		<div css={styles.box}>
			<p css={styles.text}>Inside a parent with set height1</p>
			<p css={styles.text}>Inside a parent with set height2</p>
			<div css={styles.container}>
				<WidthDetector>
					{(width?: Number) => {
						n++;
						return (
							<>
								<p>This div has a max width of {containerMaxWidth}</p>
								<p>{width?.toString()}</p>
								<p>This component has been rendered {n} times.</p>
							</>
						);
					}}
				</WidthDetector>
			</div>
		</div>
	);
}
