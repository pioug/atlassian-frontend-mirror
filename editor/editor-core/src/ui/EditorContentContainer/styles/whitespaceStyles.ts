import { css } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const whitespaceStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		wordWrap: 'break-word',
		whiteSpace: 'pre-wrap',
	},
});
