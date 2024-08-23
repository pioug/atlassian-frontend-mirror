/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, Fragment, type KeyboardEvent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { type IntlShape, useIntl } from 'react-intl-next';

import { Text } from '@atlaskit/primitives';

import { type LinkSearchListItemData } from '../../../../../common/types';
/* eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports */
import { transformTimeStamp } from '../../../transformTimeStamp';

import {
	composeListItemStyles,
	imgStyles,
	itemIconStyles,
	itemNameStyles,
	listItemContainerInnerStyles,
	listItemContainerStyles,
	listItemContextStyles,
} from './styled';

export const testIds = {
	searchResultItem: 'link-search-list-item',
	searchResultIcon: 'link-search-list-item-icon',
};

const isSVG = (icon: string) => icon.startsWith('<svg') && icon.endsWith('</svg>');

const base64SVG = (icon: string) =>
	`data:image/svg+xml;base64,${Buffer.from(icon).toString('base64')}`;

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
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			<span css={itemIconStyles}>
				<Glyph alt={alt} data-testid={testIds.searchResultIcon} />
			</span>
		);
	}
	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<span css={itemIconStyles}>
			<img
				data-testid={testIds.searchResultIcon}
				src={isSVG(icon) ? base64SVG(icon) : icon}
				alt={alt}
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
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
		/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */
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
	/* eslint-enable @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */
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

export interface LinkSearchListItemProps {
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
}

export const LinkSearchListItem = forwardRef<HTMLDivElement, LinkSearchListItemProps>(
	({ item, selected, id, role, onSelect, tabIndex, onKeyDown, onFocus, nameMaxLines = 1 }, ref) => {
		const intl = useIntl();
		const handleSelect = () => onSelect(item.objectId);
		const subtitleItems = item.subtitleItems || getDefaultSubtitleItems(item, intl);

		return (
			<div
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css={composeListItemStyles(selected)}
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
				{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
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
