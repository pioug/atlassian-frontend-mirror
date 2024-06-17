import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { keyframes } from '@emotion/react';
import WidthDetector from '../src';

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

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ResizingBox = styled.div({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	background: 'rgba(0, 0, 0, 0.2)',
	color: '#333',
	animation: `${growAndShrink} 3s ease-in-out infinite`,
	width: `${startSize}px`,
	height: `${startSize}px`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ResultBox = styled.div({
	alignItems: 'center',
	backgroundColor: 'rebeccapurple',
	color: 'white',
	display: 'flex',
	height: '100%',
	justifyContent: 'center',
	whiteSpace: 'nowrap',
});

const displayResults = (width?: Number) => <ResultBox>Width: {width}</ResultBox>;

export default function Example() {
	return (
		<div>
			<p>
				The box on the left is the only thing causing resize. The purple box should update in
				response.
			</p>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ display: 'flex' }}>
				<ResizingBox>I am resizing</ResizingBox>
				<WidthDetector>{displayResults}</WidthDetector>
			</div>
		</div>
	);
}
