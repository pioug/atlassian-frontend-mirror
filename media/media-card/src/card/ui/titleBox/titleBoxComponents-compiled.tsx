/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css, cssMap } from '@compiled/react';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';
import { N0, N800 } from '@atlaskit/theme/colors';

import {
	type TitleBoxFooterProps,
	type TitleBoxHeaderProps,
	type TitleBoxWrapperProps,
} from './types';
import { rgba } from '../styles';

const smallLineHeight = 14;
const smallVerticalPadding = 4;
const smallHorizontalPadding = 8;

const largeLineHeight = 22;
const largeVerticalPadding = 8;
const largeHorizontalPadding = 12;

const responsiveStyleMap = cssMap({
	small: {
		height: `${(smallLineHeight + smallVerticalPadding) * 2}px`,
		padding: `${smallVerticalPadding}px ${smallHorizontalPadding}px`,
	},
	large: {
		height: `${(largeLineHeight + largeVerticalPadding) * 2}px`,
		padding: `${largeVerticalPadding}px ${largeHorizontalPadding}px`,
	},
});

const HEX_REGEX = /^#[0-9A-F]{6}$/i;

const titleBoxWrapperStyles = css({
	position: 'absolute',
	bottom: 0,
	width: '100%',
	backgroundColor: token('elevation.surface', 'rgba(255, 255, 255, 1)'),
	color: token('color.text', N800),
	cursor: 'inherit',
	pointerEvents: 'none',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
});

export const TitleBoxWrapper = (props: TitleBoxWrapperProps) => {
	const { breakpoint, titleBoxBgColor, hidden } = props;
	const color = titleBoxBgColor && rgba(HEX_REGEX.test(titleBoxBgColor) ? titleBoxBgColor : N0, 1);

	return (
		<div
			id="titleBoxWrapper"
			data-testid="media-title-box"
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				backgroundColor: color,
				display: hidden ? 'none' : undefined,
			}}
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={[titleBoxWrapperStyles, responsiveStyleMap[breakpoint]]}
		>
			{props.children}
		</div>
	);
};

TitleBoxWrapper.displayName = 'TitleBoxWrapper';

const infoStyles = css({
	whiteSpace: 'nowrap',
	overflow: 'hidden',
});

const iconOverlapStyle = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingRight: '10px',
});

const titleBoxHeaderStyles = css({
	fontWeight: token('font.weight.semibold'),
});

export const TitleBoxHeader = (props: TitleBoxHeaderProps) => {
	const { hasIconOverlap } = props;
	return (
		<div
			id="titleBoxHeader"
			data-testid="title-box-header"
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={[titleBoxHeaderStyles, infoStyles, hasIconOverlap && iconOverlapStyle]}
		>
			{props.children}
		</div>
	);
};

TitleBoxHeader.displayName = 'FailedTitleBoxHeader';

const titleBoxFooterStyles = css({
	textOverflow: 'ellipsis',
});

export const TitleBoxFooter = (props: TitleBoxFooterProps) => {
	const { hasIconOverlap } = props;
	return (
		<div
			id="titleBoxFooter"
			data-testid="title-box-footer"
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={[titleBoxFooterStyles, infoStyles, hasIconOverlap && iconOverlapStyle]}
		>
			{props.children}
		</div>
	);
};

TitleBoxFooter.displayName = 'TitleBoxFooter';

const titleBoxIconStyles = css({
	position: 'absolute',
	right: token('space.050', '4px'),
	bottom: '0px',
});

const newTitleBoxIconStyles = css({
	position: 'absolute',
	right: token('space.050', '4px'),
	bottom: token('space.050', '4px'),
});

export const TitleBoxIcon = (props: any) => {
	return (
		<div
			id="titleBoxIcon"
			data-testid="title-box-icon"
			css={[
				fg('platform-visual-refresh-icons') && newTitleBoxIconStyles,
				!fg('platform-visual-refresh-icons') && titleBoxIconStyles,
			]}
		>
			{props.children}
		</div>
	);
};

const errorMessageWrapperStyles = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-start',
	paddingInlineStart: token('space.025'),
	gap: token('space.025'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	span: {
		verticalAlign: 'middle',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		':nth-child(2)': {
			marginLeft: token('space.050', '4px'),
			marginRight: token('space.050', '4px'),
		},
	},
});

export const ErrorMessageWrapper = (props: any) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={errorMessageWrapperStyles}>{props.children}</div>;
};
