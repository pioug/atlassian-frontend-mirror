/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { token } from '@atlaskit/tokens';
import { jsx, css } from '@compiled/react';
import { getDimensionsWithDefault } from '../utils/lightCards/getDimensionsWithDefault';
import { type InlinePlayerWrapperProps } from './types';
import { VcMediaWrapperProps } from '@atlaskit/react-ufo/vc-media';
import UFOCustomData from '@atlaskit/react-ufo/custom-data';

const hideNativeBrowserTextSelectionStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&::selection,*::selection': {
		backgroundColor: 'transparent',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&::-moz-selection,*::-moz-selection': {
		backgroundColor: 'transparent',
	},
});

const selectedBorderStyle = css({
	'&::after': {
		border: `${token('border.width')} solid ${token('color.border.selected')}`,
	},
});

/*
 * Used to display the blue border around a selected card without
 * shrinking the image OR growing the card size
 */
const borderStyle = css({
	'&::after': {
		content: '',
		width: '100%',
		height: '100%',
		position: 'absolute',
		top: '0',
		boxSizing: 'border-box',
		pointerEvents: 'none',
		borderRadius: token('radius.small', '3px'),
	},
});

export const inlinePlayerClassName = 'media-card-inline-player';
const LOCAL_WIDTH_VARIABLE = '--media-inline-player-wrapper-width';
const LOCAL_HEIGHT_VARIABLE = '--media-inline-player-wrapper-height';

const inlinePlayerWrapperStyles = css({
	overflow: 'hidden',
	borderRadius: token('radius.small', '3px'),
	position: 'relative',
	maxWidth: '100%',
	maxHeight: '100%',
	width: `var(${LOCAL_WIDTH_VARIABLE})`,
	height: `var(${LOCAL_HEIGHT_VARIABLE})`,

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	video: {
		width: '100%',
		height: '100%',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

export const InlinePlayerWrapper = (props: InlinePlayerWrapperProps) => {
	const { testId, selected, dimensions, onClick, innerRef } = props;
	return (
		// eslint-disable-next-line @atlassian/a11y/click-events-have-key-events, @atlassian/a11y/interactive-element-not-keyboard-focusable, @atlassian/a11y/no-static-element-interactions
		<div
			id="inlinePlayerWrapper"
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={inlinePlayerClassName}
			style={{
				[LOCAL_WIDTH_VARIABLE as any]: getDimensionsWithDefault(dimensions).width || '100%',
				[LOCAL_HEIGHT_VARIABLE as any]: getDimensionsWithDefault(dimensions).height || 'auto',
			}}
			css={[
				inlinePlayerWrapperStyles,
				selected && hideNativeBrowserTextSelectionStyles,
				borderStyle,
				selected && selectedBorderStyle,
			]}
			onClick={onClick}
			ref={innerRef}
			{...VcMediaWrapperProps}
		>
			<UFOCustomData data={{ hasMediaComponent: true }} />
			{props.children}
		</div>
	);
};
