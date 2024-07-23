/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, Fragment, type KeyboardEvent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { type IntlShape, useIntl } from 'react-intl-next';

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
	listItemNameStyles,
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
}

export const LinkSearchListItem = forwardRef<HTMLDivElement, LinkSearchListItemProps>(
	({ item, selected, id, role, onSelect, tabIndex, onKeyDown, onFocus }, ref) => {
		const intl = useIntl();
		const handleSelect = () => onSelect(item.objectId);
		const container = item.container || null;
		const date = transformTimeStamp(intl, item.lastViewedDate, item.lastUpdatedDate);

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
					<div
						data-testid={`${testIds.searchResultItem}-title`}
						// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						css={listItemNameStyles}
						title={item.name}
					>
						{item.name}
					</div>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
					<div data-testid={`${testIds.searchResultItem}-subtitle`} css={listItemContextStyles}>
						{container && (
							// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
							<div css={listItemContainerStyles}>
								{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
								<span css={listItemContainerInnerStyles}>{container}</span>
							</div>
						)}
						{date && (
							// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
							<div css={listItemContainerInnerStyles}>
								{container && <Fragment>&nbsp; •&nbsp; </Fragment>}
								<Fragment>{date}</Fragment>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	},
);
