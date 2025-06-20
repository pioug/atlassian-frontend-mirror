/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import { IconButton } from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import AddIcon from '@atlaskit/icon/core/add';
import { SideNavContent, SideNavHeader } from '@atlaskit/navigation-system/layout/side-nav';
import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import {
	ExpandableMenuItem,
	ExpandableMenuItemContent,
	ExpandableMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/expandable-menu-item';
import {
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/flyout-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import {
	MenuSection,
	MenuSectionHeading,
} from '@atlaskit/navigation-system/side-nav-items/menu-section';
import { token } from '@atlaskit/tokens';

const containerStyles = cssMap({
	root: {
		width: '320px',
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		borderRadius: token('border.radius'),
	},
});

type TDescription = 'long' | 'short' | 'none';
type TContent = 'long' | 'short';

const description: { [Key in TDescription]: string | undefined } = {
	long: 'Long description that has been designed to take up a lot of space and overflow in our examples',
	short: 'Short description',
	none: undefined,
};
const descriptionKeys: TDescription[] = ['short', 'long', 'none'];

const content: { [Key in TContent]: string } = {
	long: 'Long content that will cause its content to be truncated',
	short: 'Short content',
};
const contentKeys: TContent[] = ['short', 'long'];

export function ButtonMenuItemExample() {
	return (
		<div css={containerStyles.root}>
			<SideNavHeader>
				<Heading size="small">ButtonMenuItem</Heading>
			</SideNavHeader>
			<SideNavContent>
				<MenuSection>
					<MenuSectionHeading>Standard</MenuSectionHeading>
					<MenuList>
						{contentKeys.map((contentKey) =>
							descriptionKeys.map((descriptionKey) => {
								const testId = `button-menu-item-[content:${contentKey}]-[description:${descriptionKey}]`;
								return (
									<ButtonMenuItem
										key={testId}
										testId={testId}
										description={description[descriptionKey]}
									>
										{content[contentKey]}
									</ButtonMenuItem>
								);
							}),
						)}
					</MenuList>
				</MenuSection>
				<MenuSection>
					<MenuSectionHeading>With tooltip disabled</MenuSectionHeading>
					<MenuList>
						<ButtonMenuItem
							testId="button-menu-item-with-tooltip-disabled"
							description={description.long}
							isContentTooltipDisabled
						>
							{content.long}
						</ButtonMenuItem>
					</MenuList>
				</MenuSection>
				<MenuSection>
					<MenuSectionHeading>With action button</MenuSectionHeading>
					<MenuList>
						<ButtonMenuItem
							actions={
								<IconButton
									testId="button-menu-item-add-action-button"
									key="add"
									label="Add"
									icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
									appearance="subtle"
									spacing="compact"
								/>
							}
						>
							{content.long}
						</ButtonMenuItem>
					</MenuList>
				</MenuSection>
				<MenuSection>
					<MenuSectionHeading>With actions on hover</MenuSectionHeading>
					<MenuList>
						<ButtonMenuItem
							actionsOnHover={
								<IconButton
									testId="button-menu-item-on-hover-add-action-button"
									key="add"
									label="Add"
									icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
									appearance="subtle"
									spacing="compact"
								/>
							}
						>
							{content.long}
						</ButtonMenuItem>
					</MenuList>
				</MenuSection>
				<MenuSection>
					<MenuSectionHeading>With nested children</MenuSectionHeading>
					<MenuList>
						<ButtonMenuItem testId="menu-item-button-with-nested-children">
							<span>{content.long}</span>
						</ButtonMenuItem>
					</MenuList>
				</MenuSection>
			</SideNavContent>
		</div>
	);
}

export function LinkMenuItemExample() {
	return (
		<div css={containerStyles.root}>
			<SideNavHeader>
				<Heading size="small">LinkMenuItem</Heading>
			</SideNavHeader>
			<SideNavContent>
				<MenuSection>
					<MenuSectionHeading>Standard</MenuSectionHeading>
					<MenuList>
						{contentKeys.map((contentKey) =>
							descriptionKeys.map((descriptionKey) => {
								const testId = `link-menu-item-[content:${contentKey}]-[description:${descriptionKey}]`;
								return (
									<LinkMenuItem
										key={testId}
										href="#"
										testId={testId}
										description={description[descriptionKey]}
									>
										{content[contentKey]}
									</LinkMenuItem>
								);
							}),
						)}
					</MenuList>
				</MenuSection>
				<MenuSection>
					<MenuSectionHeading>With tooltip disabled</MenuSectionHeading>
					<MenuList>
						<LinkMenuItem
							href="#"
							testId={'link-menu-item-with-tooltip-disabled'}
							description={description.long}
							isContentTooltipDisabled
						>
							{content.long}
						</LinkMenuItem>
					</MenuList>
				</MenuSection>
			</SideNavContent>
		</div>
	);
}

export function ExpandableMenuItemExample() {
	return (
		<div css={containerStyles.root}>
			<SideNavHeader>
				<Heading size="small">ExpandableMenuItem</Heading>
			</SideNavHeader>
			<SideNavContent>
				<MenuSection>
					<MenuSectionHeading>Standard</MenuSectionHeading>
					<MenuList>
						{contentKeys.map((contentKey) => {
							const testId = `expandable-menu-item-[content:${contentKey}]`;
							return (
								<ExpandableMenuItem key={testId}>
									<ExpandableMenuItemTrigger testId={testId}>
										{content[contentKey]}
									</ExpandableMenuItemTrigger>
									<ExpandableMenuItemContent>
										<ButtonMenuItem>{content.short}</ButtonMenuItem>
										<ButtonMenuItem>{content.long}</ButtonMenuItem>
									</ExpandableMenuItemContent>
								</ExpandableMenuItem>
							);
						})}
					</MenuList>
				</MenuSection>
				<MenuSection>
					<MenuSectionHeading>With tooltip disabled</MenuSectionHeading>
					<MenuList>
						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								testId="expandable-menu-item-with-tooltip-disabled"
								isContentTooltipDisabled
							>
								{content.long}
							</ExpandableMenuItemTrigger>
							<ExpandableMenuItemContent>
								<ButtonMenuItem>{content.short}</ButtonMenuItem>
								<ButtonMenuItem>{content.long}</ButtonMenuItem>
							</ExpandableMenuItemContent>
						</ExpandableMenuItem>
					</MenuList>
				</MenuSection>
			</SideNavContent>
		</div>
	);
}

export function FlyoutMenuItemExample() {
	return (
		<div css={containerStyles.root}>
			<SideNavHeader>
				<Heading size="small">FlyoutMenuItem</Heading>
			</SideNavHeader>
			<SideNavContent>
				<MenuSection>
					<MenuSectionHeading>Standard</MenuSectionHeading>
					<MenuList>
						{contentKeys.map((contentKey) => {
							const testId = `flyout-menu-item-[content:${contentKey}]`;
							return (
								<FlyoutMenuItem key={testId}>
									<FlyoutMenuItemTrigger testId={testId}>
										{content[contentKey]}
									</FlyoutMenuItemTrigger>
									<FlyoutMenuItemContent>
										<ButtonMenuItem>{content.short}</ButtonMenuItem>
										<ButtonMenuItem>{content.long}</ButtonMenuItem>
									</FlyoutMenuItemContent>
								</FlyoutMenuItem>
							);
						})}
					</MenuList>
				</MenuSection>
				<MenuSection>
					<MenuSectionHeading>With tooltip disabled</MenuSectionHeading>
					<MenuList>
						<FlyoutMenuItem>
							<FlyoutMenuItemTrigger
								testId="flyout-menu-item-with-tooltip-disabled"
								isContentTooltipDisabled
							>
								{content.long}
							</FlyoutMenuItemTrigger>
							<FlyoutMenuItemContent>
								<ButtonMenuItem>{content.short}</ButtonMenuItem>
								<ButtonMenuItem>{content.long}</ButtonMenuItem>
							</FlyoutMenuItemContent>
						</FlyoutMenuItem>
					</MenuList>
				</MenuSection>
			</SideNavContent>
		</div>
	);
}

const standaloneStyles = cssMap({
	root: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.200'),
	},
});

export default function Standalone() {
	return (
		<div css={standaloneStyles.root}>
			<ButtonMenuItemExample />
			<LinkMenuItemExample />
			<ExpandableMenuItemExample />
			<FlyoutMenuItemExample />
		</div>
	);
}
