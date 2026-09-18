/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */

import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

/**
 * Default look for tooltips created by `VanillaTooltip` (`editor-common/vanilla-tooltip`).
 * Opt in with `VANILLA_TOOLTIP_DEFAULT_CLASS`. Spelt out here because the selector has to stay
 * statically analysable, so rename in step with that constant.
 *
 * The tooltip is a `[popover]`: the browser paints it in the top layer but leaves it in the
 * DOM, so this descendant selector still matches. `VanillaTooltip` sets `opacity`,
 * `visibility` and `transition` inline for the show/hide animation;
 */
export const vanillaTooltipDefaultStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-vanilla-tooltip-default': {
			boxSizing: 'border-box',
			maxWidth: '240px',
			backgroundColor: token('color.background.neutral.bold'),
			border: 'none',
			borderRadius: token('radius.small', '3px'),
			color: token('color.text.inverse'),
			font: token('font.body.small'),
			fontFamily: token('font.family.body'),
			insetBlockStart: token('space.0', '0px'),
			insetInlineStart: token('space.0', '0px'),
			overflowWrap: 'break-word',
			paddingBlock: token('space.050', '4px'),
			paddingInline: token('space.075', '6px'),
			whiteSpace: 'normal',
		},
	},
});
