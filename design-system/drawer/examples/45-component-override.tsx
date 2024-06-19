/**
 * @jsxRuntime classic
 */
/** @jsx jsx */

import {
	Component,
	type FC,
	type MouseEventHandler,
	type ReactNode,
	type SyntheticEvent,
} from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';
import { token } from '@atlaskit/tokens';

import Drawer from '../src';

interface State {
	isDrawerOpen: boolean;
}

interface IconWrapperProps {
	onClick: MouseEventHandler;
	children: ReactNode;
}

const iconButtonStyles = css({
	display: 'flex',
	width: '40px',
	height: '40px',
	padding: token('space.0', '0px'),
	alignItems: 'center',
	justifyContent: 'center',
	background: 0,
	border: 0,
	borderRadius: token('border.radius.circle', '50%'),
	color: 'inherit',
	cursor: 'pointer',
	fontSize: 'inherit',
	lineHeight: 1,
	marginBlockEnd: token('space.200', '16px'),
	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered'),
	},
	'&:active': {
		backgroundColor: token('color.background.neutral.subtle.pressed'),
		outline: 0,
	},
});

const IconWrapper: FC<IconWrapperProps> = (props) => (
	<button type="button" css={iconButtonStyles} onClick={props.onClick}>
		{props.children}
	</button>
);

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
			}}
		>
			{children}
			<IconWrapper onClick={() => console.log('onNewButtonClicked')}>
				<AppSwitcherIcon label="extra-button" />
			</IconWrapper>
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
					label="Drawer with component overrides"
					// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
					overrides={{
						Sidebar: {
							component: SidebarOverrideComponent,
						},
					}}
				>
					<code>Drawer contents</code>
				</Drawer>
				<Button id="open-drawer" type="button" onClick={this.openDrawer}>
					Open drawer
				</Button>
			</div>
		);
	}
}
