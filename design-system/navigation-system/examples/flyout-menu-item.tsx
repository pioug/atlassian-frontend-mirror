/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { IconButton } from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/core/add';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import ClockIcon from '@atlaskit/icon/core/clock';
import FilterIcon from '@atlaskit/icon/core/filter';
import SearchIcon from '@atlaskit/icon/core/search';
import { ButtonItem } from '@atlaskit/menu';
import { COLLAPSE_ELEM_BEFORE, MenuList } from '@atlaskit/navigation-system';
import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import {
	FlyoutBody,
	FlyoutFooter,
	FlyoutHeader,
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/flyout-menu-item';
import Popup from '@atlaskit/popup';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const wrapperStyles = cssMap({
	root: {
		width: '300px',
	},
});

const textfieldStyles = cssMap({
	root: {
		paddingInlineStart: token('space.075'),
		paddingInlineEnd: token('space.025'),
		paddingBlockStart: token('space.025'),
	},
})

const ExampleWrapper = ({ children }: { children: React.ReactNode }) => (
	<div css={wrapperStyles.root}>
		<MenuList>{children}</MenuList>
	</div>
);

const FlyoutMenuItemControlled = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<ExampleWrapper>
			<FlyoutMenuItem isOpen={isOpen}>
				<FlyoutMenuItemTrigger onClick={() => setIsOpen(!isOpen)}>
					Flyout Menu Item (controlled)
				</FlyoutMenuItemTrigger>
				<FlyoutMenuItemContent onClose={() => setIsOpen(false)}>
					<MenuList>
						<ButtonMenuItem>Menu Button 1</ButtonMenuItem>
						<ButtonMenuItem>Menu Button 2</ButtonMenuItem>
					</MenuList>
				</FlyoutMenuItemContent>
			</FlyoutMenuItem>
		</ExampleWrapper>
	);
};

const FlyoutMenuItemSlots = ({
	isDefaultOpen = false,
	numItems = 50,
}: {
	isDefaultOpen?: boolean;
	numItems?: number;
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<ExampleWrapper>
			<FlyoutMenuItem
				onOpenChange={(open) => {
					if (!open) {
						setIsOpen(false);
					}
				}}
				isDefaultOpen={isDefaultOpen}
			>
				<FlyoutMenuItemTrigger onClick={() => setIsOpen(!isOpen)}>
					Flyout Menu Item Slots
				</FlyoutMenuItemTrigger>
				<FlyoutMenuItemContent onClose={() => setIsOpen(false)} data-testid="flyout-menu-item-slots">
					<FlyoutHeader title="Recent" closeButtonLabel="Close menu">
						<Box>
							<Inline space="space.100">
								<Textfield
									isCompact
									elemBeforeInput={
										<Box xcss={textfieldStyles.root}>
											<SearchIcon label="" spacing="spacious" />
										</Box>
									}
									placeholder="Search recent items"
								/>
								<IconButton icon={FilterIcon} label="" />
							</Inline>
						</Box>
					</FlyoutHeader>

					<FlyoutBody>
						<MenuList>
							{Array.from({ length: numItems }, (_, i) => (
								<ButtonMenuItem key={i}>
									Menu Button {i + 1}
								</ButtonMenuItem>
							))}
						</MenuList>
					</FlyoutBody>

					<FlyoutFooter>
						<MenuList>
							<ButtonMenuItem
								elemBefore={<AlignTextLeftIcon label="" color="currentColor" />}
							>
								View all recent items
							</ButtonMenuItem>
						</MenuList>
					</FlyoutFooter>
				</FlyoutMenuItemContent>
			</FlyoutMenuItem>
		</ExampleWrapper>
	);
};

export const FlyoutMenuItemSlotsManyDefaultOpen = () => (
	<FlyoutMenuItemSlots isDefaultOpen />
);

export const FlyoutMenuItemExample = () => (
	<ExampleWrapper>
		<FlyoutMenuItem>
			<FlyoutMenuItemTrigger>Flyout Menu Item</FlyoutMenuItemTrigger>
			<FlyoutMenuItemContent>
				<MenuList>
					<ButtonMenuItem>Menu Button 1</ButtonMenuItem>
					<ButtonMenuItem>Menu Button 2</ButtonMenuItem>
				</MenuList>
			</FlyoutMenuItemContent>
		</FlyoutMenuItem>

		<FlyoutMenuItem>
			<FlyoutMenuItemTrigger
				elemBefore={<ClockIcon label="" spacing="spacious" color={token('color.icon')} />}
			>
				Flyout Menu Item with icon and long text
			</FlyoutMenuItemTrigger>
			<FlyoutMenuItemContent>
				<MenuList>
					<ButtonMenuItem>Button Menu Item 1</ButtonMenuItem>
					<ButtonMenuItem>Button Menu Item 2</ButtonMenuItem>
				</MenuList>
			</FlyoutMenuItemContent>
		</FlyoutMenuItem>

		<FlyoutMenuItem>
			<FlyoutMenuItemTrigger elemBefore="🙂">Flyout with emoji</FlyoutMenuItemTrigger>
			<FlyoutMenuItemContent>
				<MenuList>
					<ButtonMenuItem>Button Menu Item 1</ButtonMenuItem>
					<ButtonMenuItem>Button Menu Item 2</ButtonMenuItem>
				</MenuList>
			</FlyoutMenuItemContent>
		</FlyoutMenuItem>

		<FlyoutMenuItem>
			<FlyoutMenuItemTrigger isSelected>Flyout Menu Item - selected</FlyoutMenuItemTrigger>
			<FlyoutMenuItemContent>
				<MenuList>
					<ButtonMenuItem>Menu Button 1</ButtonMenuItem>
					<ButtonMenuItem>Menu Button 2</ButtonMenuItem>
				</MenuList>
			</FlyoutMenuItemContent>
		</FlyoutMenuItem>

		<FlyoutMenuItem>
			<FlyoutMenuItemTrigger elemBefore={COLLAPSE_ELEM_BEFORE}>
				Flyout with collapsed elemBefore
			</FlyoutMenuItemTrigger>
			<FlyoutMenuItemContent>
				<MenuList>
					<ButtonMenuItem>Menu Button 1</ButtonMenuItem>
					<ButtonMenuItem>Menu Button 2</ButtonMenuItem>
				</MenuList>
			</FlyoutMenuItemContent>
		</FlyoutMenuItem>
	</ExampleWrapper>
);

