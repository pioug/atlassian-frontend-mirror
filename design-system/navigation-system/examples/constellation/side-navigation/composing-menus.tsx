import React, { useState } from 'react';

import { IconButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import FilterIcon from '@atlaskit/icon/core/migration/filter';
import ShowMoreHorizontal from '@atlaskit/icon/core/migration/show-more-horizontal--more';
import StarUnstarredIcon from '@atlaskit/icon/core/migration/star-unstarred--star';
import { ButtonItem, MenuGroup, Section } from '@atlaskit/menu';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import Popup from '@atlaskit/popup';

import { MockSideNav } from './common/mock-side-nav';

export const ComposingMenus = () => {
	const [isPopupOpen, setIsPopupOpen] = useState(false);

	return (
		<MockSideNav>
			<SideNavContent>
				<MenuList>
					{/* Example of composing with a dropdown menu */}
					<ButtonMenuItem
						elemBefore={<StarUnstarredIcon label="" />}
						actions={
							<DropdownMenu
								shouldRenderToParent
								trigger={({ triggerRef, ...props }) => (
									<IconButton
										ref={triggerRef}
										{...props}
										spacing="compact"
										appearance="subtle"
										label="Open"
										icon={(iconProps) => <ShowMoreHorizontal {...iconProps} size="small" />}
									/>
								)}
							>
								<DropdownItemGroup>
									<DropdownItem>Manage starred</DropdownItem>
									<DropdownItem>Export</DropdownItem>
								</DropdownItemGroup>
							</DropdownMenu>
						}
					>
						Starred
					</ButtonMenuItem>

					{/* Example of composing with a popup */}
					<ButtonMenuItem
						elemBefore={<FilterIcon label="" />}
						actions={
							<Popup
								shouldRenderToParent
								isOpen={isPopupOpen}
								onClose={() => setIsPopupOpen(false)}
								placement="bottom-start"
								content={() => (
									<MenuGroup>
										<Section>
											<ButtonItem>Manage filters</ButtonItem>
											<ButtonItem>Export</ButtonItem>
										</Section>
									</MenuGroup>
								)}
								trigger={(triggerProps) => (
									<IconButton
										{...triggerProps}
										icon={(iconProps) => <ShowMoreHorizontal {...iconProps} size="small" />}
										label="Open"
										appearance="subtle"
										spacing="compact"
										onClick={() => setIsPopupOpen(!isPopupOpen)}
										isSelected={isPopupOpen}
									/>
								)}
							/>
						}
					>
						Filters
					</ButtonMenuItem>
				</MenuList>
			</SideNavContent>
		</MockSideNav>
	);
};
