/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { isVerticalPosition } from '@atlaskit/editor-common/guideline';
import { B200, N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { GuidelineConfig } from '../types';

import { getPositionStyles } from './positionStyles';

const basicGuidelineStyles = css({
	position: 'absolute',
	zIndex: 0,
	opacity: 1,
	transition: 'border-color 0.15s linear, opacity 0.15s linear',
	borderColor: `${token('color.border.disabled', N30A)}`,
	borderStyle: 'solid',
});

const verticalStyles = css({
	borderWidth: `0 0 0 1px`,
	width: '1px',
	height: '100%',
});

const horizontalStyles = css({
	borderWidth: `1px 0 0 0`,
	width: '100%',
	height: '1px',
});

const activeGuidelineStyles = css({
	borderColor: token('color.border.focused', B200),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:before, &:after': {
		backgroundColor: token('color.border.focused', B200),
	},
});

const hiddenGuidelineStyles = css({
	opacity: 0,
});

const dashedGuidelineStyles = css({
	borderStyle: 'dashed',
});

const verticalCapStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:before, &:after': {
		backgroundColor: token('color.border.disabled', N30A),
		content: '""',
		position: 'absolute',
		height: '5px',
		width: '1px',
		transform: 'translateY(-50%)',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:after': {
		right: 0,
	},
});

const horizontalCapStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:before, &:after': {
		backgroundColor: `${token('color.border.disabled', N30A)}`,
		content: '""',
		position: 'absolute',
		height: '1px',
		width: '5px',
		transform: 'translateX(-50%)',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:after': {
		bottom: 0,
	},
});

export const Guideline = (props: Omit<GuidelineConfig, 'key'>) => {
	const { position, active, show = true, styles = {} } = props;
	const isVerticalPos = isVerticalPosition(position);

	const { lineStyle, color, capStyle } = styles;

	return (
		<div
			css={[
				basicGuidelineStyles,
				isVerticalPos ? verticalStyles : horizontalStyles,
				capStyle === 'line' && (isVerticalPos ? horizontalCapStyles : verticalCapStyles),
				active && activeGuidelineStyles,
				!show && hiddenGuidelineStyles,
				lineStyle === 'dashed' && dashedGuidelineStyles,
			]}
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				...(color && { borderColor: `${color}` }),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				...getPositionStyles(position),
			}}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="guideline"
		/>
	);
};
