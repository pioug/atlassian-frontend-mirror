/* eslint-disable @atlaskit/design-system/use-tokens-shape,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */
/* eslint-disable @atlaskit/ui-styling-standard/use-compiled */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const ruleStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror hr': {
		border: 'none',
		backgroundColor: token('color.border'),
		height: '2px',
		borderRadius: '1px', // this should use token('radius.full') but cannot since the element has padding which increases its height beyond 2px
		cursor: 'pointer',
		padding: `${token('space.050')} 0`,
		margin: `${token('space.300')} 0`,
		backgroundClip: 'content-box',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror hr.${akEditorSelectedNodeClassName}`]: {
		outline: 'none',
		backgroundColor: token('color.border.selected'),
	},
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const dangerRuleStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror hr.${akEditorSelectedNodeClassName}.danger`]: {
		backgroundColor: token('color.border.danger'),
	},
});
