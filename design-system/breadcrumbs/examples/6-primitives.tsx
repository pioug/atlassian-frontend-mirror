/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Primitives API example.
 *
 * The simple case: use `<Breadcrumbs>` (the composed component) — automatic
 * overflow collapse, aria-current, size variant, all handled for you.
 *
 * The custom case: use `BreadcrumbsRoot` + `BreadcrumbsItemPrimitive` +
 * `useOverflowCollapse` when you need full control — e.g. custom collapse UI,
 * conditional items, or React Compiler compatibility (no cloneElement).
 */
import { css, jsx } from '@compiled/react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { BreadcrumbsCurrentItem } from '@atlaskit/breadcrumbs/breadcrumbs-current-item';
import { BreadcrumbsItemPrimitive, BreadcrumbsRoot } from '@atlaskit/breadcrumbs/primitives';
import { useOverflowCollapse } from '@atlaskit/breadcrumbs/use-overflow-collapse';
import Button, { IconButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import AddIcon from '@atlaskit/icon/core/add';
import ImageIcon from '@atlaskit/icon/core/image';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import { Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

type BreadcrumbsExampleSize = 'medium' | 'small';

const LONG_HOME_TEXT = 'Home item with a very long name that should truncate';
const HOME_TRUNCATION_WIDTH = 140;

// ─── Simple case: composed <Breadcrumbs> ─────────────────────────────────────
// Use this for the vast majority of cases. Automatic overflow collapse,
// aria-current on the last item, and size variant all handled for you.

function SimpleCase({
	size = 'medium',
	label = 'Breadcrumbs',
}: {
	size?: BreadcrumbsExampleSize;
	label?: string;
}): JSX.Element {
	return (
		<Breadcrumbs label={label} size={size}>
			<BreadcrumbsItem href="/pages" text="Pages" />
			<BreadcrumbsItem
				href="/pages/home"
				text={LONG_HOME_TEXT}
				truncationWidth={HOME_TRUNCATION_WIDTH}
			/>
			<BreadcrumbsItem
				href="/pages/home/project"
				text="Project"
				elemBefore={<ImageIcon label="" size="medium" />}
			/>
			<BreadcrumbsItem
				href="/pages/home/project/sub"
				text="Sub-project"
				elemBefore={<ImageIcon label="" size="medium" />}
			/>
			<BreadcrumbsCurrentItem href="/pages/home/project/sub/item" text="Current page" />
		</Breadcrumbs>
	);
}

// ─── Custom case: primitives + useOverflowCollapse ───────────────────────────
// Use this when you need full control: custom collapse UI, conditional items,
// non-standard wrappers, or when React Compiler compatibility is required.
// Consumer owns the render loop — no cloneElement, no internal prop injection.

const items = [
	{ text: 'Pages', href: '/pages' },
	{
		text: LONG_HOME_TEXT,
		href: '/pages/home',
		truncationWidth: HOME_TRUNCATION_WIDTH,
	},
	{
		text: 'Project',
		href: '/pages/home/project',
		elemBefore: <ImageIcon label="" size="medium" />,
	},
	{
		text: 'Sub-project',
		href: '/pages/home/project/sub',
		elemBefore: <ImageIcon label="" size="medium" />,
	},
	{ text: 'Final item', href: '/pages/home/project/sub/item' },
];

const customItemStyles = css({
	display: 'flex',
	boxSizing: 'border-box',
	maxWidth: '100%',
	alignItems: 'center',
	flexDirection: 'row',
	flexShrink: 0,
	alignSelf: 'center',
	fontFamily: token('font.family.body'),
	marginBlockEnd: token('space.0'),
	marginBlockStart: token('space.0'),
	marginInlineEnd: token('space.0'),
	marginInlineStart: token('space.0'),
	paddingBlockEnd: token('space.0'),
	paddingBlockStart: token('space.0'),
	paddingInlineEnd: token('space.0'),
	paddingInlineStart: token('space.0'),
});

const hiddenStyles = css({
	display: 'none',
});

const customSeparatorStyles = css({
	width: '8px',
	flexShrink: 0,
	alignSelf: 'baseline',
	color: token('color.text.subtlest'),
	fontFamily: token('font.family.body'),
	paddingBlock: token('space.025'),
	paddingInline: token('space.100'),
	textAlign: 'center',
});

function CustomSeparator(): JSX.Element {
	return (
		<span aria-hidden="true" css={customSeparatorStyles}>
			/
		</span>
	);
}

function CustomEllipsis({ collapsedItems }: { collapsedItems: typeof items }): JSX.Element {
	return (
		<li css={customItemStyles}>
			<DropdownMenu<HTMLButtonElement>
				trigger={({ triggerRef, isSelected, ...triggerProps }) => (
					<IconButton
						ref={triggerRef}
						{...triggerProps}
						icon={MoreIcon}
						label="Show more breadcrumbs"
						isSelected={isSelected}
						appearance="subtle"
						spacing="compact"
						isTooltipDisabled
					/>
				)}
			>
				<DropdownItemGroup>
					{collapsedItems.map((item) => (
						<DropdownItem key={item.href} href={item.href}>
							{item.text}
						</DropdownItem>
					))}
				</DropdownItemGroup>
			</DropdownMenu>
			<CustomSeparator />
		</li>
	);
}

function CustomCase({
	size = 'medium',
	label = 'Custom breadcrumbs',
}: {
	size?: BreadcrumbsExampleSize;
	label?: string;
}): JSX.Element {
	const { collapsedIndices, registerItem, registerContainer, naturalWidthsReady } =
		useOverflowCollapse(items.length);

	const collapsedIndexes = Array.from(collapsedIndices).sort((a, b) => a - b);
	const collapsedItems = items.filter((_, i) => collapsedIndices.has(i));
	const firstCollapsedIndex = collapsedIndexes[0];

	return (
		<BreadcrumbsRoot ref={registerContainer} label={label} size={size}>
			{items.map((item, i) => {
				const isCollapsed = naturalWidthsReady && collapsedIndices.has(i);
				if (isCollapsed) {
					return i === firstCollapsedIndex ? (
						<CustomEllipsis key="ellipsis" collapsedItems={collapsedItems} />
					) : null;
				}

				return (
					<BreadcrumbsItemPrimitive
						key={item.href}
						ref={registerItem(i)}
						href={item.href}
						text={item.text}
						elemBefore={item.elemBefore}
						truncationWidth={item.truncationWidth}
						aria-current={i === items.length - 1 ? 'page' : undefined}
					/>
				);
			})}
		</BreadcrumbsRoot>
	);
}

// ─── Custom case: mixed children (Jira-style) ────────────────────────────────
// BreadcrumbsRoot accepts any children — mix BreadcrumbsItemPrimitive with
// custom elements like buttons. useOverflowCollapse still measures and collapses
// correctly as long as each item's <li> ref is registered.

const jiraItems = [
	{ text: 'Projects', href: '/projects' },
	{ text: 'CAT', href: '/projects/cat' },
];

function JiraStyleCase(): JSX.Element {
	const allCount = jiraItems.length + 1; // items + 1 custom button item
	const { collapsedIndices, registerItem, registerContainer, naturalWidthsReady } =
		useOverflowCollapse(allCount);

	return (
		<BreadcrumbsRoot ref={registerContainer} label="Jira breadcrumbs">
			{/* Custom button item — ADS Button with iconBefore and subtle appearance */}
			<li
				ref={registerItem(0)}
				css={[customItemStyles, naturalWidthsReady && collapsedIndices.has(0) && hiddenStyles]}
			>
				<Button appearance="subtle" iconBefore={AddIcon}>
					Add
				</Button>
				<CustomSeparator />
			</li>

			{/* Standard breadcrumb items */}
			{jiraItems.map((item, i) => {
				const index = i + 1;
				const isCollapsed = naturalWidthsReady && collapsedIndices.has(index);

				if (isCollapsed) {
					return null;
				}

				return (
					<BreadcrumbsItemPrimitive
						key={item.href}
						ref={registerItem(index)}
						href={item.href}
						text={item.text}
						aria-current={index === allCount - 1 ? 'page' : undefined}
					/>
				);
			})}
		</BreadcrumbsRoot>
	);
}

// ─── Root export ─────────────────────────────────────────────────────────────

export default function PrimitivesExample(): JSX.Element {
	return (
		<Stack space="space.400">
			<Stack space="space.050">
				<Text weight="bold">Simple case — composed {'<Breadcrumbs>'}</Text>
				<Text size="small" color="color.text.subtlest">
					Automatic overflow collapse (requires platform_dst_breadcrumbs-refresh flag),
					aria-current, size variant. Use this for most cases.
				</Text>
				<Stack space="space.100">
					<Text size="small" color="color.text.subtlest">
						Default
					</Text>
					<SimpleCase label="Breadcrumbs default" />
					<Text size="small" color="color.text.subtlest">
						Small
					</Text>
					<SimpleCase size="small" label="Breadcrumbs small" />
				</Stack>
			</Stack>

			<Stack space="space.050">
				<Text weight="bold">Custom case — primitives + useOverflowCollapse</Text>
				<Text size="small" color="color.text.subtlest">
					Consumer controls the render loop. Resize the window to show collapse behaviour.
				</Text>
				<Stack space="space.100">
					<Text size="small" color="color.text.subtlest">
						Default
					</Text>
					<CustomCase label="Custom breadcrumbs default" />
					<Text size="small" color="color.text.subtlest">
						Small
					</Text>
					<CustomCase size="small" label="Custom breadcrumbs small" />
				</Stack>
			</Stack>

			<Stack space="space.050">
				<Text weight="bold">Mixed children — custom button + standard items (Jira-style)</Text>
				<Text size="small" color="color.text.subtlest">
					Mix any element with BreadcrumbsItemPrimitive. Resize the window to show collapse
					behaviour.
				</Text>
				<JiraStyleCase />
			</Stack>
		</Stack>
	);
}
