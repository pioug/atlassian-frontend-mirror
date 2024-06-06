import React, { Component } from 'react';

import styled from '@emotion/styled';

import Banner from '@atlaskit/banner';
import { IconButton } from '@atlaskit/button/new';
import RoomMenuIcon from '@atlaskit/icon/glyph/room-menu';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Navigation from '@atlaskit/navigation';

import MobileHeader from '../src';

const BANNER_HEIGHT = 52;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const FakeSideBar = styled.div({
	backgroundColor: 'white',
	height: '100vh',
	paddingTop: '32px',
	textAlign: 'center',
	width: '264px',
});

interface State {
	drawerState: 'navigation' | 'sidebar' | 'none' | string;
}

export default class BannerMobileHeaderDemo extends Component<{}, State> {
	state = {
		drawerState: 'none',
	};

	navOpened = () => {
		this.setState({ drawerState: 'navigation' });
	};

	sidebarOpened = () => {
		this.setState({ drawerState: 'sidebar' });
	};

	drawerClosed = () => {
		this.setState({ drawerState: 'none' });
	};

	render() {
		return (
			<div>
				<Banner icon={<WarningIcon label="Warning icon" secondaryColor="inherit" />}>
					This is a warning banner
				</Banner>
				<MobileHeader
					drawerState={this.state.drawerState}
					menuIconLabel="Menu"
					navigation={(isOpen) => isOpen && <Navigation onResize={() => {}} />}
					secondaryContent={
						<IconButton icon={RoomMenuIcon} onClick={this.sidebarOpened} label="Show sidebar" />
					}
					sidebar={(isOpen) => isOpen && <FakeSideBar>Sidebar goes here...</FakeSideBar>}
					pageHeading="Page heading"
					onNavigationOpen={this.navOpened}
					onDrawerClose={this.drawerClosed}
					topOffset={BANNER_HEIGHT}
				/>
			</div>
		);
	}
}