export const FlyoutMenuItemDefaultOpenExample = ({ isSelected }: { isSelected?: boolean }) => (
	<ExampleWrapper>
		<FlyoutMenuItem isDefaultOpen>
			<FlyoutMenuItemTrigger
				elemBefore={<ClockIcon label="" spacing="spacious" color={token('color.icon')} />}
				isSelected={isSelected}
			>
				Flyout Menu Item
			</FlyoutMenuItemTrigger>
			<FlyoutMenuItemContent>
				<MenuList>
					<ButtonMenuItem>Button Menu Item 1</ButtonMenuItem>
					<ButtonMenuItem
						actions={
							<IconButton
								key="add"
								label="Add"
								icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
								appearance="subtle"
								spacing="compact"
							/>
						}
					>
						Button Menu Item 2
					</ButtonMenuItem>
				</MenuList>
			</FlyoutMenuItemContent>
		</FlyoutMenuItem>
	</ExampleWrapper>
);

export const FlyoutMenuItemDefaultOpenSelectedVR = () => (
	<FlyoutMenuItemDefaultOpenExample isSelected />
);

export const FlyoutMenuItemWithNestedPopupExample = ({
	isDefaultOpen = false,
}: {
	isDefaultOpen?: boolean;
}) => {
	const [isNestedPopupOpen, setIsNestedPopupOpen] = useState(isDefaultOpen);

	return (
		<ExampleWrapper>
			<FlyoutMenuItem
				onOpenChange={(open) => {
					if (!open) {
						setIsNestedPopupOpen(false);
					}
				}}
				isDefaultOpen={isDefaultOpen}
			>
				<FlyoutMenuItemTrigger>Flyout with nested popup</FlyoutMenuItemTrigger>
				<FlyoutMenuItemContent>
					<MenuList>
						<ButtonMenuItem
							actions={
								<Popup
									shouldRenderToParent
									isOpen={isNestedPopupOpen}
									onClose={() => setIsNestedPopupOpen(false)}
									placement="right-start"
									content={() => (
										<div>
											<ButtonItem>Menu button 1</ButtonItem>
											<ButtonItem>Menu button 2</ButtonItem>
											<ButtonItem>Menu button 3</ButtonItem>
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
							With a popup
						</ButtonMenuItem>
						<ButtonMenuItem>Menu Item 2</ButtonMenuItem>
					</MenuList>
				</FlyoutMenuItemContent>
			</FlyoutMenuItem>
		</ExampleWrapper>
	);
};

export const FlyoutMenuItemWithNestedPopupDefaultOpenExample = () => (
	<FlyoutMenuItemWithNestedPopupExample isDefaultOpen />
);

export const FlyoutMenuItemRTL = () => (
	<div dir="rtl">
		<FlyoutMenuItemExample />
	</div>
);

export const FlyoutMenuItemDefaultOpenRTL = () => (
	<div dir="rtl">
		<FlyoutMenuItemDefaultOpenExample />
	</div>
);

export const FlyoutMenuItemTriggerBasic = () => (
	<ExampleWrapper>
		<FlyoutMenuItem>
			<FlyoutMenuItemTrigger>Flyout menu item</FlyoutMenuItemTrigger>
		</FlyoutMenuItem>
	</ExampleWrapper>
);

export const FlyoutMenuItemTriggerSelected = () => (
	<ExampleWrapper>
		<FlyoutMenuItem>
			<FlyoutMenuItemTrigger isSelected>Flyout menu item</FlyoutMenuItemTrigger>
		</FlyoutMenuItem>
	</ExampleWrapper>
);

// Combining into one example for atlaskit site
const Example = () => (
	<Stack space="space.200">
		<div>
			Default
			<FlyoutMenuItemExample />
		</div>

		<div>
			Default open
			<FlyoutMenuItemDefaultOpenExample />
		</div>

		<div>
			With nested popup
			<FlyoutMenuItemWithNestedPopupExample />
		</div>

		<div>
			With slots
			<FlyoutMenuItemSlots />
		</div>

		<div>
			<div dir="rtl">RTL</div>
			<FlyoutMenuItemRTL />
		</div>

		<FlyoutMenuItemControlled />
	</Stack>
);

export default Example;
