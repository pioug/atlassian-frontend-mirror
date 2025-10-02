// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

import { INLINE_IMAGE_WRAPPER_CLASS_NAME } from '@atlaskit/editor-common/media-inline';
import { MediaSharedClassNames, richMediaClassName } from '@atlaskit/editor-common/styles';
import {
	akEditorMediaResizeHandlerPadding,
	akEditorMediaResizeHandlerPaddingWide,
	akEditorSelectedBorderBoldSize,
	akEditorSelectedBoxShadow,
	akEditorSelectedNodeClassName,
	akEditorWrappedNodeZIndex,
} from '@atlaskit/editor-shared-styles';
import {
	fileCardImageViewSelector,
	inlinePlayerClassName,
	newFileExperienceClassName,
} from '@atlaskit/media-card';
import { token } from '@atlaskit/tokens';

import { dangerBorderStyles } from './selectionStyles';

const wrappedMediaBreakoutPoint = 410;

/**
 * Reference Heights
 *
 * These heights enforce consistent sizes with media inline nodes due to
 * inconsistencies with center aligned inline nodes and text.
 *
 * There is conversation about refactoring media inline nodes to conform to
 * aligning correctly with the surrounding text.
 *
 * These constants originally came from `headingSizes` from the `theme` package
 * and have been copied here to remove this package.
 */
const referenceHeights = {
	p: 24 - 2,
	h1: 32 + 4,
	h2: 28 + 3,
	h3: 24 + 1,
	h4: 20 + 3,
	h5: 16 + 4,
	h6: 16 + 2,
};

