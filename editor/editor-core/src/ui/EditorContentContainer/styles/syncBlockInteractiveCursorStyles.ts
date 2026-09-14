/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import {
	SyncBlockLabelSharedCssClassName,
	SyncBlockSharedCssClassName,
} from '@atlaskit/editor-common/sync-block';
import { token } from '@atlaskit/tokens';

/**
 * Styles for the synced block activation experience:
 * - Interactive elements show a pointer cursor rather than inheriting the
 *   selectable content's text cursor.
 * - Border labels can show substantially more reference-title text without
 *   overflowing narrow synced blocks.
 *
 * Kept as the sole export of this file, and separate from
 * syncBlockTextSelectionStyles, so it can be gated behind the
 * platform_editor_sync_block_activation experiment at the call site. The
 * text-selection styles are now always applied.
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
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
		maxWidth: `min(300px, calc(100% - ${token('space.300')}))`,
	},
});
