/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useEffect, useState } from 'react';
import { css, jsx, keyframes } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { WHATS_NEW_ITEM_TYPES } from '../model/WhatsNew';

const dividerLineStyles = css({
	backgroundColor: token('color.border'),
	height: '2px',
	width: '100%',
	paddingTop: 0,
	paddingRight: token('space.200'),
	paddingBottom: 0,
	paddingLeft: token('space.200'),
	marginTop: token('space.200'),
	boxSizing: 'border-box',
});

export const DividerLine = ({ style }: { style?: React.CSSProperties }): JSX.Element => (
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
	backgroundColor: token('color.background.neutral'),
	backgroundImage: `linear-gradient( to right, ${token('color.background.neutral.subtle')} 10%, ${token('color.background.neutral')} 20%, ${token('color.background.neutral.subtle')} 30% )`,
	backgroundRepeat: 'no-repeat',
});

export const LoadingRectangle = ({
	style,
	contentHeight,
	contentWidth,
	marginTop,
}: LoadingRectangleProps): JSX.Element => (
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
	'border-radius': token('radius.xsmall'),
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

export const WhatsNewTypeIcon = ({ type, children }: WhatsNewTypeIconProps): JSX.Element => {
	const [backgroundColor, setBackgroundColor] = useState<string>(token('color.icon'));
	useEffect(() => {
		switch (type) {
			case WHATS_NEW_ITEM_TYPES.IMPROVEMENT:
				setBackgroundColor(token('color.icon.warning'));
				break;
			case WHATS_NEW_ITEM_TYPES.NEW_FEATURE:
				setBackgroundColor(token('color.icon.success'));
				break;
			case WHATS_NEW_ITEM_TYPES.FIX:
				setBackgroundColor(token('color.icon.information'));
				break;
			case WHATS_NEW_ITEM_TYPES.EXPERIMENT:
				setBackgroundColor(token('color.icon.discovery'));
				break;
			case WHATS_NEW_ITEM_TYPES.REMOVED:
				setBackgroundColor(token('color.icon.disabled'));
				break;
			default:
				setBackgroundColor(token('color.icon'));
		}
	}, [type]);

	return (
		<div css={whatsNewTypeIconStyles} style={{ backgroundColor }}>
			{children}
		</div>
	);
};
