import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import WidthDetector from '@atlaskit/width-detector';

import { debounce } from './utils/debounce';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ResultBox = styled.div({
	alignItems: 'center',
	backgroundColor: 'rebeccapurple',
	color: 'white',
	display: 'flex',
	height: '100%',
	minHeight: '100px',
	justifyContent: 'center',
	whiteSpace: 'nowrap',
	transition: 'background-color 1s',
	padding: '10px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ResultNumber = styled.div({
	backgroundColor: 'rgb(0, 0, 0, 0.6)',
	color: 'white',
	padding: '10px',
	borderRadius: '3px',
});

export default class Example extends React.Component {
	state = {
		width: 0,
		bgColor: '#fff',
	};

	onResize = debounce(
		(width: Number) => {
			console.log('[onResize] width:', width);

			this.setState({
				width,
				// create a new background color based on the width of the container
				bgColor: `#${(this.state.width + 255).toString(16)}`,
			});
		},
		100,
		true,
	);

	render() {
		return (
			<div>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ height: 100 }}>
					<WidthDetector onResize={this.onResize}>
						{() => (
							<ResultBox style={{ backgroundColor: this.state.bgColor }}>
								<ResultNumber>{this.state.width}</ResultNumber>
							</ResultBox>
						)}
					</WidthDetector>
					The area above will change color as the width of the container changes.
				</div>
			</div>
		);
	}
}
