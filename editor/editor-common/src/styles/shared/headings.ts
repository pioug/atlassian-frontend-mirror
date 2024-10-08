/* eslint-disable @atlaskit/design-system/use-tokens-space */
/* eslint-disable @atlaskit/design-system/use-tokens-typography */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

const headingWithAlignmentStyles = () =>
	// Override marginTop: 0 with default margin found in headingsSharedStyles for first heading in alignment block that is not the first child
	fg('platform_editor_heading_margin_fix')
		? {
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
			}
		: {};

// @see typography spreadsheet: https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
// text sizing prototype: http://proto/fabricrender/
export const headingsSharedStyles = () =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& h1': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			fontSize: `${24 / 14}em`,
			fontStyle: 'inherit',
			lineHeight: 28 / 24,
			color: token('color.text'),
			fontWeight: token('font.weight.medium'),
			letterSpacing: `-0.01em`,
			marginBottom: 0,
			marginTop: '1.667em',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& h2': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			fontSize: `${20 / 14}em`,
			fontStyle: 'inherit',
			lineHeight: 24 / 20,
			color: token('color.text'),
			fontWeight: token('font.weight.medium'),
			letterSpacing: `-0.008em`,
			marginTop: '1.8em',
			marginBottom: 0,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& h3': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			fontSize: `${16 / 14}em`,
			fontStyle: 'inherit',
			lineHeight: 20 / 16,
			color: token('color.text'),
			fontWeight: token('font.weight.semibold'),
			letterSpacing: `-0.006em`,
			marginTop: '2em',
			marginBottom: 0,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& h4': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			fontSize: `${14 / 14}em`,
			fontStyle: 'inherit',
			lineHeight: 16 / 14,
			color: token('color.text'),
			fontWeight: token('font.weight.semibold'),
			letterSpacing: `-0.003em`,
			marginTop: '1.357em',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& h5': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			fontSize: `${12 / 14}em`,
			fontStyle: 'inherit',
			lineHeight: 16 / 12,
			color: token('color.text'),
			fontWeight: token('font.weight.semibold'),
			marginTop: '1.667em',
			textTransform: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& h6': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			fontSize: `${11 / 14}em`,
			fontStyle: 'inherit',
			lineHeight: 16 / 11,
			color: token('color.text.subtlest'),
			fontWeight: token('font.weight.bold'),
			marginTop: '1.455em',
			textTransform: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		...headingWithAlignmentStyles(),
	});
