// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

import {
	relativeFontSizeToBase16,
	akEditorFullPageDenseFontSize,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import {
	blanketSelectionStyles,
	boxShadowSelectionStyles,
	hideNativeBrowserTextSelectionStyles,
} from './selectionStyles';

/**
 * Creates the extension styles with the ability to use feature flags and experiments.
 * @returns Complete SerializedStyles including base styles and any feature-gated styles
 */
export const getExtensionStyles = (): SerializedStyles => {
	const baseExtensionStyles = css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.multiBodiedExtensionView-content-wrap': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.danger > span > .multiBodiedExtension--container': {
				boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				backgroundColor: token('color.background.danger'),
			},

			// ...extensionLabelStyles
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.danger > span > div > .extension-label': {
				backgroundColor: token('color.background.accent.red.subtler'),
				color: token('color.text.danger'),
				opacity: 1,
				boxShadow: 'none',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:not(.danger).ak-editor-selected-node > span > div > .extension-label': {
				backgroundColor: token('color.background.selected'),
				color: token('color.text.selected'),
				opacity: 1,
				boxShadow: 'none',
			},
			/* Targets the icon for bodied macro styling in button label */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.danger > span > div > .extension-label > span': {
				display: 'inline',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:not(.danger).ak-editor-selected-node > span > div .extension-label > span': {
				display: 'inline',
			},
			/* Start of bodied extension edit toggle styles */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.danger.ak-editor-selected-node > span > .extension-edit-toggle-container': {
				opacity: 1,
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:not(.danger).ak-editor-selected-node > span > .extension-edit-toggle-container': {
				opacity: 1,
			},
			/* In view mode of the bodied macro, we never want to show the extension label */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.danger.ak-editor-selected-node > span > div > .extension-label.always-hide-label': {
				opacity: 0,
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:not(.danger).ak-editor-selected-node > span > div > .extension-label.always-hide-label': {
				opacity: 0,
			},
			/* .with-bodied-macro-live-page-styles class will only be added to bodied macros with the renderer mode gate enabled */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:not(.danger).ak-editor-selected-node > span > div > .extension-label.with-bodied-macro-live-page-styles':
				{
					boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
				},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.danger.ak-editor-selected-node > span > div > .extension-label.with-bodied-macro-live-page-styles':
				{
					boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.danger.ak-editor-selected-node > span > .extension-edit-toggle-container > .extension-edit-toggle':
				{
					backgroundColor: token('color.background.accent.red.subtler'),
					color: token('color.text.danger'),
					boxShadow: 'none',
				},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&.danger > span > .with-danger-overlay': {
				backgroundColor: 'transparent',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.multiBodiedExtension--overlay': {
					// ...dangerOverlayStyles
					opacity: 0.3,
					backgroundColor: token('color.background.danger.hovered'),
				},
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:not(.danger).ak-editor-selected-node': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
				'& > span > .multiBodiedExtension--container': [
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					boxShadowSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					blanketSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					hideNativeBrowserTextSelectionStyles,
				],
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.multiBodiedExtension--container': {
				width: '100%',
				maxWidth: '100%', // ensure width can't go over 100%
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.inlineExtensionView-content-wrap': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.danger > span > .extension-container': {
				boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				backgroundColor: token('color.background.danger'),
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.danger > span > .with-danger-overlay': {
				/* If the macro turned used to red before, not setting the background to be transparent will cause the
			danger state to have two layers of red which we don't want. */
				backgroundColor: 'transparent',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.extension-overlay': {
					// ...dangerOverlayStyles
					opacity: 0.3,
					backgroundColor: token('color.background.danger.hovered'),
				},
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:not(.danger).ak-editor-selected-node': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
				'& > span > .extension-container': [
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					boxShadowSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					hideNativeBrowserTextSelectionStyles,
				],
			},

			// ...extensionLabelStyles
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.danger > span > div > .extension-label': {
				backgroundColor: token('color.background.accent.red.subtler'),
				color: token('color.text.danger'),
				opacity: 1,
				boxShadow: 'none',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:not(.danger).ak-editor-selected-node > span > div > .extension-label': {
				backgroundColor: token('color.background.selected'),
				color: token('color.text.selected'),
				opacity: 1,
				boxShadow: 'none',
			},
			/* Targets the icon for bodied macro styling in button label */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.danger > span > div > .extension-label > span': {
				display: 'inline',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:not(.danger).ak-editor-selected-node > span > div .extension-label > span': {
				display: 'inline',
			},
			/* Start of bodied extension edit toggle styles */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.danger.ak-editor-selected-node > span > .extension-edit-toggle-container': {
				opacity: 1,
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:not(.danger).ak-editor-selected-node > span > .extension-edit-toggle-container': {
				opacity: 1,
			},
			/* In view mode of the bodied macro, we never want to show the extension label */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.danger.ak-editor-selected-node > span > div > .extension-label.always-hide-label': {
				opacity: 0,
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:not(.danger).ak-editor-selected-node > span > div > .extension-label.always-hide-label': {
				opacity: 0,
			},
			/* .with-bodied-macro-live-page-styles class will only be added to bodied macros with the renderer mode gate enabled */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:not(.danger).ak-editor-selected-node > span > div > .extension-label.with-bodied-macro-live-page-styles':
				{
					boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
				},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.danger.ak-editor-selected-node > span > div > .extension-label.with-bodied-macro-live-page-styles':
				{
					boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.danger.ak-editor-selected-node > span > .extension-edit-toggle-container > .extension-edit-toggle':
				{
					backgroundColor: token('color.background.accent.red.subtler'),
					color: token('color.text.danger'),
					boxShadow: 'none',
				},
		},

		/* This is referenced in the toDOM of a bodied extension and is used to put
		label content into the bodied extension.
		We do this so that we don't serialise the label (which causes the label to be
		copied to the clipboard causing copy-paste issues). */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.bodied-extension-to-dom-label::after': {
			content: 'attr(data-bodied-extension-label)',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.extensionView-content-wrap, .multiBodiedExtensionView-content-wrap, .bodiedExtensionView-content-wrap':
			{
				margin: `0.75rem 0`,

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&:first-of-type': {
					marginTop: 0,
				},

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&:last-of-type': {
					marginBottom: 0,
				},

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&:not(.danger).ak-editor-selected-node': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
					'& > span > .extension-container': [
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						boxShadowSelectionStyles,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						hideNativeBrowserTextSelectionStyles,
					],
				},

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'&.danger > span > .extension-container': {
					boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
					backgroundColor: token('color.background.danger'),
				},

				// ...extensionLabelStyles
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'&.danger > span > div > .extension-label': {
					backgroundColor: token('color.background.accent.red.subtler'),
					color: token('color.text.danger'),
					opacity: 1,
					boxShadow: 'none',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&:not(.danger).ak-editor-selected-node > span > div > .extension-label': {
					backgroundColor: token('color.background.selected'),
					color: token('color.text.selected'),
					opacity: 1,
					boxShadow: 'none',
				},
				/* Targets the icon for bodied macro styling in button label */
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'&.danger > span > div > .extension-label > span': {
					display: 'inline',
				},
				/** Targets legacy content header in LCM extension */
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'&.danger > span > .legacy-content-header': {
					boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
					backgroundColor: `${token('color.background.danger')}`,

					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'& .status-lozenge-span > span': {
						backgroundColor: `${token('color.background.accent.red.subtle.hovered')}`,
					},
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&:not(.danger).ak-editor-selected-node > span > div .extension-label > span': {
					display: 'inline',
				},
				/* Start of bodied extension edit toggle styles */
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'&.danger.ak-editor-selected-node > span > .extension-edit-toggle-container': {
					opacity: 1,
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&:not(.danger).ak-editor-selected-node > span > .extension-edit-toggle-container': {
					opacity: 1,
				},
				/* In view mode of the bodied macro, we never want to show the extension label */
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'&.danger.ak-editor-selected-node > span > div > .extension-label.always-hide-label': {
					opacity: 0,
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&:not(.danger).ak-editor-selected-node > span > div > .extension-label.always-hide-label':
					{
						opacity: 0,
					},
				/* .with-bodied-macro-live-page-styles class will only be added to bodied macros with the renderer mode gate enabled */
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&:not(.danger).ak-editor-selected-node > span > div > .extension-label.with-bodied-macro-live-page-styles':
					{
						boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
					},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'&.danger.ak-editor-selected-node > span > div > .extension-label.with-bodied-macro-live-page-styles':
					{
						boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
					},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'&.danger.ak-editor-selected-node > span > .extension-edit-toggle-container > .extension-edit-toggle':
					{
						backgroundColor: token('color.background.accent.red.subtler'),
						color: token('color.text.danger'),
						boxShadow: 'none',
					},

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&.danger > span > .with-danger-overlay': {
					backgroundColor: 'transparent',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'.extension-overlay': {
						// ...dangerOverlayStyles
						opacity: 0.3,
						backgroundColor: token('color.background.danger.hovered'),
					},
				},

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'&.inline': {
					// wordWrap: 'break-all' was previously used here, but break-all is not a valid CSS property of word-wrap.
					// It was probably intended to be word-break: break-all, however I'm omitting it here for consistency with previous actual behavior.
				},
			},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.extensionView-content-wrap .extension-container': {
			overflow: 'hidden',

			/* Don't hide overflow for editors inside extensions. */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:has(.extension-editable-area)': {
				overflow: 'visible',
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.bodiedExtensionView-content-wrap .extensionView-content-wrap .extension-container': {
			width: '100%',
			maxWidth: '100%', // ensure width can't go over 100%
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		"[data-mark-type='fragment']": {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'& > .extensionView-content-wrap, & > .bodiedExtensionView-content-wrap': {
				margin: '0.75rem 0',
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			"& > [data-mark-type='dataConsumer']": {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'& > .extensionView-content-wrap, & > .bodiedExtensionView-content-wrap': {
					margin: '0.75rem 0',
				},
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:first-child': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'& > .extensionView-content-wrap, & > .bodiedExtensionView-content-wrap': {
					marginTop: 0,
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				"& > [data-mark-type='dataConsumer']": {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'& > .extensionView-content-wrap, & > .bodiedExtensionView-content-wrap': {
						marginTop: 0,
					},
				},
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:nth-last-of-type(-n + 2):not(:first-of-type)': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'& > .extensionView-content-wrap, & > .bodiedExtensionView-content-wrap': {
					marginBottom: 0,
				},

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				"& > [data-mark-type='dataConsumer']": {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'& > .extensionView-content-wrap, & > .bodiedExtensionView-content-wrap': {
						marginBottom: 0,
					},
				},
			},
		},
	});

	// Dense content mode extensions styling fix - addresses EDITOR-1992
	// When cleaning up the experiment, move this logic into the baseExtensionStyles above
	const fontSize = expValEquals('cc_editor_ai_content_mode', 'variant', 'test')
		? relativeFontSizeToBase16(akEditorFullPageDenseFontSize)
		: undefined;
	const denseExtensionStyles =
		expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
		fg('platform_editor_content_mode_button_mvp')
			? css({
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
					'.extension-container :not([data-inline-card-lozenge] *, [data-prosemirror-mark-name="code"])':
						{
							// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
							fontSize: 'var(--ak-editor-base-font-size)',
						},
				})
			: expValEquals('cc_editor_ai_content_mode', 'variant', 'test')
				? css({
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
						'.extension-container a span': {
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
							fontSize,
						},
					})
				: css({});

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
	return css(baseExtensionStyles, denseExtensionStyles);
};
