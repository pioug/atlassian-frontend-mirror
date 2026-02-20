import React, { Component } from 'react';

import Button from '@atlaskit/button/new';
import InlineDialog from '@atlaskit/inline-dialog';
import { token } from '@atlaskit/tokens';

import { Placements } from '../utils';

interface State {
	placementIndex: number;
}

const styles: React.CSSProperties = {
	alignItems: 'center',
	justifyContent: 'center',
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
	width: '100%',
};

// eslint-disable-next-line @repo/internal/react/no-class-components
export default class InlineDialogPositioningExample extends Component<{}, State> {
	state = {
		placementIndex: 0,
	};

	cyclePlacement = (): void => {
		const { placementIndex } = this.state;
		if (placementIndex < Placements.length - 1) {
			this.setState({ placementIndex: placementIndex + 1 });
		} else {
			this.setState({ placementIndex: 0 });
		}
	};

	render(): React.JSX.Element {
		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={styles}>
				<div
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						marginTop: token('space.1000'),
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						marginBottom: token('space.1000'),
					}}
				>
					<InlineDialog
						content={
							<div>
								<p>
									Current placement: <strong>{Placements[this.state.placementIndex]}</strong>.
								</p>
							</div>
						}
						isOpen
						placement={Placements[this.state.placementIndex]}
					>
						<Button appearance="primary" onClick={this.cyclePlacement}>
							Cycle the placement
						</Button>
					</InlineDialog>
				</div>
			</div>
		);
	}
}
