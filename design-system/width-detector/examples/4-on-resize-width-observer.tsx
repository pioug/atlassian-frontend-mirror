import React, { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import Button from '@atlaskit/button/new';
import { WidthObserver } from '@atlaskit/width-detector';

import { debounce } from './utils/debounce';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ResultBox = styled.div({
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
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ResultNumber = styled.div({
	backgroundColor: 'rgb(0, 0, 0, 0.6)',
	color: 'white',
	padding: '10px',
	borderRadius: '3px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const RelativeWrapper = styled.div({
	position: 'relative',
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
			<div
				style={{
					width: sizes[sizeIndex],
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					minWidth: 180,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					margin: '0 auto',
				}}
			>
				<ResultBox style={{ backgroundColor: bgColor }}>
					<ResultNumber>{containerWidth}</ResultNumber>
				</ResultBox>
				<RelativeWrapper>
					<WidthObserver setWidth={onResize} />
				</RelativeWrapper>
			</div>

			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ textAlign: 'center' }}>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<p style={{ padding: '25px' }}>
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
