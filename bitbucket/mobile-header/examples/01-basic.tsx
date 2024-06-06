import React, { Component } from 'react';

import styled from '@emotion/styled';

import ButtonGroup from '@atlaskit/button/button-group';
import Button, { IconButton } from '@atlaskit/button/new';
import DetailViewIcon from '@atlaskit/icon/glyph/detail-view';
import Navigation from '@atlaskit/navigation';

import MobileHeader from '../src';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const FakeSideBar = styled.div({
	backgroundColor: 'white',
	height: '100vh',
	paddingTop: '32px',
	textAlign: 'center',
	width: '264px',
});

interface State {
	drawerState: 'none' | 'navigation' | 'sidebar' | string;
	isOpen: boolean;
}

class MobileHeaderDemo extends Component<{}, State> {
	state = {
		drawerState: 'none',
		isOpen: false,
	};

	navOpened = () => {
		this.setState({ drawerState: 'navigation', isOpen: true });
	};

	sidebarOpened = () => {
		this.setState({ drawerState: 'sidebar', isOpen: true });
	};

	drawerClosed = () => {
		this.setState({ drawerState: 'none', isOpen: false });
	};

	render() {
		const isHeaderOpen = this.state.isOpen;
		return (
			<div>
				{isHeaderOpen ? (
					<MobileHeader
						drawerState={this.state.drawerState}
						menuIconLabel="Menu"
						navigation={(isOpen) => isOpen && <Navigation onResize={() => {}} />}
						secondaryContent={
							<ButtonGroup>
								<Button>One</Button>
								<IconButton
									icon={DetailViewIcon}
									onClick={this.sidebarOpened}
									label="Show sidebar"
								/>
							</ButtonGroup>
						}
						sidebar={(isOpen) => isOpen && <FakeSideBar>Sidebar goes here...</FakeSideBar>}
						pageHeading="Page heading"
						onNavigationOpen={this.navOpened}
						onDrawerClose={this.drawerClosed}
					/>
				) : (
					<Button onClick={this.sidebarOpened}>Open Mobile Header</Button>
				)}
			</div>
		);
	}
}

export default function Example() {
	return <MobileHeaderDemo />;
}
