// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css } from '@emotion/react';

// Originally copied from scrollStyles in packages/editor/editor-core/src/ui/Appearance/FullPage/StyledComponents.ts
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const fullPageEditorStyles = css({
	flexGrow: 1,
	height: '100%',
	overflowY: 'scroll',
	position: 'relative',
	display: 'flex',
	flexDirection: 'column',
	scrollBehavior: 'smooth',
});
