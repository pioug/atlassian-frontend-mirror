/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, Fragment, type KeyboardEvent } from 'react';

import { css, jsx } from '@compiled/react';
import { type IntlShape, useIntl } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';
import { Text } from '@atlaskit/primitives/compiled';
import { B100, B400, B50, N20, N200, N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { type LinkSearchListItemData } from '../../../../../common/types';
/* eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports */
import { transformTimeStamp } from '../../../transformTimeStamp';

import { LinkSearchListItemOld } from './old';

export const testIds = {
	searchResultItem: 'link-search-list-item',
	searchResultIcon: 'link-search-list-item-icon',
};

const isSVG = (icon: string) => icon.startsWith('<svg') && icon.endsWith('</svg>');

const base64SVG = (icon: string) =>
	`data:image/svg+xml;base64,${Buffer.from(icon).toString('base64')}`;

const itemIconStyles = css({
	minWidth: token('space.200', '16px'),
	marginTop: token('space.050', '4px'),
	marginRight: token('space.150', '12px'),
});

const listItemContextStyles = css({
	color: token('color.text', N300),
	font: token('font.body.small'),
	display: 'flex',
});

const listItemContainerStyles = css({
	overflow: 'hidden',
	textOverflow: 'ellipsis',
});

const listItemContainerInnerStyles = css({
	color: token('color.text.subtlest', N200),
	whiteSpace: 'nowrap',
});

const itemNameStyles = css({
	overflow: 'hidden',
	alignContent: 'center',
	width: '100%',
});

const imgStyles = css({
	maxWidth: token('space.200', '16px'),
});

const listItemBaseStyles = css({
	display: 'flex',
	paddingTop: token('space.100', '8px'),
	paddingBottom: token('space.100', '8px'),
	paddingLeft: `clamp( ${token('space.100', '8px')}, var(--link-picker-padding-left), 100% )`,
	paddingRight: `clamp( ${token('space.100', '8px')}, var(--link-picker-padding-right), 100% )`,
	margin: 0,
	cursor: 'pointer',
});

const ListItemIcon = (props: { item: LinkSearchListItemData; intl: IntlShape }) => {
	const { item, intl } = props;
	const { icon, iconAlt } = item;
	if (!icon) {
		return null;
	}

	const alt = typeof iconAlt === 'string' ? iconAlt : intl.formatMessage(iconAlt);

	if (typeof icon !== 'string') {
		const Glyph = icon;

		return (
			<span css={itemIconStyles}>
				<Glyph alt={alt} data-testid={testIds.searchResultIcon} />
			</span>
		);
	}
	return (
		<span css={itemIconStyles}>
			<img
				data-testid={testIds.searchResultIcon}
				src={isSVG(icon) ? base64SVG(icon) : icon}
				alt={alt}
				css={imgStyles}
			/>
		</span>
	);
};

type SubtitleProps = {
	items: NonNullable<LinkSearchListItemData['subtitleItems']>;
};

const ListItemSubtitle = ({ items: [firstItem, secondItem] }: SubtitleProps) => {
	return (
		<div data-testid={`${testIds.searchResultItem}-subtitle`} css={listItemContextStyles}>
			<div css={listItemContainerStyles}>
				<span css={listItemContainerInnerStyles}>{firstItem}</span>
			</div>
			{secondItem && (
				<div css={listItemContainerInnerStyles}>
					<Fragment>&nbsp; •&nbsp; </Fragment>
					<Fragment>{secondItem}</Fragment>
				</div>
			)}
		</div>
	);
};

const getDefaultSubtitleItems = (
	item: LinkSearchListItemData,
	intl: IntlShape,
): LinkSearchListItemData['subtitleItems'] => {
	const container = item.container;
	const date = transformTimeStamp(intl, item.lastViewedDate, item.lastUpdatedDate);

	if (container) {
		if (date) {
			return [container, date];
		}
		return [container];
	}

	if (date) {
		return [date];
	}

	return undefined;
};

export type LinkSearchListItemProps = {
	item: LinkSearchListItemData;
	selected: boolean;
	active: boolean;
	tabIndex?: number;
	onSelect: (objectId: string) => void;
	onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
	onFocus: () => void;
	id?: string;
	role?: string;
	nameMaxLines?: number;
};

const listItemActive = css({
	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered', N20),
		boxShadow: `inset 2px 0px 0px ${token('color.border.selected', B400)}`,
	},
});

const listItemSelected = css({
	backgroundColor: token('color.background.selected', B50),
	boxShadow: `inset 2px 0px 0px ${token('color.border.selected', B400)}`,
});

const listItemFocusStyles = css({
	'&:focus': {
		outline: 'none',
		boxShadow: `0 0 0 2px ${token('color.border.focused', B100)} inset`,
		textDecoration: 'none',
	},
});

export const LinkSearchListItemNew = forwardRef<HTMLDivElement, LinkSearchListItemProps>(
	(
		{
			item,
			selected,
			id,
			role,
			onSelect,
			tabIndex,
			onKeyDown,
			onFocus,
			nameMaxLines = 1,
		}: LinkSearchListItemProps,
		ref,
	): JSX.Element => {
		const intl = useIntl();
		const handleSelect = () => onSelect(item.objectId);
		const subtitleItems = item.subtitleItems || getDefaultSubtitleItems(item, intl);

		return (
			// eslint-disable-next-line jsx-a11y/no-static-element-interactions
			<div
				css={[
					listItemBaseStyles,
					!selected && listItemActive,
					selected && listItemSelected,
					listItemFocusStyles,
				]}
				role={role}
				id={id}
				aria-selected={selected}
				data-testid={testIds.searchResultItem}
				onKeyDown={onKeyDown}
				onClick={handleSelect}
				onFocus={onFocus}
				tabIndex={tabIndex}
				ref={ref}
			>
				<ListItemIcon item={item} intl={intl} />
				<div css={itemNameStyles}>
					<Text maxLines={nameMaxLines}>
						<span data-testid={`${testIds.searchResultItem}-title`} title={item.name}>
							{item.name}
						</span>
					</Text>
					{subtitleItems && <ListItemSubtitle items={subtitleItems} />}
				</div>
			</div>
		);
	},
);

export const LinkSearchListItem = forwardRef<HTMLDivElement, LinkSearchListItemProps>(
	(props: LinkSearchListItemProps, ref) => {
		if (fg('platform_bandicoots-link-picker-css')) {
			return <LinkSearchListItemNew {...props} ref={ref} />;
		}
		return <LinkSearchListItemOld {...props} ref={ref} />;
	},
);
