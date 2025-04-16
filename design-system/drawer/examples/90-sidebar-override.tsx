/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Component, type FC, type ReactNode, type SyntheticEvent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import Drawer from '@atlaskit/drawer';
import { token } from '@atlaskit/tokens';

interface State {
	isDrawerOpen: boolean;
}

const SidebarOverrideComponent: FC<{ children?: ReactNode }> = ({ children }) => {
	return (
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				alignItems: 'center',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				boxSizing: 'border-box',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				color: token('color.text.subtle'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				display: 'flex',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				flexShrink: 0,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				flexDirection: 'column',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				height: '100vh',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				paddingBottom: token('space.200', '16px'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				paddingTop: token('space.300', '24px'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				width: 64,
				border: `3px dashed ${token('color.background.accent.teal.subtle')}`,
			}}
		>
			{children}
			Sidebar Override
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
					label="Drawer with custom sidebar override"
					// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides, @atlaskit/design-system/no-deprecated-apis
					overrides={{
						Sidebar: {
							component: SidebarOverrideComponent,
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
