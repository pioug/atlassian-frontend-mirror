/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import React, { type ReactNode, type MouseEvent, forwardRef } from 'react';
import ArrowLeft from '@atlaskit/icon/core/migration/arrow-left';
import ArrowRight from '@atlaskit/icon/core/migration/arrow-right';
import { MediaFilmStripListItemSelector } from '.';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { N20, N40, B400, B50 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const filmStripViewStyles = css({
	position: 'relative',
	padding: `${token('space.025', '3px')} 0`,
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('border.radius.100', '3px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&:hover .arrow': {
		opacity: 1,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.ellipsed-text': {
		whiteSpace: 'initial',
	},
});

const filmStripListWrapperStyles = css({
	width: 'inherit',
	overflow: 'hidden',
	padding: `${token('space.025', '2px')} ${token('space.025', '3px')}`,
});

const filmStripListStyles = css({
	margin: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- !important is used here to override padding coming from renderer RendererStyleContainer.tsx.
	padding: '0 !important',
	transitionProperty: 'transform',
	transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)',
	whiteSpace: 'nowrap',
	display: 'inline-block',
});

const filmStripListItemStyles = css({
	listStyleType: 'none',
	margin: 0,
	padding: `0 ${token('space.050', '4px')}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':first-of-type': {
		paddingLeft: 0,
	},
	display: 'inline-block',
	verticalAlign: 'middle',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	fontSize: 0,
});

const arrowWrapperStyles = css({
	position: 'absolute',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	top: '50%',
	transform: 'translateY(-50%)',
	backgroundColor: token('elevation.surface.overlay', N20),
	borderRadius: '100%',
	display: 'flex',
	cursor: 'pointer',
	transition: 'opacity 0.3s',
	boxShadow: token('elevation.shadow.overlay', '0 1px 6px 0 rgba(0, 0, 0, 0.6)'),
	color: token('color.icon', 'black'),
	width: '30px',
	height: '30px',
	justifyContent: 'center',
	opacity: 0,
	'&:hover': {
		color: token('color.text.subtle', 'black'),
		backgroundColor: token('elevation.surface.overlay.hovered', N40),
	},
	'&:active': {
		color: token('color.text.selected', B400),
		backgroundColor: token('color.background.selected', B50),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	svg: {
		height: '30px',
		width: '20px',
	},
});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const arrowLeftWrapperStyles = css(arrowWrapperStyles, {
	left: token('space.100', '8px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	svg: {
		paddingRight: token('space.025', '2px'),
	},
});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const arrowRightWrapperStyles = css(arrowWrapperStyles, {
	right: token('space.100', '8px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	svg: {
		paddingLeft: token('space.025', '2px'),
	},
});

const shadowStyles = css({
	position: 'absolute',
	zIndex: 10,
	height: '100%',
	top: 0,
	width: '2px',
	backgroundColor: token('color.border', 'rgba(0, 0, 0, 0.2)'),
});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const shadowLeftStyles = css(shadowStyles, {
	left: 0,
});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const shadowRightStyles = css(shadowStyles, {
	right: 0,
});

const ShadowLeft = ({ children }: { children: ReactNode }) => (
	<div css={shadowLeftStyles}>{children}</div>
);

type OnClick = {
	onClick: (event: MouseEvent<HTMLDivElement>) => void;
};

export const ArrowLeftWrapper = ({
	children,
	onClick,
}: {
	children: ReactNode;
} & OnClick) => (
	// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable, @atlaskit/ui-styling-standard/no-classname-prop,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions -- Ignored via go/DSP-18766
	<div css={arrowLeftWrapperStyles} className="arrow" onClick={onClick}>
		{children}
	</div>
);

export const ShadowRight = ({ children }: { children: ReactNode }) => (
	<div css={shadowRightStyles}>{children}</div>
);

export const ArrowRightWrapper = ({
	children,
	onClick,
}: {
	children: ReactNode;
} & OnClick) => (
	// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable, @atlaskit/ui-styling-standard/no-classname-prop,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions -- Ignored via go/DSP-18766
	<div css={arrowRightWrapperStyles} className="arrow" onClick={onClick}>
		{children}
	</div>
);

export const LeftArrow: React.FC<OnClick> = ({ onClick }: OnClick) => (
	<ShadowLeft>
		<ArrowLeftWrapper onClick={onClick}>
			<ArrowLeft color="currentColor" spacing="spacious" label="left" />
		</ArrowLeftWrapper>
	</ShadowLeft>
);

export const RightArrow: React.FC<OnClick> = ({ onClick }: OnClick) => (
	<ShadowRight>
		<ArrowRightWrapper onClick={onClick}>
			<ArrowRight color="currentColor" spacing="spacious" label="right" />
		</ArrowRightWrapper>
	</ShadowRight>
);
export const FilmStripViewWrapper = ({
	children,
	'data-testid': dataTestId,
}: {
	children: ReactNode;
	'data-testid': string | undefined;
}) => (
	<div css={filmStripViewStyles} data-testid={dataTestId}>
		{children}
	</div>
);

export type FilmStripListWrapperProps = {
	children: ReactNode;
	onWheel: (event: React.WheelEvent<HTMLDivElement>) => void;
	onTouchStart: (event: React.TouchEvent<Element>) => void;
	onTouchMove: (event: React.TouchEvent<Element>) => void;
	onTouchEnd: (event: React.TouchEvent<Element>) => void;
	'data-testid': string | undefined;
};
export const FilmStripListWrapper = forwardRef<HTMLDivElement, FilmStripListWrapperProps>(
	(
		{ children, onWheel, onTouchStart, onTouchMove, onTouchEnd, 'data-testid': dataTestId },
		ref,
	) => (
		<div
			css={filmStripListWrapperStyles}
			ref={ref}
			onWheel={onWheel}
			onTouchStart={onTouchStart}
			onTouchMove={onTouchMove}
			onTouchEnd={onTouchEnd}
			data-testid={dataTestId}
		>
			{children}
		</div>
	),
);

export type FilmStripListProps = {
	children: ReactNode;
	style: {
		transform: string;
		transitionProperty: string;
		transitionDuration: string;
	};
};

export const FilmStripList = React.forwardRef<HTMLUListElement, FilmStripListProps>(
	({ children, style }, ref) => (
		<ul
			css={[filmStripListStyles]}
			ref={ref as React.RefObject<HTMLUListElement>}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={style}
		>
			{children}
		</ul>
	),
);

export const FilmStripListItem = ({
	children,
	index,
}: {
	children: ReactNode;
	index: React.Key;
}) => (
	<li
		css={filmStripListItemStyles}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={MediaFilmStripListItemSelector}
		data-testid="media-filmstrip-list-item"
		key={index}
	>
		{children}
	</li>
);
