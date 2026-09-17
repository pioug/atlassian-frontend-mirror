/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useCallback, useId, useState } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import BoardIcon from '@atlaskit/icon/core/board';
import SearchIcon from '@atlaskit/icon/core/search';
import { Box } from '@atlaskit/primitives/compiled';
import {
	FlyoutBody,
	FlyoutFooter,
	FlyoutHeader,
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/side-nav-items/flyout-menu-item';
import { LinkMenuItem } from '@atlaskit/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/side-nav-items/menu-list';
import { MenuSection, MenuSectionHeading } from '@atlaskit/side-nav-items/menu-section';
import Textfield from '@atlaskit/textfield/text-field';
import { token } from '@atlaskit/tokens';

const contentContainerStyles = cssMap({
	root: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
});

function LoadingPlaceholder({ titleId }: { titleId: string }) {
	return (
		<div css={contentContainerStyles.root}>
			<Heading size="xsmall" as="h2" id={titleId}>
				Recent
			</Heading>
			Loading...
		</div>
	);
}

function SearchField({
	value,
	onChange,
}: Pick<React.ComponentProps<typeof Textfield>, 'value' | 'onChange'>) {
	return (
		<Textfield
			isCompact
			aria-label="Search recent items"
			value={value}
			onChange={onChange}
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
	);
}

function LoadedItems() {
	return (
		<React.Fragment>
			<FlyoutBody>
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
			</FlyoutBody>
			<FlyoutFooter>
				<MenuList>
					<LinkMenuItem href="#" elemBefore={<AlignTextLeftIcon label="" />}>
						View all recent items
					</LinkMenuItem>
				</MenuList>
			</FlyoutFooter>
		</React.Fragment>
	);
}

function FlyoutContents({
	isLoaded,
	titleId,
	autoFocusCloseButton,
	showSearchWhileLoading,
}: {
	autoFocusCloseButton: boolean;
	isLoaded: boolean;
	showSearchWhileLoading: boolean;
	titleId: string;
}) {
	const [query, setQuery] = useState('');
	const handleSearch = useCallback((event: React.FormEvent<HTMLInputElement>) => {
		setQuery(event.currentTarget.value);
	}, []);
	const search = <SearchField value={query} onChange={handleSearch} />;

	return (
		<React.Fragment>
			{isLoaded ? (
				<FlyoutHeader
					title="Recent"
					closeButtonLabel="Close menu"
					autoFocusCloseButton={autoFocusCloseButton}
				>
					{!showSearchWhileLoading && search}
				</FlyoutHeader>
			) : (
				<LoadingPlaceholder titleId={titleId} />
			)}
			{showSearchWhileLoading && <div css={contentContainerStyles.root}>{search}</div>}
			{isLoaded && <LoadedItems />}
		</React.Fragment>
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

export default function FlyoutMenuItemLazyLoadedContentFocusExample(): JSX.Element {
	const titleId = useId();
	// Integration tests can exercise popup defaults and a control that survives header loading.
	const params = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
	const autoFocusCloseButton = params.get('autoFocusCloseButton') !== 'false';
	const showSearchWhileLoading = params.get('showSearchWhileLoading') === 'true';
	const [isOpen, setIsOpen] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	const handleOpenPopup = useCallback(() => {
		setIsOpen((val) => !val);
		setTimeout(() => setIsLoaded(true), 1000);
	}, []);

	const handleClosePopup = useCallback(() => {
		setIsOpen(false);
	}, []);

	return (
		<div css={exampleContainerStyles.root}>
			<MenuList>
				<FlyoutMenuItem isOpen={isOpen}>
					<FlyoutMenuItemTrigger onClick={handleOpenPopup}>Toggle flyout</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent onClose={handleClosePopup} titleId={titleId}>
						<FlyoutContents
							isLoaded={isLoaded}
							titleId={titleId}
							autoFocusCloseButton={autoFocusCloseButton}
							showSearchWhileLoading={showSearchWhileLoading}
						/>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>
			</MenuList>
		</div>
	);
}
