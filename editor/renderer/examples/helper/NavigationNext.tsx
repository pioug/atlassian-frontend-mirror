import React from 'react';

import BacklogIcon from '@atlaskit/icon/core/backlog';
import BoardIcon from '@atlaskit/icon/core/board';
import ChartTrendUpIcon from '@atlaskit/icon/core/chart-trend-up';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { Root } from '@atlaskit/navigation-system/layout/root';
import {
	SideNav,
	SideNavBody,
	SideNavHeader,
	SideNavPanelSplitter,
	SideNavToggleButton,
} from '@atlaskit/navigation-system/layout/side-nav';
import { TopNav, TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';
import { ButtonMenuItem } from '@atlaskit/side-nav-items/button-menu-item';
import { MenuList } from '@atlaskit/side-nav-items/menu-list';
import { MenuListItem } from '@atlaskit/side-nav-items/menu-list-item';

const LOCALSTORAGE_renderer_sidebar_key = 'fabric.editor.examples.renderer.sidebar';

export const getDefaultShowSidebarState = (defaultValue = false): any => {
	if (localStorage) {
		const defaultState = localStorage.getItem(LOCALSTORAGE_renderer_sidebar_key);
		if (defaultState) {
			return JSON.parse(defaultState).showSidebar;
		}
	}

	return defaultValue;
};

type SidebarProps = { children: any; showSidebar: boolean };

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class Sidebar extends React.Component<SidebarProps, { showSidebar: boolean }> {
	componentDidUpdate(prevProps: SidebarProps): void {
		if (prevProps.showSidebar !== this.props.showSidebar) {
			localStorage.setItem(
				LOCALSTORAGE_renderer_sidebar_key,
				JSON.stringify({ showSidebar: this.props.showSidebar }),
			);
		}
	}

	render(): any {
		if (typeof this.props.children !== 'function') {
			return this.props.children;
		}

		if (!this.props.showSidebar) {
			return this.props.children({});
		}

		const additionalRendererProps = {
			appearance: 'full-page',
		};

		return (
			<Root isSideNavShortcutEnabled>
				<TopNav>
					<TopNavStart
						sideNavToggleButton={
							<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
						}
					>
						<span>Fabric Editor</span>
					</TopNavStart>
				</TopNav>
				<SideNav>
					<SideNavHeader>Renderer</SideNavHeader>
					<SideNavBody>
						<MenuList>
							<MenuListItem>
								<ButtonMenuItem
									isSelected
									elemBefore={<BacklogIcon label="" color="currentColor" spacing="spacious" />}
								>
									Backlog
								</ButtonMenuItem>
							</MenuListItem>
							<MenuListItem>
								<ButtonMenuItem
									elemBefore={<BoardIcon label="" color="currentColor" spacing="spacious" />}
								>
									Active sprints
								</ButtonMenuItem>
							</MenuListItem>
							<MenuListItem>
								<ButtonMenuItem
									elemBefore={<ChartTrendUpIcon label="" color="currentColor" spacing="spacious" />}
								>
									Reports
								</ButtonMenuItem>
							</MenuListItem>
						</MenuList>
					</SideNavBody>
					<SideNavPanelSplitter label="Resize sidebar" />
				</SideNav>
				<Main>{this.props.children(additionalRendererProps)}</Main>
			</Root>
		);
	}
}
