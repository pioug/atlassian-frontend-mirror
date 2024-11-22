/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Component, type SyntheticEvent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import Drawer from '@atlaskit/drawer';
import Modal from '@atlaskit/modal-dialog';
import { layers } from '@atlaskit/theme/constants';

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

	onClose = (...args: [SyntheticEvent<HTMLElement>, any]) => {
		console.log('onClose', args);
		this.setState({
			isDrawerOpen: false,
		});
	};

	onCloseComplete = (args: any) => console.log('onCloseComplete', args);

	onOpenComplete = (args: any) => console.log('onOpenComplete', args);

	render() {
		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ padding: '2rem' }}>
				<Modal>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<div style={{ padding: '2rem' }}>This is a modal</div>
					<Drawer
						onClose={this.onClose}
						onCloseComplete={this.onCloseComplete}
						onOpenComplete={this.onOpenComplete}
						isOpen={this.state.isDrawerOpen}
						width="wide"
						zIndex={layers.modal()}
						label="Drawer layer precedence"
					>
						<code>Content</code>
					</Drawer>

					<Button id="open-drawer" type="button" onClick={this.openDrawer}>
						Open drawer
					</Button>
				</Modal>
			</div>
		);
	}
}
