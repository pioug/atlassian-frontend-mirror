/**
 * @jsxfrag
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';

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
import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import { Popup } from '@atlaskit/popup';

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

const MoreAction = ({
	shouldRenderToParent,
	triggerTestId,
}: {
	shouldRenderToParent?: boolean;
	triggerTestId?: string;
}) => (
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
				testId={triggerTestId}
			/>
		)}
	>
		<DropdownItemGroup>
			<DropdownItem>Manage starred</DropdownItem>
			<DropdownItem>Export</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>
);

const homeIcon = <HomeIcon label="" color="currentColor" spacing="spacious" />;
const elemAfter = <Lozenge>elem after</Lozenge>;

function ButtonMenuItemWithPopup({
	shouldRenderToParent,
	testId,
}: {
	shouldRenderToParent: boolean;
	testId?: string;
}) {
	const [isNestedPopupOpen, setIsNestedPopupOpen] = useState(false);
	return (
		<ButtonMenuItem
			testId={testId}
			elemBefore={homeIcon}
			actionsOnHover={
				<Popup
					shouldRenderToParent={shouldRenderToParent}
					isOpen={isNestedPopupOpen}
					onClose={() => setIsNestedPopupOpen(false)}
					placement="bottom-start"
					content={({ setInitialFocusRef }) => (
						<div>
							<ButtonItem ref={setInitialFocusRef}>Menu item 1</ButtonItem>
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
							testId={testId ? `${testId}--add-action` : undefined}
						/>
					)}
				/>
			}
		>
			With popup {!shouldRenderToParent && '(portalled popup)'}
		</ButtonMenuItem>
	);
}

function ButtonMenuItemExample() {
	return (
		<div css={styles.root}>
			<SideNavContent>
				<MenuList>
					<ButtonMenuItem
						elemBefore={homeIcon}
						actionsOnHover={
							<MoreAction
								shouldRenderToParent
								triggerTestId="button-menu-item-with-hover-actions--more-action"
							/>
						}
						testId="button-menu-item-with-hover-actions"
					>
						With hover actions
					</ButtonMenuItem>
					<ButtonMenuItem
						elemBefore={homeIcon}
						actionsOnHover={<MoreAction shouldRenderToParent={false} />}
						testId="button-menu-item-with-hover-actions-portalled-popup"
					>
						With hover actions (portalled popup)
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
					<ButtonMenuItemWithPopup
						shouldRenderToParent={true}
						testId="button-menu-item-with-popup"
					/>
					<ButtonMenuItemWithPopup
						shouldRenderToParent={false}
						testId="button-menu-item-with-popup-portalled-popup"
					/>
				</MenuList>
			</SideNavContent>
		</div>
	);
}

export default ButtonMenuItemExample;
