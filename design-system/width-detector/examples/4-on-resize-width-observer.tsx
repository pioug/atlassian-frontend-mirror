/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag
 */
import React, { useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';
import { WidthObserver } from '@atlaskit/width-detector';

import { debounce } from './utils/debounce';

const styles = cssMap({
	resultContainer: {
		minWidth: 180,
		margin: '0 auto',
	},
	resultBox: {
		alignItems: 'center',
		backgroundColor: 'black',
		color: 'white',
		display: 'flex',
		height: 'auto',
		minHeight: '100px',
		justifyContent: 'center',
		whiteSpace: 'nowrap',
		transition: 'background-color 2s',
		padding: '10px',
	},
	resultNumber: {
		backgroundColor: 'rgb(0, 0, 0, 0.6)',
		color: 'white',
		padding: '10px',
		borderRadius: token('border.radius.100'),
	},
	relativeWrapper: {
		position: 'relative',
	},
	textContainer: {
		textAlign: 'center',
	},
	text: {
		padding: '25px',
	},
});

const sizes = ['100%', '75%', '50%', '25%'];

const OnResizeExample = () => {
	const [containerWidth, setContainerWidth] = useState(0);
	const [bgColor, setBgColor] = useState('#fff');

	const [size, setSize] = useState(0);
	const sizeIndex = size % sizes.length;

	const onResize = debounce(
		(width: any) => {
			console.log('[onResize] width:', width);
			setBgColor(`#${(width + 255).toString(16)}`);
			setContainerWidth(width);
		},
		100,
		false,
	);

	return (
		<>
			<div style={{ width: sizes[sizeIndex] }} css={styles.resultContainer}>
				<div css={styles.resultBox} style={{ backgroundColor: bgColor }}>
					<div css={styles.resultNumber}>{containerWidth}</div>
				</div>
				<div css={styles.relativeWrapper}>
					<WidthObserver setWidth={onResize} />
				</div>
			</div>
			<div css={styles.textContainer}>
				<p css={styles.text}>
					The area above will change color as the width of the container changes.
				</p>
				<Button onClick={() => setSize((prev) => prev + 1)} appearance="primary">
					Set width to {sizes[(sizeIndex + 1) % sizes.length]}
				</Button>
			</div>
		</>
	);
};

export default OnResizeExample;
