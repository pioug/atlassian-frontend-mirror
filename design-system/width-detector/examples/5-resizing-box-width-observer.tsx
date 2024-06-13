import React, { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { WidthObserver } from '../src';

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

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ResizingBox = styled.div({
	textAlign: 'center',
	background: 'rgba(0, 0, 0, 0.2)',
	color: '#333',
	animation: `${growAndShrink} 5s ease-in-out infinite`,
	width: `${startSize}px`,
	height: '250px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const RelativeWrapper = styled.div({
	position: 'relative',
});

export default function Example() {
	const [width, setWidth] = useState(0);

	return (
		<div>
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					margin: '50px',
				}}
			>
				<ResizingBox>
					<p>
						I am resizing
						<br />
						<b> width: {width} </b>
					</p>
					<RelativeWrapper>
						<WidthObserver setWidth={setWidth} />
					</RelativeWrapper>
				</ResizingBox>
			</div>
		</div>
	);
}
