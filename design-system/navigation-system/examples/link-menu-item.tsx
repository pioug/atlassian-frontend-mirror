/**
 * @jsxfrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import Avatar from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import AddIcon from '@atlaskit/icon/core/add';
import HomeIcon from '@atlaskit/icon/core/home';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import Lozenge from '@atlaskit/lozenge';
import { MenuList } from '@atlaskit/navigation-system';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import {
	COLLAPSE_ELEM_BEFORE,
	LinkMenuItem,
} from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack } from '@atlaskit/primitives';

const styles = cssMap({
	root: {
		width: '300px',
	},
});

const AddAction = ({ shouldRenderToParent }: { shouldRenderToParent: boolean }) => (
	// eslint-disable-next-line @atlaskit/design-system/use-should-render-to-parent
	<DropdownMenu
		shouldRenderToParent={shouldRenderToParent}
		trigger={({ triggerRef, ...props }) => (
			<IconButton
				ref={triggerRef}
				{...props}
				spacing="compact"
				appearance="subtle"
				label="Add"
				icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
			/>
		)}
	>
		<DropdownItemGroup>
			<DropdownItem>Create</DropdownItem>
			<DropdownItem>Import</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>
);

const MoreAction = ({ shouldRenderToParent }: { shouldRenderToParent: boolean }) => (
	// eslint-disable-next-line @atlaskit/design-system/use-should-render-to-parent
	<DropdownMenu
		shouldRenderToParent={shouldRenderToParent}
		trigger={({ triggerRef, ...props }) => (
			<IconButton
				ref={triggerRef}
				{...props}
				spacing="compact"
				appearance="subtle"
				label="More"
				icon={(iconProps) => <MoreIcon {...iconProps} size="small" />}
			/>
		)}
	>
		<DropdownItemGroup>
			<DropdownItem>Manage starred</DropdownItem>
			<DropdownItem>Export</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>
);

const MockActions = ({ shouldRenderToParent }: { shouldRenderToParent: boolean }) => (
	<>
		<AddAction shouldRenderToParent={shouldRenderToParent} />
		<MoreAction shouldRenderToParent={shouldRenderToParent} />
	</>
);

const homeIcon = <HomeIcon label="" color="currentColor" spacing="spacious" />;
const homeIconButton = (
	<IconButton icon={HomeIcon} label="IconButton" appearance="subtle" spacing="compact" />
);
const elemAfter = <Lozenge>elem after</Lozenge>;

export const LinkMenuItemExample = () => (
	<div css={styles.root}>
		<SideNavContent>
			<MenuList>
				<LinkMenuItem href="#">Text only</LinkMenuItem>
				<LinkMenuItem href="#" elemBefore={COLLAPSE_ELEM_BEFORE}>
					Text only (collapse elemBefore)
				</LinkMenuItem>
				<LinkMenuItem href="#" elemBefore={homeIcon}>
					With elemBefore
				</LinkMenuItem>
				<LinkMenuItem href="#" elemBefore={homeIcon}>
					With elemBefore and long overflowing text
				</LinkMenuItem>
				<LinkMenuItem href="#" elemBefore="🙂">
					Emoji as elemBefore
				</LinkMenuItem>
				<LinkMenuItem
					href="#"
					elemBefore={homeIcon}
					description="This is an example of a long description"
				>
					With description
				</LinkMenuItem>
				<LinkMenuItem
					href="#"
					elemBefore={homeIcon}
					description="This is an example of a long description"
					isSelected
				>
					Description and selected
				</LinkMenuItem>
				<LinkMenuItem href="#" elemBefore={homeIconButton}>
					With icon button as elemBefore
				</LinkMenuItem>
				<LinkMenuItem href="#" elemBefore={homeIcon} isSelected>
					Selected
				</LinkMenuItem>
				<LinkMenuItem
					href="#"
					elemBefore={homeIcon}
					isSelected
					actions={<MockActions shouldRenderToParent />}
				>
					Selected with actions
				</LinkMenuItem>
				<LinkMenuItem href="#" elemBefore={<Avatar />}>
					With avatar
				</LinkMenuItem>
				<LinkMenuItem href="#" elemBefore={homeIcon} actions={<MockActions shouldRenderToParent />}>
					With actions
				</LinkMenuItem>
				<LinkMenuItem
					href="#"
					elemBefore={homeIcon}
					actions={<MockActions shouldRenderToParent={false} />}
				>
					With actions (portalled popup)
				</LinkMenuItem>
				<LinkMenuItem
					href="#"
					elemBefore={homeIcon}
					actionsOnHover={<MockActions shouldRenderToParent />}
				>
					With hover actions
				</LinkMenuItem>
				<LinkMenuItem
					href="#"
					elemBefore={homeIcon}
					actionsOnHover={<MockActions shouldRenderToParent={false} />}
				>
					With hover actions (portalled popup)
				</LinkMenuItem>
				<LinkMenuItem
					href="#"
					elemBefore={homeIcon}
					actionsOnHover={<MockActions shouldRenderToParent />}
				>
					With hover actions and elemBefore and long text
				</LinkMenuItem>
				<LinkMenuItem href="#" elemBefore={homeIcon} elemAfter={elemAfter}>
					With elemAfter
				</LinkMenuItem>
				<LinkMenuItem
					href="#"
					elemBefore={homeIcon}
					elemAfter={elemAfter}
					actions={<MockActions shouldRenderToParent />}
				>
					With elemAfter and actions
				</LinkMenuItem>
				<LinkMenuItem
					href="#"
					elemBefore={homeIcon}
					elemAfter={elemAfter}
					actions={<MockActions shouldRenderToParent />}
				>
					With elemAfter and actions (portalled popup)
				</LinkMenuItem>
				<LinkMenuItem
					href="#"
					elemBefore={homeIcon}
					actions={<AddAction shouldRenderToParent />}
					actionsOnHover={<MoreAction shouldRenderToParent />}
				>
					With actions and hoverActions
				</LinkMenuItem>
				<LinkMenuItem
					href="#"
					elemBefore={homeIcon}
					actions={<AddAction shouldRenderToParent={false} />}
					actionsOnHover={<MoreAction shouldRenderToParent={false} />}
				>
					With actions and hoverActions (portalled popup)
				</LinkMenuItem>
				<LinkMenuItem
					href="#"
					elemBefore={homeIcon}
					elemAfter={elemAfter}
					actionsOnHover={<MoreAction shouldRenderToParent />}
				>
					With elemAfter and hoverActions
				</LinkMenuItem>
				<LinkMenuItem
					href="#"
					elemBefore={homeIcon}
					elemAfter={elemAfter}
					actionsOnHover={<MoreAction shouldRenderToParent={false} />}
				>
					With elemAfter and hoverActions (portalled popup)
				</LinkMenuItem>
				<LinkMenuItem
					description="A long description that should be truncated"
					href="#"
					elemBefore={homeIconButton}
					actions={<AddAction shouldRenderToParent />}
					elemAfter={elemAfter}
					actionsOnHover={<MoreAction shouldRenderToParent />}
				>
					With all options and long text
				</LinkMenuItem>
				<LinkMenuItem
					description="A long description that should be truncated"
					href="#"
					elemBefore={homeIconButton}
					actions={<AddAction shouldRenderToParent={false} />}
					elemAfter={elemAfter}
					actionsOnHover={<MoreAction shouldRenderToParent={false} />}
				>
					With all options and long text (portalled popup)
				</LinkMenuItem>
			</MenuList>
		</SideNavContent>
	</div>
);

export const LinkMenuItemRTLExample = () => (
	<div dir="rtl">
		<LinkMenuItemExample />
	</div>
);

export const LinkMenuItemWithElemAfter = () => (
	<div css={styles.root}>
		<MenuList>
			<LinkMenuItem href="#" elemBefore={homeIcon} elemAfter={elemAfter}>
				With elemAfter
			</LinkMenuItem>
		</MenuList>
	</div>
);

export const LinkMenuItemWithElemAfterAndActionsOnHover = () => (
	<div css={styles.root}>
		<MenuList>
			<LinkMenuItem
				href="#"
				elemBefore={homeIcon}
				elemAfter={elemAfter}
				actionsOnHover={<MockActions shouldRenderToParent />}
			>
				With elemAfter and actionsOnHover
			</LinkMenuItem>
		</MenuList>
	</div>
);

export const LinkMenuItemBasic = () => (
	<div css={styles.root}>
		<MenuList>
			<LinkMenuItem href="#" elemBefore={homeIcon}>
				Basic link menu item
			</LinkMenuItem>
		</MenuList>
	</div>
);

export const LinkMenuItemSelected = () => (
	<div css={styles.root}>
		<MenuList>
			<LinkMenuItem href="#" isSelected elemBefore={homeIcon}>
				Selected link menu item
			</LinkMenuItem>
		</MenuList>
	</div>
);

const ExportAction = ({
	shouldRenderToParent,
	defaultOpen,
}: {
	shouldRenderToParent?: boolean;
	defaultOpen?: boolean;
}) => (
	// eslint-disable-next-line @atlaskit/design-system/use-should-render-to-parent
	<DropdownMenu
		defaultOpen={defaultOpen}
		shouldRenderToParent={shouldRenderToParent}
		trigger={({ triggerRef, ...props }) => (
			<IconButton
				ref={triggerRef}
				{...props}
				spacing="compact"
				appearance="subtle"
				label="More"
				icon={(iconProps) => <MoreIcon {...iconProps} size="small" />}
			/>
		)}
	>
		<DropdownItemGroup>
			<DropdownItem>Export</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>
);

export const LinkMenuItemWithDropdownActionOpen = ({ isSelected }: { isSelected?: boolean }) => (
	<div css={styles.root}>
		<MenuList>
			<Stack space="space.800">
				<LinkMenuItem href="#" actions={<ExportAction shouldRenderToParent defaultOpen />}>
					Dropdown open (actions)
				</LinkMenuItem>

				<LinkMenuItem
					href="#"
					isSelected
					actions={<ExportAction shouldRenderToParent defaultOpen />}
				>
					Selected with dropdown open (actions)
				</LinkMenuItem>

				<LinkMenuItem href="#" actions={<ExportAction shouldRenderToParent={false} defaultOpen />}>
					Portalled dropdown open (actions)
				</LinkMenuItem>

				<LinkMenuItem href="#" actionsOnHover={<ExportAction shouldRenderToParent defaultOpen />}>
					Dropdown open (actionsOnHover)
				</LinkMenuItem>

				<LinkMenuItem
					href="#"
					actionsOnHover={<ExportAction shouldRenderToParent={false} defaultOpen />}
				>
					Portalled dropdown open (actionsOnHover)
				</LinkMenuItem>

				<LinkMenuItem
					href="#"
					elemAfter={<Lozenge>elem after</Lozenge>}
					actionsOnHover={<ExportAction shouldRenderToParent defaultOpen />}
				>
					elemAfter and dropdown open (actionsOnHover)
				</LinkMenuItem>

				<LinkMenuItem
					href="#"
					elemAfter={<Lozenge>elem after</Lozenge>}
					actionsOnHover={<ExportAction shouldRenderToParent={false} defaultOpen />}
				>
					elemAfter and portalled dropdown open (actionsOnHover)
				</LinkMenuItem>
			</Stack>
		</MenuList>
	</div>
);

// Combining into one example for atlaskit site
const Example = () => (
	<div>
		<LinkMenuItemExample />
		<div dir="rtl">RTL</div>
		<LinkMenuItemRTLExample />
	</div>
);

export default Example;
