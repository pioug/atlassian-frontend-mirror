/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag
 */
import { useRef, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { WidthObserver } from '@atlaskit/width-detector/width-observer';

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

export default function Example(): JSX.Element {
	const [width, setWidth] = useState(0);
	const renderCount = useRef(0);
	renderCount.current += 1;

	return (
		<div css={styles.box}>
			<p css={styles.text}>Inside a parent with set height1</p>
			<p css={styles.text}>Inside a parent with set height2</p>
			<div css={styles.container}>
				<p>This div has a max width of {containerMaxWidth}</p>
				<p>{width.toString()}</p>
				<p>This component has been rendered {renderCount.current} times.</p>
				<WidthObserver setWidth={setWidth} />
			</div>
		</div>
	);
}
