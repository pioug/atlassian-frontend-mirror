/* eslint-disable @atlaskit/volt-strict-mode/no-multiple-exports */
/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import {
	akEditorFullPageNarrowBreakout,
	akEditorSelectedNodeClassName,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const resizerItemClassName = 'resizer-item';
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const resizerHoverZoneClassName = 'resizer-hover-zone';
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const resizerExtendedZone = 'resizer-is-extended';

/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const resizerHandleClassName = 'resizer-handle';
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const resizerHandleTrackClassName: 'resizer-handle-track' = `${resizerHandleClassName}-track`;
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const resizerHandleThumbClassName: 'resizer-handle-thumb' = `${resizerHandleClassName}-thumb`;
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const resizerDangerClassName: 'resizer-handle-danger' = `${resizerHandleClassName}-danger`;

/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const resizerHandleThumbWidth = 3;
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const handleWrapperClass = 'resizer-handle-wrapper';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Ignored via go/DSP-18766, Seems perfectly safe to autofix, but comments would be lost…
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const resizerStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${resizerItemClassName}`]: {
		willChange: 'width',

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&:hover, &.display-handle': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`& > .${handleWrapperClass} > .${resizerHandleClassName}`]: {
				visibility: 'visible',
				opacity: 1,
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.is-resizing': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`& .${resizerHandleThumbClassName}`]: {
				background: token('color.border.focused'),
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`&.${resizerDangerClassName}`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`& .${resizerHandleThumbClassName}`]: {
				transition: 'none',
				background: token('color.icon.danger'),
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${resizerHandleClassName}`]: {
		display: 'flex',
		visibility: 'hidden',
		opacity: 0,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: 7,
		transition: 'visibility 0.2s, opacity 0.2s',

		// NOTE: The below style is targeted at the div element added by the tooltip. We don't have any means of injecting styles
		// into the tooltip
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		"& div[role='presentation']": {
			width: '100%',
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			marginTop: token('space.negative.200'),
			whiteSpace: 'normal',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.left': {
			alignItems: 'flex-start',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.right': {
			alignItems: 'flex-end',
		},

		// Handle Sizing
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.small': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`& .${resizerHandleThumbClassName}`]: {
				height: 43,
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.medium': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`& .${resizerHandleThumbClassName}`]: {
				height: 64,
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.large': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`& .${resizerHandleThumbClassName}`]: {
				height: 96,
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.clamped': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`& .${resizerHandleThumbClassName}`]: {
				height: 'clamp(43px, calc(100% - 32px), 96px)',
			},
		},

		// Handle Alignment
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.sticky': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`& .${resizerHandleThumbClassName}`]: {
				position: 'sticky',
				top: token('space.150'),
				bottom: token('space.150'),
			},
		},

		'&:hover': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`& .${resizerHandleThumbClassName}`]: {
				background: token('color.border.focused'),
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`& .${resizerHandleTrackClassName}`]: {
				visibility: 'visible',
				opacity: 0.5,
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${resizerHandleThumbClassName}`]: {
		content: "' '",
		display: 'flex',
		width: 3,
		margin: `0 ${token('space.025')}`,
		height: 64,
		transition: 'background-color 0.2s',
		borderRadius: token('radius.medium'),
		border: 0,
		padding: 0,
		zIndex: 2,
		outline: 'none',
		minHeight: 24,
		background: token('color.border'),

		'&:hover': {
			cursor: 'col-resize',
		},

		'&:focus': {
			background: token('color.border.selected'),

			'&::after': {
				content: "''",
				position: 'absolute',
				top: token('space.negative.050'),
				right: token('space.negative.050'),
				bottom: token('space.negative.050'),
				left: token('space.negative.050'),
				border: `${token('border.width.selected')} solid ${token('color.border.focused')}`,
				borderRadius: 'inherit',
				zIndex: -1,
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${resizerHandleTrackClassName}`]: {
		visibility: 'hidden',
		position: 'absolute',
		width: 7,
		height: 'calc(100% - 40px)',
		borderRadius: token('radius.small'),
		opacity: 0,
		transition: 'background-color 0.2s, visibility 0.2s, opacity 0.2s',

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.none': {
			background: 'none',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.shadow': {
			background: token('color.background.selected'),
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.full-height': {
			background: token('color.background.selected'),
			height: '100%',
			minHeight: 36,
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.${akEditorSelectedNodeClassName}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`& .${resizerHandleThumbClassName}`]: {
			background: token('color.border.focused'),
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.ak-editor-no-interaction .ak-editor-selected-node .${resizerHandleClassName}:not(:hover) .${resizerHandleThumbClassName}`]:
		{
			background: token('color.border'),
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${resizerHoverZoneClassName}`]: {
		position: 'relative',
		display: 'flow-root',
		width: '100%',

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`&.${resizerExtendedZone}`]: {
			padding: `0 ${token('space.150')}`,
			left: token('space.negative.150'),
		},
	},

	// This below style is here to make sure the image width is correct when nested in a table
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`table .${resizerHoverZoneClassName}, table .${resizerHoverZoneClassName}.${resizerExtendedZone}`]:
		{
			padding: 'unset',
			left: 'unset',
		},
});

