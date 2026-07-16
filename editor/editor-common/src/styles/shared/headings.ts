/* eslint-disable @atlaskit/ui-styling-standard/use-compiled -- Pre-existing lint debt surfaced by this mechanical type-import-only PR. */
/* eslint-disable @atlaskit/ui-styling-standard/no-imported-style-values */
/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
/* eslint-disable @atlaskit/design-system/use-tokens-space */
/* eslint-disable @atlaskit/design-system/use-tokens-typography */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import type { ThemeState } from '@atlaskit/tokens/theme-config';

import editorUGCToken from '../../ugc-tokens/get-editor-ugc-token';

const headingWithAlignmentStyles = () =>
	// Override marginTop: 0 with default margin found in headingsSharedStyles for first heading in alignment block that is not the first child
	({
		'.fabric-editor-block-mark.fabric-editor-alignment:not(:first-child)': {
			'> h1:first-child': {
				marginTop: '1.667em',
			},
			' > h2:first-child': {
				marginTop: '1.8em',
			},
			'> h3:first-child': {
				marginTop: '2em',
			},
			'> h4:first-child': {
				marginTop: '1.357em',
			},
			'> h5:first-child': {
				marginTop: '1.667em',
			},
			'> h6:first-child': {
				marginTop: '1.455em',
			},
		},
		// Set marginTop: 0 if alignment block is next to a gap cursor or widget that is first child
		'.ProseMirror-gapcursor:first-child + .fabric-editor-block-mark.fabric-editor-alignment, .ProseMirror-widget:first-child + .fabric-editor-block-mark.fabric-editor-alignment, .ProseMirror-widget:first-child + .ProseMirror-widget:nth-child(2) + .fabric-editor-block-mark.fabric-editor-alignment':
			{
				'> :is(h1, h2, h3, h4, h5, h6):first-child': {
					marginTop: '0',
				},
			},
	});

// @see typography spreadsheet: https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
// text sizing prototype: http://proto/fabricrender/
export const headingsSharedStyles = (
	_typographyTheme?: ThemeState['typography'],
): SerializedStyles => {
	return css({
		'& h1': {
			font: editorUGCToken('editor.font.heading.h1'),
			marginBottom: 0,
			marginTop: '1.45833em',
			'& strong': {
				fontWeight: editorUGCToken('editor.font.weight.heading.h1.bold'),
			},
			'&::before': {},
		},

		'& h2': {
			font: editorUGCToken('editor.font.heading.h2'),
			marginTop: '1.4em',
			marginBottom: 0,
			'& strong': {
				fontWeight: editorUGCToken('editor.font.weight.heading.h1.bold'),
			},
		},

		'& h3': {
			font: editorUGCToken('editor.font.heading.h3'),
			marginTop: '1.31249em',
			marginBottom: 0,
			'& strong': {
				fontWeight: editorUGCToken('editor.font.weight.heading.h1.bold'),
			},
		},

		'& h4': {
			font: editorUGCToken('editor.font.heading.h4'),
			marginTop: '1.25em',
			'& strong': {
				fontWeight: editorUGCToken('editor.font.weight.heading.h1.bold'),
			},
		},

		'& h5': {
			font: editorUGCToken('editor.font.heading.h5'),
			marginTop: '1.45833em',
			textTransform: 'none',
			'& strong': {
				fontWeight: editorUGCToken('editor.font.weight.heading.h1.bold'),
			},
		},

		'& h6': {
			font: editorUGCToken('editor.font.heading.h6'),
			marginTop: '1.59091em',
			textTransform: 'none',
			'& strong': {
				fontWeight: editorUGCToken('editor.font.weight.heading.h1.bold'),
			},
		},

		...headingWithAlignmentStyles(),
	});
};
