/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@atlaskit/ui-styling-standard/no-exported-styles,
	@atlaskit/ui-styling-standard/no-nested-selectors,
	@atlaskit/ui-styling-standard/no-unsafe-values,
	@atlaskit/ui-styling-standard/no-unsafe-selectors,
	@atlaskit/ui-styling-standard/no-imported-style-values */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { CodeBlockSharedCssClassName } from '@atlaskit/editor-common/styles';

/**
 * Emotion mirror of the block-spacing styles in EditorContentContainer-compiled.tsx.
 *
 * Re-declares the block-element vertical margins so they read from the
 * --ak-editor-extension-block-spacing CSS custom property (falling back to the original
 * 0.75rem). This is applied LAST in the Emotion container's css array, and only when
 * the platform_editor_extension_block_spacing experiment is enabled, so it overrides
 * the base block margins by source order without affecting the experiment-off behaviour.
 *
 * Keep this in sync with the block-spacing styles in EditorContentContainer-compiled.tsx.
 */
export const blockSpacingVarStyles: SerializedStyles = css({
	'.ProseMirror': {
		// paragraphs
		p: {
			marginTop: 'var(--ak-editor-extension-block-spacing, 0.75rem)',
		},
		// SSR reset rule (mirrors listsStyles `& > style:first-child + p`) so the first
		// paragraph after an SSR style tag also honours the spacing var.
		'& > style:first-child + p': {
			marginTop: 'var(--ak-editor-extension-block-spacing, 0.75rem)',
		},
		// blockquotes — base also zeroes the first blockquote's top margin.
		'& blockquote': {
			marginTop: 'var(--ak-editor-extension-block-spacing, 0.75rem)',
			'&:first-child': {
				marginTop: 0,
			},
		},
		// code blocks
		[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER}`]: {
			marginTop: 'var(--ak-editor-extension-block-spacing, 0.75rem)',
		},
		li: {
			'> .code-block': {
				marginTop: 'var(--ak-editor-extension-block-spacing, 0.75rem)',
			},
			'> .code-block:first-child, > .ProseMirror-gapcursor:first-child + .code-block': {
				marginTop: 0,
			},
			'> div:last-of-type.code-block, > pre:last-of-type.code-block': {
				marginBottom: 'var(--ak-editor-extension-block-spacing, 0.75rem)',
			},
		},
		// smart cards (block card) — base sets top margin only.
		'.blockCardView-content-wrap': {
			marginTop: 'var(--ak-editor-extension-block-spacing, 0.75rem)',
		},
		// extension wrappers — mirrors the base extensionStyles margin rules exactly so that
		// experiment-on reproduces all of the base first/last margin resets.
		'.extensionView-content-wrap, .multiBodiedExtensionView-content-wrap, .bodiedExtensionView-content-wrap':
			{
				marginTop: 'var(--ak-editor-extension-block-spacing, 0.75rem)',
				marginBottom: 'var(--ak-editor-extension-block-spacing, 0.75rem)',
				'&:first-of-type': {
					marginTop: 0,
				},
				'&:last-of-type': {
					marginBottom: 0,
				},
			},
		"[data-mark-type='fragment']": {
			'& > .extensionView-content-wrap, & > .bodiedExtensionView-content-wrap': {
				marginTop: 'var(--ak-editor-extension-block-spacing, 0.75rem)',
				marginBottom: 'var(--ak-editor-extension-block-spacing, 0.75rem)',
			},
			"& > [data-mark-type='dataConsumer']": {
				'& > .extensionView-content-wrap, & > .bodiedExtensionView-content-wrap': {
					marginTop: 'var(--ak-editor-extension-block-spacing, 0.75rem)',
					marginBottom: 'var(--ak-editor-extension-block-spacing, 0.75rem)',
				},
			},
			'&:first-child': {
				'& > .extensionView-content-wrap, & > .bodiedExtensionView-content-wrap': {
					marginTop: 0,
				},
				"& > [data-mark-type='dataConsumer']": {
					'& > .extensionView-content-wrap, & > .bodiedExtensionView-content-wrap': {
						marginTop: 0,
					},
				},
			},
			'&:nth-last-of-type(-n + 2):not(:first-of-type)': {
				'& > .extensionView-content-wrap, & > .bodiedExtensionView-content-wrap': {
					marginBottom: 0,
				},
				"& > [data-mark-type='dataConsumer']": {
					'& > .extensionView-content-wrap, & > .bodiedExtensionView-content-wrap': {
						marginBottom: 0,
					},
				},
			},
		},
	},
});

/**
 * Scaled (em-based) variant of the block-spacing styles for dense/scaled paragraph contexts.
 * Keep this in sync with the scaled block-spacing styles in EditorContentContainer-compiled.tsx.
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const blockSpacingVarScaledStyles: SerializedStyles = css({
	'.ProseMirror p': {
		marginTop: 'var(--ak-editor-extension-block-spacing, 0.75em)',
	},
});
