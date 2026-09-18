/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */

import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { CodeBlockSharedCssClassName } from '@atlaskit/editor-common/styles';
import { token } from '@atlaskit/tokens';
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const findReplaceStylesWithCodeblockColorContrastFix: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER} .search-match-text.selected-search-match`]:
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			span: {
				// we need to use !important here as we need to override inline selection styles
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				color: `${token('color.text')} !important`,
			},
		},
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const findReplaceStyles: SerializedStyles = css({
	// text - inactive match - light mode
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-text': {
		borderRadius: token('space.050'),
		boxShadow: `
		inset 0 0 0 1px ${token('color.border.accent.magenta')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.subtler')}
		`,
		// we need to use !important here as we need to override inline selection styles
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		backgroundColor: `${token('color.background.accent.magenta.subtler')} !important`,
		color: token('color.text'),
	},

	// text - active match - light mode
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-text.selected-search-match': {
		boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.bolder.hovered')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.subtlest.pressed')}
		`,
		// we need to use !important here as we need to override inline selection styles
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		backgroundColor: `${token('color.background.accent.magenta.subtlest.pressed')} !important`,
	},

	// text - inactive match - dark mode
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-text.search-match-dark': {
		boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.bolder.pressed')}
		`,
		// we need to use !important here as we need to override inline selection styles
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		backgroundColor: `${token('color.background.accent.magenta.bolder.pressed')} !important`,
		color: token('color.text.inverse'),
	},

	// text - active match - dark mode
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-text.selected-search-match.search-match-dark': {
		boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.bolder.hovered')}
		`,
		// we need to use !important here as we need to override inline selection styles
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		backgroundColor: `${token('color.background.accent.magenta.bolder.hovered')} !important`,
	},

	// block node - inactive match - light mode - without node selection
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.border.accent.magenta')},
			inset 0 0 0 5px ${token('color.background.accent.magenta.subtler')}
			`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.loader-wrapper>a, .hover-card-trigger-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
			{
				boxShadow: `
			0px 0px 0px 4px ${token('color.background.accent.magenta.subtler')},
			0px 0px 0px 5px ${token('color.border.accent.magenta')}
			`,
			},
	},

	// block node - active match - light mode - without node selection
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block.search-match-block-selected': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.magenta.bolder.hovered')},
			inset 0 0 0 4px ${token('color.background.accent.magenta.subtlest.pressed')}
			`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.loader-wrapper>a, .hover-card-trigger-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
			{
				boxShadow: `
			0px 0px 0px 4px ${token('color.background.accent.magenta.subtlest.pressed')},
			0px 0px 0px 5px ${token('color.background.accent.magenta.bolder.hovered')}
			`,
			},
	},

	// block node - inactive match - light mode - with node selection
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block.ak-editor-selected-node': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.border.accent.magenta')},
			inset 0 0 0 5px ${token('color.background.accent.magenta.subtler')},
			0 0 0 1px ${token('color.border.selected')}
			`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.loader-wrapper>a, .hover-card-trigger-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
			{
				boxShadow: `
			0 0 0 1px ${token('color.border.selected')},
			0px 0px 0px 4px ${token('color.background.accent.magenta.subtler')},
			0px 0px 0px 5px ${token('color.border.accent.magenta')}
			`,
			},
	},

	// block node - active match - light mode - with node selection
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block.search-match-block-selected.ak-editor-selected-node': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.magenta.bolder.hovered')},
			inset 0 0 0 4px ${token('color.background.accent.magenta.subtlest.pressed')},
			0 0 0 1px ${token('color.border.selected')}
			`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.loader-wrapper>a, .hover-card-trigger-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
			{
				boxShadow: `
			0 0 0 1px ${token('color.border.selected')},
			0px 0px 0px 4px ${token('color.background.accent.magenta.subtlest.pressed')},
			0px 0px 0px 5px ${token('color.background.accent.magenta.bolder.hovered')}
			`,
			},
	},

	// block node - inactive match - dark mode - without node selection
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block.search-match-dark': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
			inset 0 0 0 5px ${token('color.background.accent.magenta.bolder.pressed')}
			`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.loader-wrapper>a, .hover-card-trigger-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
			{
				boxShadow: `
			0px 0px 0px 4px ${token('color.background.accent.magenta.bolder.pressed')},
			0px 0px 0px 5px ${token('color.background.accent.magenta.bolder')}
			`,
			},
	},

	// block node - active match - dark mode - without node selection
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block.search-match-block-selected.search-match-dark': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
			inset 0 0 0 4px ${token('color.background.accent.magenta.bolder.hovered')}
			`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.loader-wrapper>a, .hover-card-trigger-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
			{
				boxShadow: `
			0px 0px 0px 4px ${token('color.background.accent.magenta.bolder.hovered')},
			0px 0px 0px 5px ${token('color.background.accent.magenta.bolder')}
			`,
			},
	},

	// block node - inactive match - dark mode - with node selection
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block.search-match-dark.ak-editor-selected-node': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
			inset 0 0 0 5px ${token('color.background.accent.magenta.bolder.pressed')},
			0 0 0 1px ${token('color.border.selected')}
			`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.loader-wrapper>a, .hover-card-trigger-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
			{
				boxShadow: `
			0 0 0 1px ${token('color.border.selected')},
			0px 0px 0px 4px ${token('color.background.accent.magenta.bolder.pressed')},
			0px 0px 0px 5px ${token('color.background.accent.magenta.bolder')}
			`,
			},
	},

	// block node - active match - dark mode - with node selection
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block.search-match-block-selected.search-match-dark.ak-editor-selected-node': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-smart-link-container="true"], .loader-wrapper>div::after': {
			boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
			inset 0 0 0 4px ${token('color.background.accent.magenta.bolder.hovered')},
			0 0 0 1px ${token('color.border.selected')}
			`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.loader-wrapper>a, .hover-card-trigger-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
			{
				boxShadow: `
			0 0 0 1px ${token('color.border.selected')},
			0px 0px 0px 4px ${token('color.background.accent.magenta.bolder.hovered')},
			0px 0px 0px 5px ${token('color.background.accent.magenta.bolder')}
			`,
			},
	},

	// expand title - inactive match - light mode
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-expand-title > .ak-editor-expand__title-container > .ak-editor-expand__input-container':
		{
			borderRadius: token('space.050'),
			boxShadow: `
		inset 0 0 0 1px ${token('color.border.accent.magenta')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.subtler')}
		`,
			backgroundColor: token('color.background.accent.magenta.subtler'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.ak-editor-expand__title-input': {
				color: token('color.text'),
			},
		},

	// expand title - active match - light mode
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-expand-title.selected-search-match > .ak-editor-expand__title-container > .ak-editor-expand__input-container':
		{
			boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.bolder.hovered')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.subtlest.pressed')}
		`,
			backgroundColor: token('color.background.accent.magenta.subtlest.pressed'),
		},

	// expand title - inactive match - dark mode
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-expand-title.search-match-dark > .ak-editor-expand__title-container > .ak-editor-expand__input-container':
		{
			boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.bolder.pressed')}
		`,
			backgroundColor: token('color.background.accent.magenta.bolder.pressed'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.ak-editor-expand__title-input': {
				color: token('color.text.inverse'),
			},
		},

	// expand title - active match - dark mode
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-expand-title.selected-search-match.search-match-dark > .ak-editor-expand__title-container > .ak-editor-expand__input-container':
		{
			boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.bolder.hovered')}
		`,
			backgroundColor: token('color.background.accent.magenta.bolder.hovered'),
		},
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const findReplaceStylesWithRefSyncBlock: SerializedStyles = css({
	// sync block (reference) - inactive match - light mode - without node selection
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block.ak-editor-sync-block': {
		borderRadius: token('space.050'),
		boxShadow: `
		inset 0 0 0 1px ${token('color.border.accent.magenta')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.subtler')}
		`,
		backgroundColor: token('color.background.accent.magenta.subtler'),
	},

	// sync block (reference) - active match - light mode - without node selection
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block.search-match-block-selected.ak-editor-sync-block': {
		boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.bolder.hovered')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.subtlest.pressed')}
		`,
		backgroundColor: token('color.background.accent.magenta.subtlest.pressed'),
	},

	// sync block (reference) - inactive match - light mode - with node selection
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block.ak-editor-sync-block.ak-editor-selected-node': {
		boxShadow: `
		inset 0 0 0 1px ${token('color.border.accent.magenta')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.subtler')},
		0 0 0 1px ${token('color.border.selected')}
		`,
		backgroundColor: token('color.background.accent.magenta.subtler'),
	},

	// sync block (reference) - active match - light mode - with node selection
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block.search-match-block-selected.ak-editor-sync-block.ak-editor-selected-node': {
		boxShadow: `0 0 0 1px ${token('color.border.focused')}`,
		backgroundColor: token('color.background.accent.magenta.subtlest.pressed'),
	},

	// sync block (reference) - inactive match - dark mode - without node selection
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block.search-match-dark.ak-editor-sync-block': {
		boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.bolder.pressed')}
		`,
		backgroundColor: token('color.background.accent.magenta.bolder.pressed'),
	},

	// sync block (reference) - active match - dark mode - without node selection
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block.search-match-block-selected.search-match-dark.ak-editor-sync-block': {
		boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
		inset 0 0 0 4px ${token('color.background.accent.magenta.bolder.hovered')}
		`,
		backgroundColor: token('color.background.accent.magenta.bolder.hovered'),
	},

	// sync block (reference) - inactive match - dark mode - with node selection
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block.search-match-dark.ak-editor-sync-block.ak-editor-selected-node': {
		boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.bolder.pressed')},
		0 0 0 1px ${token('color.border.selected')}
		`,
		backgroundColor: token('color.background.accent.magenta.bolder.pressed'),
	},

	// sync block (reference) - active match - dark mode - with node selection
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.search-match-block.search-match-block-selected.search-match-dark.ak-editor-sync-block.ak-editor-selected-node':
		{
			boxShadow: `0 0 0 1px ${token('color.border.focused')}`,
			backgroundColor: token('color.background.accent.magenta.bolder.hovered'),
		},
});
