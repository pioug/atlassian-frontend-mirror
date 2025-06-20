/**
 * @jsxfrag
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useState } from 'react';

import Avatar from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import AddIcon from '@atlaskit/icon/core/add';
import HomeIcon from '@atlaskit/icon/core/home';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import Lozenge from '@atlaskit/lozenge';
import { ButtonItem } from '@atlaskit/menu';
import { MenuList } from '@atlaskit/navigation-system';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import {
	ButtonMenuItem,
	COLLAPSE_ELEM_BEFORE,
} from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import Popup from '@atlaskit/popup';
import { Stack } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	root: {
		width: '300px',
	},
});

const AddAction = ({ shouldRenderToParent }: { shouldRenderToParent?: boolean }) => (
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

const MoreAction = ({ shouldRenderToParent }: { shouldRenderToParent?: boolean }) => (
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
const elemAfter = <Lozenge>elem after</Lozenge>;

export const ButtonMenuItemExample = () => (
	<div css={styles.root}>
		<SideNavContent>
			<MenuList>
				<ButtonMenuItem>Text only</ButtonMenuItem>
				<ButtonMenuItem elemBefore={COLLAPSE_ELEM_BEFORE}>
					Text only (collapse elemBefore)
				</ButtonMenuItem>
				<ButtonMenuItem elemBefore={homeIcon}>With elemBefore</ButtonMenuItem>
				<ButtonMenuItem elemBefore={homeIcon}>
					With elemBefore and long overflowing text
				</ButtonMenuItem>
				<ButtonMenuItem elemBefore="🙂">Emoji as elemBefore</ButtonMenuItem>
				<ButtonMenuItem
					elemBefore={homeIcon}
					description="This is an example of a long description"
				>
					With description
				</ButtonMenuItem>
				<ButtonMenuItem
					elemBefore={
						<IconButton icon={HomeIcon} label="IconButton" appearance="subtle" spacing="compact" />
					}
				>
					With icon button as elemBefore
				</ButtonMenuItem>
				<ButtonMenuItem elemBefore={<Avatar />}>With avatar</ButtonMenuItem>
				<ButtonMenuItem elemBefore={homeIcon} actions={<MockActions shouldRenderToParent />}>
					With actions
				</ButtonMenuItem>
				<ButtonMenuItem
					elemBefore={homeIcon}
					actions={<MockActions shouldRenderToParent={false} />}
				>
					With actions (portalled popup)
				</ButtonMenuItem>
				<ButtonMenuItem elemBefore={homeIcon} actionsOnHover={<MockActions shouldRenderToParent />}>
					With hover actions
				</ButtonMenuItem>
				<ButtonMenuItem
					elemBefore={homeIcon}
					actionsOnHover={<MockActions shouldRenderToParent={false} />}
				>
					With hover actions (portalled popup)
				</ButtonMenuItem>
				<ButtonMenuItem elemBefore={homeIcon} actionsOnHover={<MockActions shouldRenderToParent />}>
					With hover actions and elemBefore and long text
				</ButtonMenuItem>
				<ButtonMenuItem elemBefore={homeIcon} elemAfter={elemAfter}>
					With elemAfter
				</ButtonMenuItem>
				<ButtonMenuItem
					elemBefore={homeIcon}
					elemAfter={elemAfter}
					actions={<MockActions shouldRenderToParent />}
				>
					With elemAfter and actions
				</ButtonMenuItem>
				<ButtonMenuItem
					elemBefore={homeIcon}
					elemAfter={elemAfter}
					actions={<MockActions shouldRenderToParent={false} />}
				>
					With elemAfter and actions (portalled popup)
				</ButtonMenuItem>
				<ButtonMenuItem
					elemBefore={homeIcon}
					actions={<AddAction shouldRenderToParent />}
					actionsOnHover={<MoreAction shouldRenderToParent />}
				>
					With actions and hover actions
				</ButtonMenuItem>
				<ButtonMenuItem
					elemBefore={homeIcon}
					actions={<AddAction shouldRenderToParent={false} />}
					actionsOnHover={<MoreAction shouldRenderToParent={false} />}
				>
					With actions and hover actions (portalled popup)
				</ButtonMenuItem>
				<ButtonMenuItem
					elemBefore={homeIcon}
					elemAfter={elemAfter}
					actionsOnHover={<MoreAction shouldRenderToParent />}
				>
					With elemAfter and hover actions
				</ButtonMenuItem>
				<ButtonMenuItem
					elemBefore={homeIcon}
					elemAfter={elemAfter}
					actionsOnHover={<MoreAction shouldRenderToParent={false} />}
				>
					With elemAfter and hover actions (portalled popup)
				</ButtonMenuItem>
				<ButtonMenuItem
					description="A long description that should be truncated"
					elemBefore={homeIcon}
					actions={<AddAction shouldRenderToParent />}
					elemAfter={elemAfter}
					actionsOnHover={<MoreAction shouldRenderToParent />}
				>
					With all options and long text
				</ButtonMenuItem>
				<ButtonMenuItem
					description="A long description that should be truncated"
					elemBefore={homeIcon}
					actions={<AddAction shouldRenderToParent={false} />}
					elemAfter={elemAfter}
					actionsOnHover={<MoreAction shouldRenderToParent={false} />}
				>
					With all options and long text (portalled popup)
				</ButtonMenuItem>
				<ButtonMenuItem elemBefore={homeIcon} isDisabled>
					Disabled
				</ButtonMenuItem>
				<ButtonMenuItem elemBefore={homeIcon} isDisabled description="with description">
					Disabled
				</ButtonMenuItem>
			</MenuList>
		</SideNavContent>
	</div>
);

export const ButtonMenuItemRTLExample = () => (
	<div dir="rtl">
		<ButtonMenuItemExample />
	</div>
);

export const ButtonMenuItemWithPopup = () => {
	const [isNestedPopupOpen, setIsNestedPopupOpen] = useState(false);
	const [isNestedPopup2Open, setIsNestedPopup2Open] = useState(true);
	return (
		<div css={styles.root}>
			<SideNavContent>
				<MenuList>
					<ButtonMenuItem
						elemBefore={homeIcon}
						actions={
							<Popup
								shouldRenderToParent
								isOpen={isNestedPopupOpen}
								onClose={() => setIsNestedPopupOpen(false)}
								placement="bottom-start"
								content={() => (
									<div>
										<ButtonItem>Menu item 1</ButtonItem>
										<ButtonItem>Menu item 2</ButtonItem>
									</div>
								)}
								trigger={(triggerProps) => (
									<IconButton
										{...triggerProps}
										icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
										label="Add"
										appearance="subtle"
										spacing="compact"
										onClick={() => setIsNestedPopupOpen(!isNestedPopupOpen)}
										isSelected={isNestedPopupOpen}
									/>
								)}
							/>
						}
					>
						With popup rendered in portal
					</ButtonMenuItem>
					<ButtonMenuItem
						elemBefore={homeIcon}
						actions={
							<Popup
								shouldRenderToParent
								isOpen={isNestedPopup2Open}
								onClose={() => setIsNestedPopup2Open(false)}
								placement="bottom-start"
								content={() => (
									<div>
										<ButtonItem>Menu item 1</ButtonItem>
										<ButtonItem>Menu item 2</ButtonItem>
									</div>
								)}
								trigger={(triggerProps) => (
									<IconButton
										{...triggerProps}
										icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
										label="Add"
										appearance="subtle"
										spacing="compact"
										onClick={() => setIsNestedPopup2Open(!isNestedPopup2Open)}
										isSelected={isNestedPopup2Open}
									/>
								)}
							/>
						}
					>
						With popup rendered to parent
					</ButtonMenuItem>
					<ButtonMenuItem
						elemBefore={homeIcon}
						elemAfter={elemAfter}
						actions={<AddAction shouldRenderToParent />}
					>
						With elemAfter and action
					</ButtonMenuItem>
				</MenuList>
			</SideNavContent>
		</div>
	);
};

export const ButtonMenuItemWithElemAfter = () => (
	<div css={styles.root}>
		<MenuList>
			<ButtonMenuItem elemBefore={homeIcon} elemAfter={elemAfter}>
				With elemAfter
			</ButtonMenuItem>
		</MenuList>
	</div>
);

export const ButtonMenuItemWithElemAfterAndActionsOnHover = () => (
	<div css={styles.root}>
		<MenuList>
			<ButtonMenuItem
				elemBefore={homeIcon}
				elemAfter={elemAfter}
				actionsOnHover={<MockActions shouldRenderToParent />}
			>
				With elemAfter and actionsOnHover
			</ButtonMenuItem>
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

export const ButtonMenuItemWithDropdownActionOpen = () => (
	<div css={styles.root}>
		<MenuList>
			<Stack space="space.800">
				<ButtonMenuItem actions={<ExportAction shouldRenderToParent defaultOpen />}>
					Dropdown open (actions)
				</ButtonMenuItem>

				<ButtonMenuItem actions={<ExportAction shouldRenderToParent={false} defaultOpen />}>
					Portalled dropdown open (actions)
				</ButtonMenuItem>

				<ButtonMenuItem actionsOnHover={<ExportAction shouldRenderToParent defaultOpen />}>
					Dropdown open (actionsOnHover)
				</ButtonMenuItem>

				<ButtonMenuItem actionsOnHover={<ExportAction shouldRenderToParent={false} defaultOpen />}>
					Portalled dropdown open (actionsOnHover)
				</ButtonMenuItem>

				<ButtonMenuItem
					elemAfter={<Lozenge>elem after</Lozenge>}
					actionsOnHover={<ExportAction shouldRenderToParent defaultOpen />}
				>
					elemAfter and dropdown open (actionsOnHover)
				</ButtonMenuItem>

				<ButtonMenuItem
					elemAfter={<Lozenge>elem after</Lozenge>}
					actionsOnHover={<ExportAction shouldRenderToParent={false} defaultOpen />}
				>
					elemAfter and portalled dropdown open (actionsOnHover)
				</ButtonMenuItem>
			</Stack>
		</MenuList>
	</div>
);

export const ButtonMenuItemDisabled = () => (
	<div css={styles.root}>
		<MenuList>
			<ButtonMenuItem elemBefore={homeIcon} isDisabled>
				Disabled
			</ButtonMenuItem>
		</MenuList>
	</div>
);

export const ButtonMenuItemDisabledWithActions = () => (
	<div css={styles.root}>
		<MenuList>
			<ButtonMenuItem
				elemBefore={homeIcon}
				isDisabled
				actions={<AddAction />}
				actionsOnHover={<MoreAction />}
			>
				Disabled with actions
			</ButtonMenuItem>
		</MenuList>
	</div>
);

export const ButtonMenuItemBasic = () => (
	<div css={styles.root}>
		<MenuList>
			<ButtonMenuItem elemBefore={homeIcon}>Basic button menu item</ButtonMenuItem>
		</MenuList>
	</div>
);

// Combining into one example for atlaskit site
const Example = () => (
	<div>
		<ButtonMenuItemExample />
		<div>With popup</div>
		<ButtonMenuItemWithPopup />
		<div dir="rtl">RTL</div>
		<ButtonMenuItemRTLExample />
	</div>
);

export default Example;
