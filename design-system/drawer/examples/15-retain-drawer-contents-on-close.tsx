/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Component } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';

import Drawer from '../src';

interface State {
	isDrawerOpen: boolean;
	shouldUnmountOnExit: boolean;
}
export default class DrawersExample extends Component<{}, State> {
	state = {
		isDrawerOpen: false,
		shouldUnmountOnExit: true,
	};

	openDrawer = () =>
		this.setState({
			isDrawerOpen: true,
		});

	closeDrawer = () =>
		this.setState({
			isDrawerOpen: false,
		});

	toggleUnmountBehaviour = () => {
		this.setState(({ shouldUnmountOnExit: shouldUnmountOnExitValue }) => ({
			shouldUnmountOnExit: !shouldUnmountOnExitValue,
		}));
	};

	render() {
		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ padding: '2rem' }}>
				<Drawer
					onClose={this.closeDrawer}
					isOpen={this.state.isDrawerOpen}
					width="wide"
					shouldUnmountOnExit={this.state.shouldUnmountOnExit}
					label="Drawer with retainable content"
				>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<label htmlFor="textbox" style={{ display: 'block' }}>
						Type something in the textarea below and see if it is retained
						<textarea id="textbox" rows={50} cols={50} />
					</label>
				</Drawer>
				<Button type="button" onClick={this.openDrawer}>
					Open drawer
				</Button>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ paddingTop: '2rem' }}>
					<label htmlFor="checkbox">
						<input
							id="checkbox"
							type="checkbox"
							checked={this.state.shouldUnmountOnExit}
							onChange={this.toggleUnmountBehaviour}
						/>
						Toggle remounting of drawer contents on exit
					</label>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<div style={{ display: 'block', paddingTop: '1rem' }}>
						Contents of the drawer will be{' '}
						<strong>{`${this.state.shouldUnmountOnExit ? 'discarded' : 'retained'}`}</strong> on
						closing the drawer
					</div>
				</div>
			</div>
		);
	}
}
