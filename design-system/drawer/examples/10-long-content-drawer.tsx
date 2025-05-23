import React, { Component } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import Drawer from '@atlaskit/drawer';

interface State {
	isDrawerOpen: boolean;
}
export default class DrawersExample extends Component<{}, State> {
	state = {
		isDrawerOpen: false,
	};

	openDrawer = () =>
		this.setState({
			isDrawerOpen: true,
		});

	closeDrawer = () =>
		this.setState({
			isDrawerOpen: false,
		});

	render() {
		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ padding: '2rem' }}>
				<Drawer
					onClose={this.closeDrawer}
					isOpen={this.state.isDrawerOpen}
					width="wide"
					titleId="drawerTitle"
					scrollContentLabel="Long Content"
				>
					<h2 id="drawerTitle">Long content drawer</h2>
					<Lorem count={100} />
				</Drawer>
				<Button type="button" onClick={this.openDrawer}>
					Open drawer
				</Button>
			</div>
		);
	}
}
