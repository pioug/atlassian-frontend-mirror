/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Fragment, type JSX } from 'react';

import { jsx } from '@compiled/react';

import Badge from '@atlaskit/badge/badge';
import Button from '@atlaskit/button/default/button';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import AddIcon from '@atlaskit/icon/core/add';
import AiChatIcon from '@atlaskit/icon/core/ai-chat';
import QuestionCircleIcon from '@atlaskit/icon/core/question-circle';
import { JiraIcon } from '@atlaskit/logo/jira/icon';
import { SideNavToggleButton } from '@atlaskit/navigation-system/layout/side-nav';
import { TopNavEnd, TopNavMiddle, TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';
import {
	AppLogo,
	AppSwitcher,
	CustomLogo,
	EndItem,
	Notifications,
	Profile,
	Search,
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';
import { MenuListItem } from '@atlaskit/side-nav-items/menu-list-item';

import avatar1Url from '../assets/avatars/avatar-1.jpg';
import { ProfileThemeControls, type ThemeColorModes } from './profile-theme-controls';
import type { NavThemingMode, ThemeConfig } from './types';
import { generateImageComponent } from './utils/logo-utils';

interface TopNavContentProps {
	topNavTheme: ThemeConfig;
	shouldEnableNavCustomization: boolean;
	navThemingMode: NavThemingMode;
	appColorMode: ThemeColorModes;
	onAppColorModeChange: (mode: ThemeColorModes) => void;
	isPanelCollapsed?: boolean;
	onPanelToggle?: () => void;
}

export const TopNavContent = ({
	topNavTheme,
	appColorMode,
	onAppColorModeChange,
	isPanelCollapsed = false,
	onPanelToggle,
}: TopNavContentProps): JSX.Element => (
	<Fragment>
		<TopNavStart
			sideNavToggleButton={
				<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
			}
		>
			<AppSwitcher label="Switch apps" />
			{topNavTheme.logoUrl ? (
				<CustomLogo
					href=""
					logo={generateImageComponent(topNavTheme.logoUrl, topNavTheme.logoMonochrome)}
					icon={generateImageComponent(topNavTheme.logoUrl, topNavTheme.logoMonochrome)}
					label="Home page"
				/>
			) : (
				<AppLogo href="" icon={JiraIcon} name="Jira" label="Home page" />
			)}
		</TopNavStart>
		<TopNavMiddle>
			<Search label="Search" />
			<Button appearance="primary" iconBefore={AddIcon}>
				Create
			</Button>
		</TopNavMiddle>
		<TopNavEnd>
			<EndItem icon={AiChatIcon} label="AI chat" />
			<EndItem icon={QuestionCircleIcon} label="Help" />
			<Notifications
				badge={() => (
					<Badge max={9} appearance="important">
						5
					</Badge>
				)}
				label="Notifications"
			/>
			{onPanelToggle && (
				<Settings label="Settings" isSelected={!isPanelCollapsed} onClick={onPanelToggle} />
			)}
			<MenuListItem>
				<DropdownMenu
					shouldRenderToParent
					trigger={({ triggerRef: ref, ...props }) => (
						<Profile ref={ref} label="Profile" isListItem={false} src={avatar1Url} {...props} />
					)}
				>
					<DropdownItemGroup>
						<DropdownItem>Account</DropdownItem>
					</DropdownItemGroup>
					<ProfileThemeControls
						currentColorMode={appColorMode}
						onColorModeChange={onAppColorModeChange}
					/>
				</DropdownMenu>
			</MenuListItem>
		</TopNavEnd>
	</Fragment>
);
