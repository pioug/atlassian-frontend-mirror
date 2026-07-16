/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { SyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';

/**
 * Interactive elements (e.g. the link in the unpublished error card) show the
 * pointer cursor to signal they are clickable, rather than inheriting the text
 * cursor from the selectable sync block content.
 *
 * Kept as the sole export of this file, and separate from
 * syncBlockTextSelectionStyles, so it can be gated behind the
 * platform_editor_sync_block_activation experiment at the call site. The
 * text-selection styles ship under the fully rolled-out
 * platform_synced_block_patch_14, so the cursor could not be folded into them
 * without shipping ungated.
 *
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const syncBlockInteractiveCursorStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.${SyncBlockSharedCssClassName.renderer}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'a[href], button, [role="button"], [role="link"]': {
			cursor: 'pointer',
		},
	},
});