const inlineImageSelector = `> .mediaInlineView-content-wrap > .${INLINE_IMAGE_WRAPPER_CLASS_NAME}, > :is(a, span[data-mark-type='border']) .mediaInlineView-content-wrap > .${INLINE_IMAGE_WRAPPER_CLASS_NAME}, > .${INLINE_IMAGE_WRAPPER_CLASS_NAME}, > :is(a, span[data-mark-type='border']) .${INLINE_IMAGE_WRAPPER_CLASS_NAME}`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles,@atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
export const mediaStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-imported-style-values
		[`li .${richMediaClassName}`]: {
			margin: 0,
		},

		// Hack for chrome to fix media single position inside a list when media is the first child
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.ua-chrome li > .mediaSingleView-content-wrap::before': {
			content: "''",
			display: 'block',
			height: 0,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.ua-firefox': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.mediaSingleView-content-wrap': {
				userSelect: 'none',
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.captionView-content-wrap': {
				userSelect: 'text',
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		".mediaSingleView-content-wrap[layout^='wrap-']": {
			position: 'relative',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-imported-style-values
			zIndex: akEditorWrappedNodeZIndex,
			maxWidth: '100%',
			/* overwrite default Prosemirror setting making it clear: both */
			clear: 'inherit',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		".mediaSingleView-content-wrap[layout='center']": {
			clear: 'both',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-imported-style-values
		[`table .${richMediaClassName}`]: {
			marginTop: token('space.150', '12px'),
			marginBottom: token('space.150', '12px'),
			clear: 'both',

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.image-wrap-left[data-layout], &.image-wrap-right[data-layout]': {
				clear: 'none',

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&:first-child': {
					marginTop: token('space.150', '12px'),
				},
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-imported-style-values
		[`.${richMediaClassName}.image-wrap-right + .${richMediaClassName}.image-wrap-left`]: {
			clear: 'both',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-imported-style-values
		[`.${richMediaClassName}.image-wrap-left + .${richMediaClassName}.image-wrap-right, .${richMediaClassName}.image-wrap-right + .${richMediaClassName}.image-wrap-left, .${richMediaClassName}.image-wrap-left + .${richMediaClassName}.image-wrap-left, .${richMediaClassName}.image-wrap-right + .${richMediaClassName}.image-wrap-right`]:
			{
				marginRight: 0,
				marginLeft: 0,
			},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`@media all and (max-width: ${wrappedMediaBreakoutPoint}px)`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			"div.mediaSingleView-content-wrap[layout='wrap-left'], div.mediaSingleView-content-wrap[data-layout='wrap-left'], div.mediaSingleView-content-wrap[layout='wrap-right'], div.mediaSingleView-content-wrap[data-layout='wrap-right']":
				{
					float: 'none',
					overflow: 'auto',
					margin: `${token('space.150', '12px')} 0`,
				},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`& [layout='full-width'] .${richMediaClassName}, & [layout='wide'] .${richMediaClassName}`]: {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginLeft: '50%',
			transform: 'translateX(-50%)',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		".media-extended-resize-experience[layout^='wrap-']": {
			// override 'overflow: auto' when viewport <= 410 set by mediaSingleSharedStyle
			// to prevent scroll bar
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			overflow: 'visible !important',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		"& [layout^='wrap-'] + [layout^='wrap-']": {
			clear: 'none',

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			"& + p, & + div[class^='fabric-editor-align'], & + ul, & + ol, & + h1, & + h2, & + h3, & + h4, & + h5, & + h6":
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles,@atlaskit/ui-styling-standard/no-unsafe-values
					clear: 'both !important' as 'both',
				},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`& .${richMediaClassName}`]: {
				marginLeft: 0,
				marginRight: 0,
			},
		},

		// Shifting the mediaInline image component (renders image) to align nicely with
		// mediaInline (renders text) is a bit of a testing ground. This numbers represent
		// shift in top and bottom and size adjustments to make up for lack of 1to1 size
		//  mapping
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${INLINE_IMAGE_WRAPPER_CLASS_NAME}`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			height: referenceHeights['p'],
			transform: 'translateY(-2px)',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		h1: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[inlineImageSelector]: {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				height: referenceHeights.h1,
				transform: `translateY(-3px)`,
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		h2: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[inlineImageSelector]: {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				height: referenceHeights.h2,
				transform: `translateY(-3px)`,
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		h3: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[inlineImageSelector]: {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				height: referenceHeights.h3,
				transform: `translateY(-2px)`,
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		h4: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[inlineImageSelector]: {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				height: referenceHeights.h4,
				transform: `translateY(-2px)`,
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		h5: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[inlineImageSelector]: {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				height: referenceHeights.h5,
				transform: `translateY(-2px)`,
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		h6: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[inlineImageSelector]: {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				height: referenceHeights.h6,
				transform: `translateY(-2px)`,
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		".mediaSingleView-content-wrap[layout='wrap-left']": {
			float: 'left',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		".mediaSingleView-content-wrap[layout='wrap-right']": {
			float: 'right',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		".mediaSingleView-content-wrap[layout='wrap-right'] + .mediaSingleView-content-wrap[layout='wrap-left']":
			{
				clear: 'both',
			},

		// Larger margins for resize handlers when at depth 0 of the document
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > .mediaSingleView-content-wrap': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.richMedia-resize-handle-right': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
				marginRight: `-${akEditorMediaResizeHandlerPaddingWide}px`,
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.richMedia-resize-handle-left': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
				marginLeft: `-${akEditorMediaResizeHandlerPaddingWide}px`,
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-imported-style-values
	[`.${MediaSharedClassNames.FLOATING_TOOLBAR_COMPONENT}`]: {
		padding: 0,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.richMedia-resize-handle-right, .richMedia-resize-handle-left': {
		display: 'flex',
		flexDirection: 'column',

		/* vertical align */
		justifyContent: 'center',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.richMedia-resize-handle-right': {
		alignItems: 'flex-end',
		paddingRight: token('space.150'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
		marginRight: `-${akEditorMediaResizeHandlerPadding}px`,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.richMedia-resize-handle-left': {
		alignItems: 'flex-start',
		paddingLeft: token('space.150'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
		marginLeft: `-${akEditorMediaResizeHandlerPadding}px`,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.richMedia-resize-handle-right::after, .richMedia-resize-handle-left::after': {
		content: "' '",
		display: 'flex',
		width: 3,
		height: 64,
		borderRadius: token('radius.medium'),
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${richMediaClassName}:hover .richMedia-resize-handle-left::after, .${richMediaClassName}:hover .richMedia-resize-handle-right::after`]:
		{
			background: token('color.border'),
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${akEditorSelectedNodeClassName} .richMedia-resize-handle-right::after, .${akEditorSelectedNodeClassName} .richMedia-resize-handle-left::after, .${richMediaClassName} .richMedia-resize-handle-right:hover::after, .${richMediaClassName} .richMedia-resize-handle-left:hover::after, .${richMediaClassName}.is-resizing .richMedia-resize-handle-right::after, .${richMediaClassName}.is-resizing .richMedia-resize-handle-left::after`]:
		{
			background: token('color.border.focused'),
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.__resizable_base__': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		left: 'unset !important',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		width: 'auto !important',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		height: 'auto !important',
	},

	// Danger when top level node for smart cards / inline links
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.danger > div > div > .media-card-frame, .danger > span > a': {
		backgroundColor: token('color.background.danger'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
		boxShadow: `0px 0px 0px ${akEditorSelectedBorderBoldSize}px, ${token('color.border.danger')}`,
		transition: 'background-color 0s, box-shadow 0s',
	},

	// Danger when nested node or common
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.danger': {
		// Media single
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${richMediaClassName} .${fileCardImageViewSelector}::after`]: {
			border: `1px solid ${token('color.border.danger')}`,
		},

		// Media single video player
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${richMediaClassName} .${inlinePlayerClassName}::after`]: {
			border: `1px solid ${token('color.border.danger')}`,
		},

		// New file experience
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${richMediaClassName} .${newFileExperienceClassName}`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			boxShadow: `0 0 0 1px ${token('color.border.danger')} !important`,
		},

		// Media resize legacy handlers
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.richMedia-resize-handle-right::after, .richMedia-resize-handle-left::after': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			background: `${token('color.icon.danger')} !important`,
		},

		// Media resize new handlers
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.resizer-handle-thumb': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			background: `${token('color.icon.danger')} !important`,
		},

		// Smart cards
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'div div .media-card-frame, .inlineCardView-content-wrap > span > a': {
			backgroundColor: `${token('color.blanket.danger')}`,
			transition: `background-color 0s`,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'div div .media-card-frame::after': {
			boxShadow: 'none',
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.warning': {
		// Media single
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${richMediaClassName} .${fileCardImageViewSelector}::after`]: {
			border: `1px solid ${token('color.border.warning')}`,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${richMediaClassName} .${inlinePlayerClassName}::after`]: {
			border: `1px solid ${token('color.border.warning')}`,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${richMediaClassName} .${newFileExperienceClassName}`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			boxShadow: `0 0 0 1px ${token('color.border.warning')} !important`,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.resizer-handle-thumb': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			background: `${token('color.icon.warning')} !important`,
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.media-filmstrip-list-item': {
		cursor: 'pointer',
	},

	// When clicking drag handle, mediaGroup node will be selected. Hence we need to apply selected style to each media node
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.mediaGroupView-content-wrap.${akEditorSelectedNodeClassName} #newFileExperienceWrapper`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
		boxShadow: akEditorSelectedBoxShadow,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-no-interaction #newFileExperienceWrapper': {
		boxShadow: 'none',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const mediaDangerStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-nested-selectors
		[`.mediaInlineView-content-wrap.${akEditorSelectedNodeClassName}.danger`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			[` .${INLINE_IMAGE_WRAPPER_CLASS_NAME}`]: [dangerBorderStyles],
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			'>span> span[role="button"]': [dangerBorderStyles],
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.mediaGroupView-content-wrap.danger #newFileExperienceWrapper`]:
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			[dangerBorderStyles],
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const mediaGroupStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.mediaGroupView-content-wrap ul': {
		padding: 0,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const mediaAlignmentStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.fabric-editor-block-mark[class^="fabric-editor-align"]': {
		// It was `clear: none !important` before, but it was causing typescript errors
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		clear: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.fabric-editor-align-end': {
		textAlign: 'right',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.fabric-editor-align-start': {
		textAlign: 'left',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.fabric-editor-align-center': {
		textAlign: 'center',
	},
	// For FullPage only when inside a table
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.fabric-editor--full-width-mode': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.pm-table-container': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.code-block, .extension-container, .multiBodiedExtension--container': {
				maxWidth: '100%',
			},
		},
	},
});
