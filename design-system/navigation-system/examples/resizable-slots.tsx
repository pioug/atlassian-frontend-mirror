/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useEffect, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Button, { IconButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import AppsIcon from '@atlaskit/icon/core/apps';
import BoardIcon from '@atlaskit/icon/core/board';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ClockIcon from '@atlaskit/icon/core/clock';
import InboxIcon from '@atlaskit/icon/core/inbox';
import ProjectIcon from '@atlaskit/icon/core/project';
import SettingsIcon from '@atlaskit/icon/core/settings';
import { useOpenLayerObserver } from '@atlaskit/layering/experimental/open-layer-observer';
import Link from '@atlaskit/link';
import { ConfluenceIcon } from '@atlaskit/logo';
import { Aside } from '@atlaskit/navigation-system/layout/aside';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { Panel } from '@atlaskit/navigation-system/layout/panel';
import { PanelSplitter } from '@atlaskit/navigation-system/layout/panel-splitter';
import { Root } from '@atlaskit/navigation-system/layout/root';
import {
	SideNav,
	SideNavContent,
	SideNavToggleButton,
} from '@atlaskit/navigation-system/layout/side-nav';
import {
	TopNav,
	TopNavEnd,
	TopNavMiddle,
	TopNavStart,
} from '@atlaskit/navigation-system/layout/top-nav';
import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import {
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/flyout-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import { Divider } from '@atlaskit/navigation-system/side-nav-items/menu-section';
import {
	AppLogo,
	AppSwitcher,
	CreateButton,
	Help,
	Search,
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline, Stack, Text } from '@atlaskit/primitives';
import { CheckboxSelect, type OptionType, PopupSelect } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';
const asideStyles = cssMap({
	root: { backgroundColor: token('elevation.surface.sunken') },
	content: {
		paddingTop: token('space.300'),
		paddingRight: token('space.300'),
		paddingBottom: token('space.300'),
		paddingLeft: token('space.300'),
		borderInlineStart: `${token('border.width')} solid ${token('color.border')}`,
		height: '100%',
	},
});

const panelStyles = cssMap({
	content: {
		paddingTop: token('space.300'),
		paddingRight: token('space.300'),
		paddingBottom: token('space.300'),
		paddingLeft: token('space.300'),
		borderInlineStart: `${token('border.width')} solid ${token('color.border')}`,
		height: '100%',
	},
});

const headingStyles = cssMap({
	root: {
		paddingInline: token('space.300'),
		paddingBlockStart: token('space.300'),
		height: '100%',
	},
});

const selectWrapperStyles = cssMap({
	root: {
		maxWidth: '300px',
	},
});

const selectOptions: Array<OptionType> = [
	{ label: 'accessibility', value: 'accessibility' },
	{ label: 'analytics', value: 'analytics' },
	{ label: 'ktlo', value: 'ktlo' },
	{ label: 'testing', value: 'testing' },
	{ label: 'regression', value: 'regression' },
	{ label: 'layering', value: 'layering' },
	{ label: 'innovation', value: 'innovation' },
	{ label: 'new-feature', value: 'new' },
	{ label: 'existing', value: 'existing' },
	{ label: 'wont-do', value: 'wont-do' },
];

function ControlledStatePopupSelect() {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

	return (
		<PopupSelect
			menuIsOpen={isOpen}
			onMenuOpen={() => setIsOpen(true)}
			onMenuClose={() => setIsOpen(false)}
			onChange={(option) => setSelectedOption(option)}
			value={selectedOption}
			options={selectOptions}
			target={({ isOpen, ...triggerProps }) => (
				<Button
					{...triggerProps}
					iconAfter={(iconProps) => <ChevronDownIcon {...iconProps} size="small" />}
				>
					Controlled popup select
				</Button>
			)}
			placeholder="Select labels"
		/>
	);
}

function ControlledStateCheckboxSelect() {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOptions, setSelectedOptions] = useState<ReadonlyArray<OptionType>>([]);

	return (
		<CheckboxSelect
			menuIsOpen={isOpen}
			onMenuOpen={() => setIsOpen(true)}
			onMenuClose={() => setIsOpen(false)}
			onChange={(option) => setSelectedOptions(option)}
			value={selectedOptions}
			options={selectOptions}
			placeholder="Select labels"
			label="Controlled checkbox select"
		/>
	);
}

function OpenLayerCountTracker() {
	const [openLayerCount, setOpenLayerCount] = useState(0);
	const openLayerObserver = useOpenLayerObserver();

	useEffect(() => {
		return openLayerObserver.onChange(({ count }) => {
			setOpenLayerCount(count);
		});
	}, [openLayerObserver]);

	return <Text>Open layer count: {openLayerCount}</Text>;
}

export function ResizableSlots() {
	const [resizeStartFunctionCalls, setResizeStartFunctionCalls] = useState<{
		numberOfCalls: number;
		argsLastCalledWith: { initialWidth: number } | null;
	}>({ argsLastCalledWith: null, numberOfCalls: 0 });

	const [resizeEndFunctionCalls, setResizeEndFunctionCalls] = useState<{
		numberOfCalls: number;
		argsLastCalledWith: { initialWidth: number; finalWidth: number } | null;
	}>({ argsLastCalledWith: null, numberOfCalls: 0 });

	const handleResizeStart = useCallback(({ initialWidth }: { initialWidth: number }) => {
		setResizeStartFunctionCalls((prev) => ({
			argsLastCalledWith: { initialWidth },
			numberOfCalls: prev.numberOfCalls + 1,
		}));
	}, []);

	const handleResizeEnd = useCallback(
		({ initialWidth, finalWidth }: { initialWidth: number; finalWidth: number }) => {
			setResizeEndFunctionCalls((prev) => ({
				argsLastCalledWith: { initialWidth, finalWidth },
				numberOfCalls: prev.numberOfCalls + 1,
			}));
		},
		[],
	);

	return (
		<Root>
			<TopNav>
				<TopNavStart>
					<SideNavToggleButton
						testId="side-nav-toggle-button"
						collapseLabel="Collapse sidebar"
						expandLabel="Expand sidebar"
					/>
					<AppSwitcher label="Switch apps" />
					<AppLogo href="" icon={ConfluenceIcon} name="Confluence" label="Home page" />
				</TopNavStart>
				<TopNavMiddle>
					<Search label="Search" />
					<CreateButton>Create</CreateButton>
				</TopNavMiddle>
				<TopNavEnd>
					<Help label="Help" />
					<Settings label="Settings" />
				</TopNavEnd>
			</TopNav>

			<SideNav label="Side navigation" defaultWidth={320} id="side-nav" testId="side-nav">
				<SideNavContent>
					<MenuList>
						<LinkMenuItem href="#" elemBefore={<InboxIcon label="" color="currentColor" />}>
							Your work
						</LinkMenuItem>
						<FlyoutMenuItem>
							<FlyoutMenuItemTrigger elemBefore={<ClockIcon label="" color="currentColor" />}>
								Recent
							</FlyoutMenuItemTrigger>
							<FlyoutMenuItemContent>
								<ButtonMenuItem elemBefore={<BoardIcon label="" color="currentColor" />}>
									YNG board
								</ButtonMenuItem>
								<Divider />
								<ButtonMenuItem elemBefore={<AlignTextLeftIcon label="" color="currentColor" />}>
									View all recent items
								</ButtonMenuItem>
							</FlyoutMenuItemContent>
						</FlyoutMenuItem>
						<LinkMenuItem href="#" elemBefore={<AppsIcon label="" color="currentColor" />}>
							Apps
						</LinkMenuItem>
						<LinkMenuItem href="#" elemBefore={<ProjectIcon label="" color="currentColor" />}>
							Projects
						</LinkMenuItem>
					</MenuList>
				</SideNavContent>
				<PanelSplitter
					label="Resize sidebar"
					onResizeStart={handleResizeStart}
					onResizeEnd={handleResizeEnd}
					testId="side-nav-slot-panel-splitter" // testId is used in integration tests
				/>
			</SideNav>
			<Main id="main-container">
				<Stack space="space.100" xcss={headingStyles.root}>
					<Heading size="small">Project Blueshift</Heading>

					<Stack>
						<Heading size="xsmall">onResizeStart</Heading>
						<Text>Number of calls: {resizeStartFunctionCalls.numberOfCalls}</Text>
						<Text>
							Last called with args: {JSON.stringify(resizeStartFunctionCalls.argsLastCalledWith)}
						</Text>
					</Stack>

					<Stack>
						<Heading size="xsmall">onResizeEnd</Heading>
						<Text>Number of calls: {resizeEndFunctionCalls.numberOfCalls}</Text>
						<Text>
							Last called with: {JSON.stringify(resizeEndFunctionCalls.argsLastCalledWith)}
						</Text>
					</Stack>

					<OpenLayerCountTracker />
				</Stack>
			</Main>

			<Aside xcss={asideStyles.root} defaultWidth={400} id="aside">
				<Stack space="space.400" xcss={asideStyles.content}>
					<Heading size="small">Aside</Heading>
					<Inline space="space.100">
						<Button>Following</Button>
						<Button>Share</Button>
						<DropdownMenu
							shouldRenderToParent
							placement="bottom-end"
							trigger={({ triggerRef: ref, ...props }) => (
								<IconButton ref={ref} {...props} label="Open settings" icon={SettingsIcon} />
							)}
						>
							<DropdownItemGroup>
								<DropdownItem>Permissions</DropdownItem>
							</DropdownItemGroup>
						</DropdownMenu>
					</Inline>

					<Stack space="space.050">
						<Heading size="small">Owner</Heading>
						<Text weight="medium">Michael Dougall</Text>
					</Stack>

					<Stack space="space.050" xcss={selectWrapperStyles.root}>
						<PopupSelect
							options={selectOptions}
							target={({ isOpen, ...triggerProps }) => (
								<Button
									{...triggerProps}
									iconAfter={(iconProps) => <ChevronDownIcon {...iconProps} size="small" />}
								>
									Uncontrolled popup select
								</Button>
							)}
							placeholder="Select labels"
						/>
						<ControlledStatePopupSelect />
						<CheckboxSelect
							options={selectOptions}
							placeholder="Checkbox select"
							label="Uncontrolled checkbox select"
						/>
						<ControlledStateCheckboxSelect />
					</Stack>
				</Stack>
				<PanelSplitter
					label="Resize aside"
					onResizeStart={handleResizeStart}
					onResizeEnd={handleResizeEnd}
					testId="aside-slot-panel-splitter" // testId is used in integration tests
				/>
			</Aside>

			<Panel defaultWidth={350} id="panel" testId="panel">
				<Stack space="space.200" xcss={panelStyles.content}>
					<Heading size="small">Panel</Heading>
					<Stack space="space.050">
						<Text weight="bold">What is an epic?</Text>
						<Text>Learn what an epic is and how it's displayed in Jira.</Text>
					</Stack>
					<Stack space="space.050">
						<Text weight="bold">What are sprints?</Text>
						<Text>
							Find out what sprints are and why your team might want to use them to predict and
							execute your project's work.
						</Text>
					</Stack>
					<Link href="#test">Show 12 more articles</Link>
				</Stack>
				<PanelSplitter
					label="Resize panel"
					onResizeStart={handleResizeStart}
					onResizeEnd={handleResizeEnd}
					testId="panel-slot-panel-splitter" // testId is used in integration tests
				/>
			</Panel>
		</Root>
	);
}

export default ResizableSlots;
