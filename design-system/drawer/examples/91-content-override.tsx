import React, { Component, type FC, type ReactNode, type SyntheticEvent } from 'react';

import Button from '@atlaskit/button/new';
import Drawer from '@atlaskit/drawer';
import { token } from '@atlaskit/tokens';

interface State {
	isDrawerOpen: boolean;
}

const ContentOverrideComponent: FC<{ children?: ReactNode }> = ({ children }) => {
	return (
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				flex: 1,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				overflow: 'auto',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				marginTop: token('space.300', '24px'),
				border: `3px dashed ${token('color.background.accent.purple.subtle')}`,
			}}
		>
			{children}
			Content Override
		</div>
	);
};

export default class DrawersExample extends Component<{}, State> {
	state = {
		isDrawerOpen: false,
	};

	openDrawer = () =>
		this.setState({
			isDrawerOpen: true,
		});

	onClose = (...args: [SyntheticEvent, any]) => {
		console.log('onClose', args);
		this.setState({
			isDrawerOpen: false,
		});
	};

	onCloseComplete = (args: any) => console.log('onCloseComplete', args);

	render() {
		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ padding: token('space.400', '2rem') }}>
				<Drawer
					onClose={this.onClose}
					onCloseComplete={this.onCloseComplete}
					isOpen={this.state.isDrawerOpen}
					width="narrow"
					label="Drawer with custom content override"
					// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides, @atlaskit/design-system/no-deprecated-apis
					overrides={{
						Content: {
							component: ContentOverrideComponent,
						},
					}}
				>
					Normal Drawer content
				</Drawer>
				<Button id="open-drawer" type="button" onClick={this.openDrawer}>
					Open drawer
				</Button>
			</div>
		);
	}
}
