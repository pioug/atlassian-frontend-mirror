import React, { Component } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import Banner from '@atlaskit/banner';
import { IconButton } from '@atlaskit/button/new';
import MenuIcon from '@atlaskit/icon/core/menu';
import WarningIcon from '@atlaskit/icon/core/migration/status-warning--warning';
import LegacyRoomMenuIcon from '@atlaskit/icon/glyph/room-menu';
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
				<Banner
					icon={
						<WarningIcon
							color="currentColor"
							spacing="spacious"
							label="Warning icon"
							LEGACY_secondaryColor="inherit"
						/>
					}
				>
					This is a warning banner
				</Banner>
				<MobileHeader
					drawerState={this.state.drawerState}
					menuIconLabel="Menu"
					navigation={(isOpen) => isOpen && <Navigation onResize={() => {}} />}
					secondaryContent={
						<IconButton
							icon={() => (
								<MenuIcon
									LEGACY_fallbackIcon={LegacyRoomMenuIcon}
									label={''}
									color="currentColor"
								/>
							)}
							onClick={this.sidebarOpened}
							label="Show sidebar"
						/>
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
