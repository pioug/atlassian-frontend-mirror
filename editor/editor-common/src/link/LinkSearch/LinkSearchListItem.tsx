/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { N20, N300, N800 } from '@atlaskit/theme/colors';
import { fontSizeSmall } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { getCorrectAltByIconUrl } from './listItemAlts';
import { transformTimeStamp } from './transformTimeStamp';
import type { LinkSearchListItemData } from './types';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const container = css({
	backgroundColor: 'transparent',
	padding: `${token('space.100', '8px')} ${token('space.150', '12px')}`,
	cursor: 'pointer',
	display: 'flex',
	marginTop: 0,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const containerSelected = css({
	backgroundColor: token('color.background.neutral.subtle.hovered', N20),
});

const nameWrapper = css({
	overflow: 'hidden',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const nameStyle = css({
	color: token('color.text', N800),
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	lineHeight: '20px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const containerName = css({
	color: token('color.text.subtlest', N300),
	lineHeight: '14px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	fontSize: relativeFontSizeToBase16(fontSizeSmall()),
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
	item: LinkSearchListItemData;
	selected: boolean;
	onSelect: (href: string, text: string) => void;
	onMouseMove?: (objectId: string) => void;
	onMouseEnter?: (objectId: string) => void;
	onMouseLeave?: (objectId: string) => void;
	id?: string;
	role?: string;
}

class LinkSearchListItem extends React.PureComponent<Props & WrappedComponentProps, {}> {
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
