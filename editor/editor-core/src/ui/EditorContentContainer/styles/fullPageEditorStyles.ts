/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

// Originally copied from scrollStyles in packages/editor/editor-core/src/ui/Appearance/FullPage/StyledComponents.ts
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const fullPageEditorStyles: SerializedStyles = css({
	flexGrow: 1,
	height: '100%',
	overflowY: 'scroll',
	position: 'relative',
	display: 'flex',
	flexDirection: 'column',
	scrollBehavior: 'smooth',
});
