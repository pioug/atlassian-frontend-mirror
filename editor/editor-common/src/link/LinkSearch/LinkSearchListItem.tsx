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

export interface PropsNext {
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

const LinkSearchListItemNext = (
	props: PropsNext & WrappedComponentProps,
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

const ForwardedLinkSearchListItemNext = forwardRef<
	HTMLDivElement,
	PropsNext & WrappedComponentProps
>(LinkSearchListItemNext);

export const ForwardedLinkSearchListItemNextWithIntl = injectIntl(ForwardedLinkSearchListItemNext, {
	forwardRef: true,
});

export interface Props {
	id?: string;
	item: LinkSearchListItemData;
	onMouseEnter?: (objectId: string) => void;
	onMouseLeave?: (objectId: string) => void;
	onMouseMove?: (objectId: string) => void;
	onSelect: (href: string, text: string) => void;
	role?: string;
	selected: boolean;
}

/**
 * *Warning:* With `platform_editor_a11y_insert_link_item_focus` enabled this component is no longer used and is replaced with `<LinkSearchListItemNext />`.
 *
 * If making changes to this component please ensure to also update `<LinkSearchListItemNext />`.
 */
// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
class LinkSearchListItem extends React.PureComponent<Props & WrappedComponentProps, Object> {
	handleSelect = (e: React.MouseEvent) => {
		e.preventDefault(); // don't let editor lose focus
		const { item, onSelect } = this.props;
		onSelect(item.url, item.name);
	};

	handleMouseMove = () => {
		const { onMouseMove, item } = this.props;
		onMouseMove && onMouseMove(item.objectId);
	};

	handleMouseEnter = () => {
		const { onMouseEnter, item } = this.props;
		onMouseEnter && onMouseEnter(item.objectId);
	};

	handleMouseLeave = () => {
		const { onMouseLeave, item } = this.props;
		onMouseLeave && onMouseLeave(item.objectId);
	};

	private renderIcon() {
		const {
			item: { icon, iconUrl },
			intl,
		} = this.props;
		if (icon) {
			return <span css={iconStyle}>{icon}</span>;
		}
		if (iconUrl) {
			return (
				<span css={iconStyle}>
					{/*
            - getCorrectAltByIconUrl
            Workaround to get alt text for images from url
            Can be removed when alt={iconAlt} will be available from GraphQL
            More details: https://a11y-internal.atlassian.net/browse/AK-811
          */}
					<img src={iconUrl} alt={getCorrectAltByIconUrl(iconUrl, intl)} />
				</span>
			);
		}
		return null;
	}

	renderTimeStamp() {
		const { item, intl } = this.props;
		const date = transformTimeStamp(intl, item.lastViewedDate, item.lastUpdatedDate);

		return (
			date && (
				<Fragment>
					&nbsp; •
					<span
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className="link-search-timestamp"
						data-test-id="link-search-timestamp"
					>
						&nbsp; {date.pageAction} {date.dateString} {date.timeSince || ''}
					</span>
				</Fragment>
			)
		);
	}

	render() {
		const { item, selected, id, role } = this.props;
		return (
			// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
			<li
				css={[container, selected && containerSelected]}
				role={role}
				id={id}
				aria-selected={selected}
				data-testid="link-search-list-item"
				onMouseMove={this.handleMouseMove}
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}
				onClick={this.handleSelect}
			>
				{this.renderIcon()}
				<span css={nameWrapper}>
					<div css={nameStyle}>{item.name}</div>
					<div data-testid="link-search-list-item-container" css={containerName}>
						{item.container}
						{this.renderTimeStamp()}
					</div>
				</span>
			</li>
		);
	}
}

export default injectIntl(LinkSearchListItem);
