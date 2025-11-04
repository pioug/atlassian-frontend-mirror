/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, Fragment, useCallback, type KeyboardEvent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, type SerializedStyles } from '@emotion/react';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

import { getCorrectAltByIconUrl } from './listItemAlts';
import { transformTimeStamp } from './transformTimeStamp';
import type { LinkSearchListItemData } from './types';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const container: SerializedStyles = css({
	backgroundColor: 'transparent',
	padding: `${token('space.100', '8px')} ${token('space.150', '12px')}`,
	cursor: 'pointer',
	display: 'flex',
	marginTop: 0,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const containerSelected: SerializedStyles = css({
	backgroundColor: token('color.background.neutral.subtle.hovered'),
});

const nameWrapper = css({
	overflow: 'hidden',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const nameStyle: SerializedStyles = css({
	color: token('color.text'),
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '20px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const containerName: SerializedStyles = css({
	color: token('color.text.subtlest'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '14px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	fontSize: relativeFontSizeToBase16(11),
});

const iconStyle = css({
	minWidth: '16px',
	marginTop: token('space.050', '4px'),
	marginRight: token('space.150', '12px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	img: {
		maxWidth: '16px',
	},
});

export interface Props {
	id?: string;
	item: LinkSearchListItemData;
	onFocus?: () => void;
	onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
	onMouseEnter?: (objectId: string) => void;
	onMouseLeave?: (objectId: string) => void;
	onMouseMove?: (objectId: string) => void;
	onSelect: (href: string, text: string) => void;
	role?: string;
	selected: boolean;
}

const LinkSearchListItem = (
	props: Props & WrappedComponentProps,
	ref: React.Ref<HTMLDivElement>,
) => {
	const {
		id,
		item,
		onFocus,
		onKeyDown,
		onMouseEnter,
		onMouseLeave,
		onMouseMove,
		onSelect,
		selected,
		intl,
	} = props;
	const handleSelect = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault(); // don't let editor lose focus
			onSelect(item.url, item.name);
		},
		[onSelect, item.url, item.name],
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			if (event.key === 'Enter') {
				onSelect(item.url, item.name);
			}
			onKeyDown?.(event);
		},
		[onSelect, onKeyDown, item.url, item.name],
	);

	const handleMouseMove = useCallback(() => {
		onMouseMove?.(item.objectId);
	}, [onMouseMove, item.objectId]);

	const handleMouseEnter = useCallback(() => {
		onMouseEnter?.(item.objectId);
	}, [onMouseEnter, item.objectId]);

	const handleMouseLeave = useCallback(() => {
		onMouseLeave?.(item.objectId);
	}, [onMouseLeave, item.objectId]);

	const renderIcon = () => {
		if (item.icon) {
			return <span css={iconStyle}>{item.icon}</span>;
		}
		if (item.iconUrl) {
			return (
				<span css={iconStyle}>
					{/*
            - getCorrectAltByIconUrl
            Workaround to get alt text for images from url
            Can be removed when alt={iconAlt} will be available from GraphQL
            More details: https://a11y-internal.atlassian.net/browse/AK-811
          */}

					<img src={item.iconUrl} alt={getCorrectAltByIconUrl(item.iconUrl, intl)} />
				</span>
			);
		}
		return null;
	};

	const renderTimeStamp = () => {
		const date = transformTimeStamp(intl, item.lastViewedDate, item.lastUpdatedDate);
		return (
			date && (
				<Fragment>
					&nbsp; •
					<span
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className="link-search-timestamp"
						data-testid="link-search-timestamp"
					>
						&nbsp; {date.pageAction} {date.dateString} {date.timeSince || ''}
					</span>
				</Fragment>
			)
		);
	};

	return (
		<div
			ref={ref}
			css={[container, selected && containerSelected]}
			role={'option'}
			tabIndex={0}
			id={id}
			aria-selected={selected}
			data-testid="link-search-list-item"
			onFocus={onFocus}
			onKeyDown={handleKeyDown}
			onMouseMove={handleMouseMove}
			onMouseEnter={handleMouseEnter}
			// eslint-disable-next-line @atlassian/a11y/mouse-events-have-key-events
			onMouseLeave={handleMouseLeave}
			onClick={handleSelect}
		>
			{renderIcon()}
			<span css={nameWrapper}>
				<div css={nameStyle}>{item.name}</div>
				<div data-testid="link-search-list-item-container" css={containerName}>
					{item.container}
					{renderTimeStamp()}
				</div>
			</span>
		</div>
	);
};

const ForwardedLinkSearchListItem = forwardRef<HTMLDivElement, Props & WrappedComponentProps>(
	LinkSearchListItem,
);

export const ForwardedLinkSearchListItemWithIntl = injectIntl(ForwardedLinkSearchListItem, {
	forwardRef: true,
});

export default ForwardedLinkSearchListItemWithIntl;
