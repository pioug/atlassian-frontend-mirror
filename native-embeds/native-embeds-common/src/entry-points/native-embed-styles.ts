/**
 * Injected by the extension UI via Global; also exported for consumers who inject styles elsewhere.
 */
/* eslint-disable @repo/internal/styles/no-exported-styles, @atlaskit/design-system/no-nested-styles -- Native embed placement must target renderer/editor ancestor wrappers that the embed component does not own. */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Extension container override requires :has and !important
import { css, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const wrapGap = token('space.150', '12px');
const noWrapGap = token('space.300', '24px');

/* eslint-disable @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-important-styles -- Styles injected via Global; !important overrides extension inline width */
export const nativeEmbedAlignmentStyles: SerializedStyles = css({
	// Remove margin on extension-overflow-wrapper when it contains a native embed to prevent width overflow.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Target overflow wrapper by data attribute
	'.extension-overflow-wrapper:has([data-native-embed-alignment])': {
		margin: '0 !important',
	},
	// The renderer sets overflow-x:auto on .ak-renderer-extension-overflow-container, which clips a
	// pixel-resized native embed that is wider than the text column and prevents centering from
	// working (the scroll container also becomes the reference for the 50% offset). Override to
	// visible so the embed can break out symmetrically on both sides, exactly as images do.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Target overflow container by data attribute
	'.ak-renderer-extension-overflow-container:has([data-native-embed-alignment])': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- !important string requires type cast incompatible with the CSSProperties type
		overflowX: 'visible !important' as 'visible',
	},
	// For a center-aligned embed with an explicit pixel width, the outer .ak-renderer-extension
	// wrapper's width is set directly as an inline style by the native embed useEffect (to override
	// the renderer's own inline style="width:100%"). These CSS rules apply the centering transforms
	// on that same wrapper — now that it has the exact pixel width, margin-left:50% +
	// translateX(-50%) breaks it out symmetrically, exactly as MediaSingle does for images.
	// max-width:100cqw prevents overflow beyond the container while still allowing
	// the embed to break out of the narrow layout column (unlike 100% which would
	// clamp to the ~760px parent).
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Target renderer extension wrapper by data attribute
	'.ak-renderer-extension:has([data-native-embed-alignment="center"]):has([data-native-embed-width])':
		{
			position: 'relative',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space -- geometric centering offset, not a spacing value
			marginLeft: '50%',
			transform: 'translateX(-50%)',
			maxWidth: '100cqw',
		},
	// Before the async native embed UI mounts, no effect is available to size the renderer's outer
	// extension wrapper. Shrink-wrap it to the placeholder's persisted width so alignment and text
	// wrapping are correct on first paint. Top-level embeds may break out to the renderer container;
	// nested embeds clamp to their immediate layout/table/extension parent.
	// The renderer's inner wrapper is normally an inline-size query container. Inline-size containment
	// contributes zero intrinsic width, which collapses a fit-content extension wrapper to 0px. Turn
	// that containment off only while an explicit-width placeholder is mounted; the native embed UI
	// restores the normal renderer path once it loads and imperatively sizes the outer wrapper.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Target the renderer-owned size container by the shared placeholder marker
	'.ak-renderer-extension-inner-wrapper:has([data-native-embed-initial-placeholder="true"][data-native-embed-width])':
		{
			containerType: 'normal',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Target the renderer-owned wrapper by the shared native embed placeholder marker
	'.ak-renderer-extension:has([data-native-embed-initial-placeholder="true"][data-native-embed-width])':
		{
			width: 'fit-content !important',
			maxWidth: '100cqw',
		},
	// Some renderer variants omit data-top-level even for top-level extensions. Mirror the native
	// embed runtime's DOM nesting detection instead: table cells/headers, expands, layouts, enclosing
	// extensions, sync blocks, and panels clamp the placeholder to the immediate containing node.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Mirror native embed runtime nesting ancestors before its mounting effect is available
	'td .ak-renderer-extension:has([data-native-embed-initial-placeholder="true"][data-native-embed-width]), th .ak-renderer-extension:has([data-native-embed-initial-placeholder="true"][data-native-embed-width]), [data-node-type="expand"] .ak-renderer-extension:has([data-native-embed-initial-placeholder="true"][data-native-embed-width]), [data-layout-section] .ak-renderer-extension:has([data-native-embed-initial-placeholder="true"][data-native-embed-width]), .ak-renderer-extension .ak-renderer-extension:has([data-native-embed-initial-placeholder="true"][data-native-embed-width]), [data-bodied-sync-block] .ak-renderer-extension:has([data-native-embed-initial-placeholder="true"][data-native-embed-width]), .ak-editor-panel .ak-renderer-extension:has([data-native-embed-initial-placeholder="true"][data-native-embed-width])':
		{
			maxWidth: '100%',
		},
	// Width: 100% when no explicit width set; fit-content when data-native-embed-width is set.
	// Combined selectors cover both .extension-container (editor) and .ak-renderer-extension (renderer)
	// which use different wrapper class names for the same structural element.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Target extension wrappers by data attribute
	'.extension-container:has([data-native-embed-alignment]):not(:has([data-native-embed-width])), .ak-renderer-extension:has([data-native-embed-alignment]):not(:has([data-native-embed-width]))':
		{
			width: '100% !important',
			marginLeft: '0 !important',
			marginRight: '0 !important',
			paddingLeft: '0 !important',
			paddingRight: '0 !important',
		},
	// Match editor/renderer wrapper clipping and selected-node ring to the native embed frame radius.
	// Borderless experiences keep the smaller core wrapper radius so their iframe content is not clipped
	// to a framed shape they do not visually own.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Target extension wrappers by the resolved showBorder value
	'.extension-container:has([data-native-embed-show-border="true"]), .ak-renderer-extension:has([data-native-embed-show-border="true"])':
		{
			borderRadius: token('radius.xlarge'),
		},
	// In the editor, the --native-embed-width CSS variable is set on .extension-container by the
	// resize plugin. When the embed is nested inside another node (e.g. a table cell or expand),
	// data-native-embed-nested is present and we use maxWidth so the embed shrinks with the parent.
	// When the embed is top-level (not nested), we use width so it takes the exact pixel size.
	// In the renderer, width is set directly as an inline style on .ak-renderer-extension (overriding
	// the renderer's own inline style="width:100%"), so no CSS variable rule is needed for the renderer.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Target nested extension container by data attribute on the container itself
	'.extension-container[data-native-embed-nested]:has([data-native-embed-alignment]):has([data-native-embed-width])':
		{
			maxWidth: 'var(--native-embed-width) !important',
			paddingLeft: '0 !important',
			paddingRight: '0 !important',
		},
	// The second selector adds an ID-level specificity bump so this rule also wins in full-width mode
	// (Confluence "wide" page width), where the editor applies `width: 100% !important` to
	// `.extension-container.block` via a rule scoped under
	// `.fabric-editor--full-width-mode:not(:has(#chromeless-editor))` with specificity (1, 3, 0).
	// Without the second selector, the native embed's (0, 3, 0) rule loses the cascade battle.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Second selector matches specificity of editor-core's full-width-mode rule; own ID won't work as our div is inside .extension-container, not an ancestor
	'.extension-container:not([data-native-embed-nested]):has([data-native-embed-alignment]):has([data-native-embed-width]), .fabric-editor--full-width-mode:not(:has(#chromeless-editor)) .extension-container.block:not([data-native-embed-nested]):has([data-native-embed-alignment]):has([data-native-embed-width])':
		{
			width: 'var(--native-embed-width) !important',
			paddingLeft: '0 !important',
			paddingRight: '0 !important',
		},
	// Layout column resizing can temporarily rebuild column content before the
	// native embed plugin re-syncs data-native-embed-nested. Fall back to the
	// actual layout-column DOM ancestry so an embed in a column still shrinks to
	// the column instead of taking its stored pixel width.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- DOM ancestry fallback for transient missing data-native-embed-nested
	'.ProseMirror [data-layout-column] .extension-container:has([data-native-embed-alignment]):has([data-native-embed-width]), .fabric-editor--full-width-mode:not(:has(#chromeless-editor)) [data-layout-column] .extension-container.block:has([data-native-embed-alignment]):has([data-native-embed-width])':
		{
			width: 'auto !important',
			maxWidth: 'var(--native-embed-width) !important',
			paddingLeft: '0 !important',
			paddingRight: '0 !important',
		},
	// Override the extension wrapper's width so alignment margins take effect.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Target extension wrappers by data attribute
	'.extension-container:has([data-native-embed-alignment="left"]), .ak-renderer-extension:has([data-native-embed-alignment="left"])':
		{
			margin: `${noWrapGap} auto ${noWrapGap} 0 !important`,
			overflow: 'auto',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Target extension wrappers by data attribute
	'.extension-container:has([data-native-embed-alignment="center"]), .ak-renderer-extension:has([data-native-embed-alignment="center"])':
		{
			margin: `${noWrapGap} 0 !important`,
			position: 'relative',
			left: '50%',
			transform: 'translateX(-50%)',
			marginLeft: '0 !important',
			marginRight: '0 !important',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Target extension wrappers by data attribute
	'.extension-container:has([data-native-embed-alignment="right"]), .ak-renderer-extension:has([data-native-embed-alignment="right"])':
		{
			margin: `${noWrapGap} 0 ${noWrapGap} auto !important`,
			overflow: 'auto',
		},
	// wrap-left / wrap-right: float + margin like MediaSingle so text wraps around the embed.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Target extension wrappers by data attribute
	'.extension-container:has([data-native-embed-alignment="wrap-left"])': {
		float: 'left',
		margin: `${wrapGap} ${wrapGap} ${wrapGap} auto !important`,
		maxWidth: `calc((var(--ak-editor-max-container-width, 100%) / 2) - ${wrapGap})`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Target extension wrappers by data attribute
	'.ak-renderer-extension:has([data-native-embed-alignment="wrap-left"])': {
		float: 'left',
		margin: `${wrapGap} ${wrapGap} ${wrapGap} auto !important`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Target extension wrappers by data attribute
	'.extension-container:has([data-native-embed-alignment="wrap-right"])': {
		float: 'right',
		margin: `${wrapGap} auto ${wrapGap} ${wrapGap} !important`,
		maxWidth: `calc((var(--ak-editor-max-container-width, 100%) / 2) - ${wrapGap})`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Target extension wrappers by data attribute
	'.ak-renderer-extension:has([data-native-embed-alignment="wrap-right"])': {
		float: 'right',
		margin: `${wrapGap} auto ${wrapGap} ${wrapGap} !important`,
	},
	// Suppress the hover box-shadow on the extension container for all native embeds.
	// Native embeds provide their own chrome so the generic extension hover ring is not appropriate.
	// The selection ring (from .ak-editor-selected-node) is also applied as a box-shadow,
	// and would be incorrectly hidden on hover without the :not() guard.
	// Using :not(.ak-editor-selected-node *) avoids coupling to the intermediate DOM structure.
	// In the renderer there is no selection ring so the :not() guard is not needed.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Target extension wrapper hover by data attribute
	'.extension-container:has([data-native-embed-alignment]):not(.ak-editor-selected-node *):hover': {
		boxShadow: 'none !important',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Target renderer extension wrapper hover by data attribute
	'.ak-renderer-extension:has([data-native-embed-alignment]):hover': {
		boxShadow: 'none !important',
	},
	// Suppress the selection ring (box-shadow from .ak-editor-selected-node) for database embeds.
	// Database embeds use appearance="minimal" with no content border, so the selection ring
	// creates a jarring visual effect around a borderless embed.
	// The box-shadow is applied by editor-core to `.extension-container` via the selector:
	//   `.extensionView-content-wrap.ak-editor-selected-node > span > .extension-container`
	// We target `.extension-container` directly using :has() to check for the experience attribute
	// on the inner div, matching regardless of the intermediate DOM structure.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Target extension-container for database embeds when selected
	'.extension-container:has([data-native-embed-experience="database"])': {
		boxShadow: 'none !important',
	},
});

/* eslint-enable @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-important-styles */
