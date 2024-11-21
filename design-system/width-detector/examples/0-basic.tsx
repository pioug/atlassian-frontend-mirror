import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import WidthDetector from '@atlaskit/width-detector';

const containerDivStyle: React.CSSProperties = {
	boxSizing: 'border-box',
	position: 'relative',
	width: '100%',
	height: 100,
	maxWidth: 800,
	margin: '10px 0',
	padding: 10,
	backgroundColor: '#333',
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ResultBox = styled.div({
	backgroundColor: 'rebeccapurple',
	color: 'white',
	justifyContent: 'center',
	whiteSpace: 'nowrap',
});

let n = 0;

export default function Example() {
	return (
		<ResultBox>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<p style={{ padding: 10 }}>Inside a parent with set height1</p>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<p style={{ padding: 10 }}>Inside a parent with set height2</p>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={containerDivStyle}>
				<WidthDetector>
					{(width?: Number) => {
						n++;
						return (
							<>
								<p>This div has a max width of {containerDivStyle.maxWidth}</p>
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
								<p className="my-component-child">{width}</p>
								<p>This component has been rendered {n} times.</p>
							</>
						);
					}}
				</WidthDetector>
			</div>
		</ResultBox>
	);
}
