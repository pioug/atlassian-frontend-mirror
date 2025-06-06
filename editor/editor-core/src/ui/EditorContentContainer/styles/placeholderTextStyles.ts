// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const placeholderTextStyles = css({
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
			backgroundColor: token('color.background.selected', '#B3D4FF'),
		},
	},
});
