/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import BoardIcon from '@atlaskit/icon/core/board';
import SearchIcon from '@atlaskit/icon/core/search';
import {
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/flyout-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import {
	Divider,
	MenuSection,
	MenuSectionHeading,
} from '@atlaskit/navigation-system/side-nav-items/menu-section';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const contentContainerStyles = cssMap({
	root: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
	heading: {
		paddingInlineStart: token('space.075'),
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.100'),
	},
});

function LoadingPlaceholder() {
	return <div css={contentContainerStyles.root}>Loading...</div>;
}

function LazyLoadedContent() {
	/**
	 * We cannot use the `setInitialFocusRef` render prop to set focus on the initial focus button,
	 * as it is lazy loaded in **after** the popup has opened.
	 *
	 * `setInitialFocusRef` is a focus-trap utility (https://github.com/focus-trap/focus-trap#initialfocus),
	 * which only sets the focus to the specified element when the focus trap is activated - which is
	 * right after the popup has opened. Lazy loaded content is not in the DOM yet, so cannot use this
	 * functionality. Instead, focused needs to be manually set once the content has mounted.
	 */
	const initialFocusRef = useRef<HTMLElement>(null);
	useEffect(() => {
		console.log('initialFocusRef', initialFocusRef.current);
		if (initialFocusRef.current) {
			initialFocusRef.current.focus();
		}
	}, []);

	return (
		<>
			<Stack space="space.050" xcss={contentContainerStyles.heading}>
				<Heading size="xsmall" as="span">
					Recent
				</Heading>
				<Textfield
					ref={initialFocusRef}
					isCompact
					elemBeforeInput={
						<Box
							paddingInlineStart="space.075"
							paddingInlineEnd="space.025"
							paddingBlockStart="space.025"
						>
							<SearchIcon label="" spacing="spacious" />
						</Box>
					}
					placeholder="Search recent items"
				/>
			</Stack>
			<MenuSection>
				<MenuSectionHeading>This week</MenuSectionHeading>
				<MenuList>
					<LinkMenuItem
						href="#"
						elemBefore={<BoardIcon label="" spacing="spacious" />}
						description="5 days ago"
					>
						My Kanban Project
					</LinkMenuItem>
					<LinkMenuItem href="#" description="6 days ago">
						Business projects
					</LinkMenuItem>
				</MenuList>
			</MenuSection>

			<MenuSection>
				<MenuSectionHeading>This month</MenuSectionHeading>
				<MenuList>
					<LinkMenuItem
						href="#"
						elemBefore={<BoardIcon label="" spacing="spacious" />}
						description="5 days ago"
					>
						KO Board
					</LinkMenuItem>
				</MenuList>
			</MenuSection>

			<Divider />
			<MenuList>
				<LinkMenuItem href="#" elemBefore={<AlignTextLeftIcon label="" />}>
					View all recent items
				</LinkMenuItem>
			</MenuList>
		</>
	);
}

const exampleContainerStyles = cssMap({
	root: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		width: '300px',
	},
});

export default function FlyoutMenuItemLazyLoadedContentFocusExample() {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const [isLoaded, setIsLoaded] = useState(false);

	const handleOpenPopup = useCallback(() => {
		setIsOpen((val) => !val);
		setTimeout(() => setIsLoaded(true), 1000);
	}, []);

	const handleClosePopup = useCallback(() => {
		setIsOpen(false);
		triggerRef.current?.focus();
	}, []);

	return (
		<div css={exampleContainerStyles.root}>
			<FlyoutMenuItem isOpen={isOpen}>
				<FlyoutMenuItemTrigger onClick={handleOpenPopup} ref={triggerRef}>
					Toggle flyout
				</FlyoutMenuItemTrigger>
				<FlyoutMenuItemContent onClose={handleClosePopup} autoFocus={false}>
					{isLoaded ? <LazyLoadedContent /> : <LoadingPlaceholder />}
				</FlyoutMenuItemContent>
			</FlyoutMenuItem>
		</div>
	);
}
