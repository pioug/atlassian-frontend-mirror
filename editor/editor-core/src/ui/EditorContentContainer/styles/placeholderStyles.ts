// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, keyframes, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const placeholderFadeInKeyframes = keyframes({
	from: {
		opacity: 0,
	},
	to: {
		opacity: 1,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const placeholderTextStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror span[data-placeholder]': {
		color: token('color.text.subtlest'),
		display: 'inline',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror span.pm-placeholder': {
		display: 'inline',
		color: token('color.text.subtlest'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror span.pm-placeholder__text': {
		display: 'inline',
		color: token('color.text.subtlest'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror span.pm-placeholder.ak-editor-selected-node': {
		// ...backgroundSelectionStyles
		backgroundColor: token('color.background.selected'),
		// ...backgroundSelectionStyles -> hideNativeBrowserTextSelectionStyles
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&::selection,*::selection': {
			backgroundColor: 'transparent',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&::-moz-selection,*::-moz-selection': {
			backgroundColor: 'transparent',
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror span.pm-placeholder__text[data-placeholder]::after': {
		color: token('color.text.subtlest'),
		cursor: 'text',
		content: 'attr(data-placeholder)',
		display: 'inline',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror-fake-text-cursor': {
			display: 'inline',
			pointerEvents: 'none',
			position: 'relative',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror-fake-text-cursor::after': {
			content: '""',
			display: 'inline',
			top: 0,
			position: 'absolute',
			borderRight: `1px solid ${token('color.border')}`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror-fake-text-selection': {
			display: 'inline',
			pointerEvents: 'none',
			position: 'relative',
			// Follow the system highlight colour to match native text selection
			backgroundColor: 'Highlight',
			// We should also match the text colour to the system highlight text colour.
			// That way if the system highlight background is dark, the text will still be readable.
			color: 'HighlightText',
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const placeholderStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.ProseMirror .placeholder-decoration': {
		color: token('color.text.subtlest'),
		width: '100%',
		pointerEvents: 'none',
		userSelect: 'none',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.placeholder-android': {
			pointerEvents: 'none',
			outline: 'none',
			userSelect: 'none',
			position: 'absolute',
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror .placeholder-decoration-fade-in': {
		animation: `${placeholderFadeInKeyframes} 300ms ease-out forwards`,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const placeholderOverflowStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.ProseMirror p:has(.placeholder-decoration-hide-overflow)': {
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const placeholderWrapStyles: SerializedStyles = css({
	// As part of controls work, we add placeholder `Search` to quick insert command
	// This style is to prevent `/Search` being wrapped if it's triggered at the end of the line
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.ProseMirror mark[data-type-ahead-query="true"]:has(.placeholder-decoration-wrap)': {
		whiteSpace: 'nowrap',
	},
});