/**
 * Bottom-handle styles for the vertical-resize feature shipped under the
 * `databases-native-embeds-v2` experiment
 */
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const resizerBottomHandleStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${resizerHandleClassName}.bottom`]: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		width: '100%',
		height: 7,

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`& .${resizerHandleThumbClassName}`]: {
			width: 64,
			height: 3,
			minWidth: 24,
			minHeight: 0,
			margin: `${token('space.025')} 0`,

			'&:hover': {
				cursor: 'row-resize',
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`& .${resizerHandleTrackClassName}`]: {
			width: 'calc(100% - 40px)',
			height: 7,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`& .${resizerHandleTrackClassName}.full-height`]: {
			width: '100%',
			height: 7,
			minWidth: 36,
			minHeight: 0,
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${resizerHandleClassName}.small.bottom .${resizerHandleThumbClassName}`]: {
		width: 43,
		height: 3,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${resizerHandleClassName}.medium.bottom .${resizerHandleThumbClassName}`]: {
		width: 64,
		height: 3,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${resizerHandleClassName}.large.bottom .${resizerHandleThumbClassName}`]: {
		width: 96,
		height: 3,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${resizerHandleClassName}.clamped.bottom .${resizerHandleThumbClassName}`]: {
		width: 'clamp(43px, calc(100% - 32px), 96px)',
		height: 3,
	},
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const pragmaticResizerStylesForTooltip: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-breakout-resize-handle-rail-wrapper': {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',

		height: '100%',

		cursor: 'col-resize',

		borderRadius: token('radius.small'),
		zIndex: 2,

		// Tootip element
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[role="presentation"]': {
			height: '100%',
			width: '100%',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.pm-breakout-resize-handle-rail-inside-tooltip': {
			height: '100%',
		},
	},
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const pragmaticStylesLayoutFirstNodeResizeHandleFix: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.fabric-editor-breakout-mark': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has([data-prosemirror-node-name="layoutSection"].first-node-in-document)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container': {
				height: 'calc(100% - 8px)',
			},
		},
	},
});

// Code block resizer position: legacy selector (matches any descendant code block).
// When synced block contains a code block, this incorrectly applies -5px and the handle appears inside the border.
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const pragmaticResizerStylesCodeBlockLegacy: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.fabric-editor-breakout-mark': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has([data-prosemirror-node-name="codeBlock"])': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container--left': {
				left: '-5px',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container--right': {
				right: '-5px',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container': {
				height: 'calc(100% - 12px)',
			},
		},
		// the first node in the document always has margin-top = 0
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has(.first-node-in-document)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container': {
				height: '100%',
			},
		},
	},
});

// Code block resizer position: only when breakout directly wraps a code block.
// Synced block containing code block keeps -24px from pragmaticResizerStylesSyncedBlock so the handle stays outside.
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const pragmaticResizerStylesCodeBlockSyncedBlockPatch: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.fabric-editor-breakout-mark': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has(> .fabric-editor-breakout-mark-dom > [data-prosemirror-node-name="codeBlock"])': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container--left': {
				left: '-5px',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container--right': {
				right: '-5px',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container': {
				height: 'calc(100% - 12px)',
			},
		},
		// the first node in the document always has margin-top = 0
		// class name is duplicated to boost specificity
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has(.first-node-in-document.first-node-in-document)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container': {
				height: '100%',
			},
		},
	},
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const pragmaticResizerStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.fabric-editor-breakout-mark': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has([data-prosemirror-node-name="expand"]), &:has([data-prosemirror-node-name="layoutSection"])':
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'> .pm-breakout-resize-handle-container--left': {
					left: '-25px',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'> .pm-breakout-resize-handle-container--right': {
					right: '-25px',
				},
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has([data-prosemirror-node-name="expand"])': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container': {
				height: 'calc(100% - 4px)',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has([data-prosemirror-node-name="layoutSection"])': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container': {
				height: 'calc(100% - 8px)',
			},
		},
		// the first node in the document always has margin-top = 0
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has(.first-node-in-document)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container': {
				height: '100%',
			},
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-breakout-resize-handle-container': {
		position: 'relative',
		alignSelf: 'end',
		gridRow: 1,
		gridColumn: 1,
		height: '100%',
		width: 7,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-breakout-resize-handle-container--left': {
		justifySelf: 'start',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-breakout-resize-handle-container--right': {
		justifySelf: 'end',
	},
	// Rail and thumb styles intentionally mirror the layout column divider
	// (see layoutColumnDividerRailClassName and layoutColumnDividerThumbClassName in layout.ts).
	// If updating these styles, consider keeping both in sync.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-breakout-resize-handle-rail': {
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',

		height: '100%',

		cursor: 'col-resize',

		borderRadius: token('radius.small'),
		transition: 'background-color 0.2s, visibility 0.2s, opacity 0.2s',
		zIndex: 2,

		opacity: 0,

		'&:hover': {
			background: token('color.background.selected'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.pm-breakout-resize-handle-thumb': {
				background: token('color.border.focused'),
			},
		},
	},
	// same as 'hover' styles above
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-breakout-resize-handle-container--active': {
		background: token('color.background.selected'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.pm-breakout-resize-handle-thumb': {
			background: token('color.border.focused'),
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-breakout-resize-handle-hit-box': {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: -20,
		right: -20,
		zIndex: 0,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-breakout-resize-handle-thumb': {
		minWidth: resizerHandleThumbWidth,
		// copied from resizeStyles.clamped
		height: 'clamp(27px, calc(100% - 32px), 96px)',
		background: token('color.border'),
		borderRadius: token('radius.medium'),

		// sticky styles
		position: 'sticky',
		top: token('space.150'),
		bottom: token('space.150'),
	},
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const pragmaticResizerStylesSyncedBlock: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.fabric-editor-breakout-mark': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has([data-prosemirror-node-name="syncBlock"]), &:has([data-prosemirror-node-name="bodiedSyncBlock"])':
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'> .pm-breakout-resize-handle-container--left': {
					left: '-24px',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'> .pm-breakout-resize-handle-container--right': {
					right: '-24px',
				},

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'> .pm-breakout-resize-handle-container': {
					height: 'calc(100% - 12px)',
				},
			},
	},
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const pragmaticResizerStylesWithReducedEditorGutter: SerializedStyles = css({
	/* container editor-area is defined in platform/packages/editor/editor-core/src/ui/Appearance/FullPage/StyledComponents.ts */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`@container editor-area (max-width: ${akEditorFullPageNarrowBreakout}px)`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.fabric-editor-breakout-mark': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:has([data-prosemirror-node-name="expand"]), &:has([data-prosemirror-node-name="layoutSection"])':
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'> .pm-breakout-resize-handle-container': {
						opacity: 0,
						visibility: 'hidden',
					},
				},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:has([data-prosemirror-node-name="layoutSection"])': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
				[`.${resizerItemClassName}`]: {
					willChange: 'width',

					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'&:hover, &.display-handle': {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
						[`& > .${handleWrapperClass} > .${resizerHandleClassName}`]: {
							visibility: 'hidden',
							opacity: 0,
						},
					},
				},
			},
		},
	},
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const pragmaticResizerStylesPanelAndRule: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.fabric-editor-breakout-mark': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has(> .fabric-editor-breakout-mark-dom > [data-prosemirror-node-name="panel"])': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container--right': {
				right: '-4px',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container': {
				height: 'calc(100% - 12px)',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has(> .fabric-editor-breakout-mark-dom > [data-prosemirror-node-name="panel_c1"])': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container--right': {
				right: '-4px',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container': {
				height: 'calc(100% - 12px)',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has(> .fabric-editor-breakout-mark-dom > [data-prosemirror-node-name="rule"])': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container--right': {
				right: '-4px',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container': {
				alignSelf: 'center',
				height: '40px',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has(> .fabric-editor-breakout-mark-dom > [data-prosemirror-node-name="rule"].first-node-in-document)':
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'> .pm-breakout-resize-handle-container': {
					transform: 'translateY(-12px)',
				},
			},
	},
});
