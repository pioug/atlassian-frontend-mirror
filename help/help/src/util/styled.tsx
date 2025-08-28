/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useEffect, useState } from 'react';
import { css, jsx, keyframes } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { WHATS_NEW_ITEM_TYPES } from '../model/WhatsNew';
import { B500, G300, N30, N30A, N40, N400, N700, P500, Y200 } from '@atlaskit/theme/colors';

const dividerLineStyles = css({
	backgroundColor: token('color.border', N30A),
	height: '2px',
	width: '100%',
	paddingTop: 0,
	paddingRight: token('space.200', '16px'),
	paddingBottom: 0,
	paddingLeft: token('space.200', '16px'),
	marginTop: token('space.200', '16px'),
	boxSizing: 'border-box',
});

export const DividerLine = ({ style }: { style?: React.CSSProperties }) => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
	<div css={dividerLineStyles} style={style} />
);

/**
 * Loading container
 */

type LoadingRectangleProps = {
	contentHeight?: string;
	contentWidth?: string;
	marginTop?: string;
	style?: React.CSSProperties;
};

const shimmer = keyframes({
	'0%': {
		backgroundPosition: '-300px 0',
	},
	'100%': {
		backgroundPosition: '1000px 0',
	},
});

const loadingRectangleStyles = css({
	display: 'inline-block',
	verticalAlign: 'middle',
	position: 'relative',
	borderRadius: token('radius.xsmall'),
	animationDuration: '1.2s',
	animationFillMode: 'forwards',
	animationIterationCount: 'infinite',
	animationName: shimmer,
	animationTimingFunction: 'linear',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	backgroundColor: token('color.background.neutral', N30),
	backgroundImage: `linear-gradient( to right, ${token(
		'color.background.neutral.subtle',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		N30,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	)} 10%, ${token('color.background.neutral', N40)} 20%, ${token(
		'color.background.neutral.subtle',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		N30,
	)} 30% )`,
	backgroundRepeat: 'no-repeat',
});

export const LoadingRectangle = ({
	style,
	contentHeight,
	contentWidth,
	marginTop,
}: LoadingRectangleProps) => (
	<div
		css={loadingRectangleStyles}
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			...style,
			height: contentHeight ?? '1rem',
			marginTop: marginTop ?? token('space.100'),
			width: contentWidth ?? '100%',
		}}
	/>
);

type WhatsNewTypeIconProps = {
	children?: React.ReactNode;
	type?: WHATS_NEW_ITEM_TYPES;
};

const whatsNewTypeIconStyles = css({
	display: 'inline-block',
	'vertical-align': 'middle',
	position: 'relative',
	height: token('space.200'),
	width: token('space.200'),
	'border-radius': '2px',
	color: '#ffff',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& > img': {
		width: `calc(100% - ${token('space.050')})`,
		height: `calc(100% - ${token('space.050')})`,
		position: 'absolute',
		left: '50%',
		top: '50%',
		transform: 'translate(-50%, -50%)',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > svg': {
			height: '100%',
			width: '100%',
		},
	},
});

export const WhatsNewTypeIcon = ({ type, children }: WhatsNewTypeIconProps) => {
	const [backgroundColor, setBackgroundColor] = useState<string>(token('color.icon', N400));
	useEffect(() => {
		switch (type) {
			case WHATS_NEW_ITEM_TYPES.IMPROVEMENT:
				setBackgroundColor(token('color.icon.warning', Y200));
				break;
			case WHATS_NEW_ITEM_TYPES.NEW_FEATURE:
				setBackgroundColor(token('color.icon.success', G300));
				break;
			case WHATS_NEW_ITEM_TYPES.FIX:
				setBackgroundColor(token('color.icon.information', B500));
				break;
			case WHATS_NEW_ITEM_TYPES.EXPERIMENT:
				setBackgroundColor(token('color.icon.discovery', P500));
				break;
			case WHATS_NEW_ITEM_TYPES.REMOVED:
				setBackgroundColor(token('color.icon.disabled', N700));
				break;
			default:
				setBackgroundColor(token('color.icon', N400));
		}
	}, [type]);

	return (
		<div css={whatsNewTypeIconStyles} style={{ backgroundColor }}>
			{children}
		</div>
	);
};
