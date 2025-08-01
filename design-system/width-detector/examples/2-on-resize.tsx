/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';
import WidthDetector from '@atlaskit/width-detector';

import { debounce } from './utils/debounce';

const styles = cssMap({
	container: {
		height: '100px',
	},
	resultBox: {
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
	},
	resultNumber: {
		backgroundColor: 'rgb(0, 0, 0, 0.6)',
		color: 'white',
		padding: '10px',
		borderRadius: token('border.radius.100'),
	},
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
				<div css={styles.container}>
					<WidthDetector onResize={this.onResize}>
						{() => (
							<div css={styles.resultBox} style={{ backgroundColor: this.state.bgColor }}>
								<div css={styles.resultNumber}>{this.state.width}</div>
							</div>
						)}
					</WidthDetector>
					The area above will change color as the width of the container changes.
				</div>
			</div>
		);
	}
}
