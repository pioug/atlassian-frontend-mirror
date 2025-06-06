// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const statusStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-table-cell-content-wrap, .pm-table-header-content-wrap, [data-layout-section]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.statusView-content-wrap': {
			maxWidth: '100%',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: 0,

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'& > span': {
				width: '100%',
			},
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.statusView-content-wrap': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > span': {
			cursor: 'pointer',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: 0, // Prevent responsive layouts increasing height of container.
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.danger': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.status-lozenge-span > span': {
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			backgroundColor: 'rgba(255, 189, 173, 0.5)', // akEditorDeleteBackgroundWithOpacity
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.statusView-content-wrap.ak-editor-selected-node': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.status-lozenge-span > span': {
				boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
			},
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const statusStylesMixin_fg_platform_component_visual_refresh = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.statusView-content-wrap': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.ak-editor-selected-node .status-lozenge-span > span': {
			boxShadow: `0 0 0 2px ${token('color.border.selected')}`,
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const statusStylesMixin_without_fg_platform_component_visual_refresh = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.statusView-content-wrap': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.ak-editor-selected-node .status-lozenge-span > span': {
			// getSelectionStyles([SelectionStyle.BoxShadow]);
			boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
			borderColor: 'transparent',
			// hideNativeBrowserTextSelectionStyles
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&::selection, & *::selection': {
				backgroundColor: 'transparent',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&::-moz-selection, & *::-moz-selection': {
				backgroundColor: 'transparent',
			},
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const vanillaStatusStyles = css({
	// baseVanillaStatusStyles
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="status"] .lozenge-wrapper':
		{
			backgroundColor: token('color.background.neutral'),
			maxWidth: '100%',
			paddingInline: token('space.050'),
			display: 'inline-flex',
			borderRadius: '3px',
			blockSize: 'min-content',
			position: 'static',
			overflow: 'hidden',
			boxSizing: 'border-box',
			appearance: 'none',
			border: 'none',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="status"] .lozenge-text':
		{
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: '11px',
			fontStyle: 'normal',
			fontFamily: token('font.family.body'),
			fontWeight: token('font.weight.bold'),
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: '16px',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			textTransform: 'uppercase',
			whiteSpace: 'nowrap',
			maxWidth: `calc(200px - ${token('space.100', '8px')})`,
		},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const vanillaStatusStylesMixin_fg_platform_component_visual_refresh = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="status"] .lozenge-text':
		{
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			color: '#292A2E',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="status"] > [data-color=neutral] > .lozenge-wrapper':
		{
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			backgroundColor: '#DDDEE1',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="status"] > [data-color=purple] > .lozenge-wrapper':
		{
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			backgroundColor: '#D8A0F7',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="status"] > [data-color=blue] > .lozenge-wrapper':
		{
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			backgroundColor: '#8FB8F6',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="status"] > [data-color=yellow] > .lozenge-wrapper':
		{
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			backgroundColor: '#F9C84E',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="status"] > [data-color=red] > .lozenge-wrapper':
		{
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			backgroundColor: '#FD9891',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="status"] > [data-color=green] > .lozenge-wrapper':
		{
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			backgroundColor: '#B3DF72',
		},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const vanillaStatusStylesMixin_without_fg_platform_component_visual_refresh = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="status"] > [data-color=neutral] .lozenge-wrapper':
		{
			backgroundColor: token('color.background.neutral'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="status"] > [data-color=neutral] .lozenge-text':
		{
			color: token('color.text.subtle'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="status"] > [data-color=purple] .lozenge-wrapper':
		{
			backgroundColor: token('color.background.discovery'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="status"] > [data-color=purple] .lozenge-text':
		{
			color: token('color.text.discovery'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="status"] > [data-color=blue] .lozenge-wrapper':
		{
			backgroundColor: token('color.background.information'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="status"] > [data-color=blue] .lozenge-text':
		{
			color: token('color.text.information'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="status"] > [data-color=yellow] .lozenge-wrapper':
		{
			backgroundColor: token('color.background.warning'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="status"] > [data-color=yellow] .lozenge-text':
		{
			color: token('color.text.warning'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="status"] > [data-color=red] .lozenge-wrapper':
		{
			backgroundColor: token('color.background.danger'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="status"] > [data-color=red] .lozenge-text':
		{
			color: token('color.text.danger'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="status"] > [data-color=green] .lozenge-wrapper':
		{
			backgroundColor: token('color.background.success'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"][data-prosemirror-node-name="status"] > [data-color=green] .lozenge-text':
		{
			color: token('color.text.success'),
		},
});
