/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx, keyframes } from '@compiled/react';

import { token } from '@atlaskit/tokens';

/** AI loading overlay rendered over a media node: blanket + sliding rainbow bar. */
export type AIGeneratingOverlayProps = {
	/** Accessible label for the progress bar (translated). */
	label: string;
	/** Optional test id for the overlay root element. Defaults to `'ai-generating-overlay'`. */
	testId?: string;
};

const overlayStyles = css({
	position: 'absolute',
	inset: 0,
	display: 'flex',
	alignItems: 'flex-end',
	justifyContent: 'center',
	paddingBlockEnd: token('space.150', '12px'),
	pointerEvents: 'auto',
	backgroundColor: token('color.blanket', 'rgba(9, 30, 66, 0.36)'),
	zIndex: 5,
});

const progressBarTrackStyles = css({
	width: '95%',
	height: '6px',
	position: 'relative',
	borderRadius: token('radius.full'),
	overflow: 'hidden',
	backgroundColor: token('color.background.neutral', 'rgba(255, 255, 255, 0.3)'),
});

const RAINBOW_TRAIN_COLORS = [
	token('color.chart.categorical.4'), // orange
	token('color.chart.categorical.2'), // green
	token('color.chart.categorical.1'), // blue
	token('color.chart.categorical.3'), // purple
];

const slideKeyframes = keyframes({
	'0%': { left: '-30%', width: '30%' },
	'50%': { left: '25%', width: '75%' },
	'100%': { left: '130%', width: '30%' },
});

const trainStyles = css({
	display: 'flex',
	position: 'absolute',
	top: 0,
	height: '100%',
	animation: `${slideKeyframes} 1.2s linear infinite`,
});

const trainBlockStyles = css({
	height: '100%',
	flex: '1 0 25%',
});

export function AIGeneratingOverlay({ label, testId }: AIGeneratingOverlayProps): JSX.Element {
	return (
		<div css={overlayStyles} data-testid={testId ?? 'ai-generating-overlay'} role="presentation">
			<div
				css={progressBarTrackStyles}
				role="progressbar"
				aria-label={label}
				aria-valuemin={0}
				aria-valuemax={100}
				data-testid="ai-generating-overlay-progress-bar"
			>
				<div css={trainStyles} data-testid="ai-generating-overlay-train">
					{RAINBOW_TRAIN_COLORS.map((color) => (
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- backgroundColor is data-driven from a token array
						<div
							key={color}
							css={trainBlockStyles}
							data-testid="ai-generating-overlay-train-block"
							style={{ backgroundColor: color }}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
