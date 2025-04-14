/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { token } from '@atlaskit/tokens';
import { jsx, css } from '@compiled/react';
import { getDimensionsWithDefault } from '../utils/lightCards/getDimensionsWithDefault';
import { type InlinePlayerWrapperProps } from './types';
import { VcMediaWrapperProps } from '@atlaskit/react-ufo/vc-media';

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
		border: `1px solid ${token('color.border.selected')}`,
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
		borderRadius: token('border.radius', '3px'),
	},
});

export const inlinePlayerClassName = 'media-card-inline-player';

const inlinePlayerWrapperStyles = css({
	overflow: 'hidden',
	borderRadius: token('border.radius', '3px'),
	position: 'relative',
	maxWidth: '100%',
	maxHeight: '100%',
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
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
		<div
			id="inlinePlayerWrapper"
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={inlinePlayerClassName}
			style={{
				width: getDimensionsWithDefault(dimensions).width || '100%',
				height: getDimensionsWithDefault(dimensions).height || 'auto',
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
			{props.children}
		</div>
	);
};
