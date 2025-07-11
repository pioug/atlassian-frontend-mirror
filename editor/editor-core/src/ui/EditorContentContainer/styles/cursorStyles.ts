// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css } from '@emotion/react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const cursorStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.ProseMirror.ProseMirror-focused:has(.ProseMirror-mark-boundary-cursor)': {
		caretColor: 'transparent',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.ProseMirror:not(.ProseMirror-focused) .ProseMirror-mark-boundary-cursor': {
		display: 'none',
	},
});
