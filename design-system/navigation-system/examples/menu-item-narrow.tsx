/**
 * @jsxfrag
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { type CSSProperties, useRef, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { IconButton } from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/core/add';
import BoardIcon from '@atlaskit/icon/core/board';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import Lozenge from '@atlaskit/lozenge';
import { MenuList } from '@atlaskit/navigation-system';
import {
	PanelSplitter,
	PanelSplitterProvider,
	type ResizeBounds,
} from '@atlaskit/navigation-system/layout/panel-splitter';
import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import {
	ExpandableMenuItem,
	ExpandableMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/expandable-menu-item';
import {
	FlyoutMenuItem,
	FlyoutMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/flyout-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { token } from '@atlaskit/tokens';

function MenuItemNarrow() {
	return (
		<MenuList>
			<LinkMenuItem
				href="#"
				elemBefore={<BoardIcon label="" color="currentColor" />}
				elemAfter={<Lozenge>elem after</Lozenge>}
				actions={
					<IconButton
						label="Add"
						icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
						appearance="subtle"
						spacing="compact"
					/>
				}
				actionsOnHover={
					<IconButton
						label="More"
						icon={(iconProps) => <MoreIcon {...iconProps} size="small" />}
						appearance="subtle"
						spacing="compact"
					/>
				}
			>
				Link menu item
			</LinkMenuItem>
			<ButtonMenuItem
				elemBefore={<BoardIcon label="" color="currentColor" />}
				elemAfter={<Lozenge>elem after</Lozenge>}
				actions={
					<IconButton
						label="Add"
						icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
						appearance="subtle"
						spacing="compact"
					/>
				}
				actionsOnHover={
					<IconButton
						label="More"
						icon={(iconProps) => <MoreIcon {...iconProps} size="small" />}
						appearance="subtle"
						spacing="compact"
					/>
				}
			>
				Button menu item
			</ButtonMenuItem>
			<ExpandableMenuItem>
				<ExpandableMenuItemTrigger
					elemBefore={<BoardIcon label="" color="currentColor" />}
					elemAfter={<Lozenge>elem after</Lozenge>}
					actions={
						<IconButton
							label="Add"
							icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
							appearance="subtle"
							spacing="compact"
						/>
					}
					actionsOnHover={
						<IconButton
							label="More"
							icon={(iconProps) => <MoreIcon {...iconProps} size="small" />}
							appearance="subtle"
							spacing="compact"
						/>
					}
				>
					Expandable menu item trigger
				</ExpandableMenuItemTrigger>
			</ExpandableMenuItem>
			<FlyoutMenuItem>
				<FlyoutMenuItemTrigger elemBefore={<BoardIcon label="" color="currentColor" />}>
					Flyout menu item trigger
				</FlyoutMenuItemTrigger>
			</FlyoutMenuItem>
			With overflowing slots:
			<LinkMenuItem
				href="#"
				elemBefore={<BoardIcon label="" color="currentColor" />}
				elemAfter={
					<>
						<IconButton
							label="More"
							icon={(iconProps) => <MoreIcon {...iconProps} size="small" />}
							appearance="subtle"
							spacing="compact"
						/>
						<IconButton
							label="More"
							icon={(iconProps) => <MoreIcon {...iconProps} size="small" />}
							appearance="subtle"
							spacing="compact"
						/>
					</>
				}
				actions={
					<>
						<IconButton
							label="Add"
							icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
							appearance="subtle"
							spacing="compact"
						/>
						<IconButton
							label="Add"
							icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
							appearance="subtle"
							spacing="compact"
						/>
					</>
				}
			>
				Link menu item
			</LinkMenuItem>
			<ButtonMenuItem
				elemBefore={<BoardIcon label="" color="currentColor" />}
				elemAfter={
					<>
						<IconButton
							label="More"
							icon={(iconProps) => <MoreIcon {...iconProps} size="small" />}
							appearance="subtle"
							spacing="compact"
						/>
						<IconButton
							label="More"
							icon={(iconProps) => <MoreIcon {...iconProps} size="small" />}
							appearance="subtle"
							spacing="compact"
						/>
					</>
				}
				actions={
					<>
						<IconButton
							label="Add"
							icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
							appearance="subtle"
							spacing="compact"
						/>
						<IconButton
							label="Add"
							icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
							appearance="subtle"
							spacing="compact"
						/>
					</>
				}
			>
				Button menu item
			</ButtonMenuItem>
			<ExpandableMenuItem>
				<ExpandableMenuItemTrigger
					elemBefore={<BoardIcon label="" color="currentColor" />}
					elemAfter={
						<>
							<IconButton
								label="More"
								icon={(iconProps) => <MoreIcon {...iconProps} size="small" />}
								appearance="subtle"
								spacing="compact"
							/>
							<IconButton
								label="More"
								icon={(iconProps) => <MoreIcon {...iconProps} size="small" />}
								appearance="subtle"
								spacing="compact"
							/>
						</>
					}
					actions={
						<>
							<IconButton
								label="Add"
								icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
								appearance="subtle"
								spacing="compact"
							/>
							<IconButton
								label="Add"
								icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
								appearance="subtle"
								spacing="compact"
							/>
						</>
					}
				>
					Expandable menu item trigger
				</ExpandableMenuItemTrigger>
			</ExpandableMenuItem>
		</MenuList>
	);
}
const wrapperStyles = cssMap({
	root: {
		width: '128px',
	},
});

// For the VR snapshot, we're wrapping in a container that has a set width, so the snapshot doesn't include
// extra whitespace.
export function MenuItemNarrowVR() {
	return (
		<div css={wrapperStyles.root}>
			<MenuItemNarrow />
		</div>
	);
}

const widthVar = '--panel-width';
const resizingCssVar = '--panel-splitter-resizing';

const resizeContainerStyles = cssMap({
	root: {
		width: `var(${resizingCssVar}, var(${widthVar}))`,
		position: 'relative',
		borderInlineEnd: `${token('border.width')} solid ${token('color.border')}`,
	},
});

function getResizeBounds(): ResizeBounds {
	return { min: '100px', max: '600px' };
}

// For the dev example, we're wrapping in a resizable container so we can play around with the width of the menu items.
// Not using a `SideNav` so we don't have to worry about the side nav collapsing on small viewports
export function MenuItemNarrowResizableExample() {
	const [width, setWidth] = useState(128); // Default width is 128 to match the min width of menu items
	const resizeContainerRef = useRef<HTMLDivElement | null>(null);

	return (
		<div
			ref={resizeContainerRef}
			css={resizeContainerStyles.root}
			style={
				{
					[widthVar]: `${width}px`,
				} as CSSProperties
			}
		>
			<PanelSplitterProvider
				panelRef={resizeContainerRef}
				panelWidth={width}
				onCompleteResize={setWidth}
				getResizeBounds={getResizeBounds}
				resizingCssVar={resizingCssVar}
			>
				<MenuItemNarrow />
				<PanelSplitter label="Resize button" />
			</PanelSplitterProvider>
		</div>
	);
}

export default MenuItemNarrowResizableExample;
