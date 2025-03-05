/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

const separator = css({
	background: token('color.border'),
	width: '1px',
	height: '20px',
	margin: `0 ${token('space.050', '4px')}`,
	alignSelf: 'center',
});

const separatorNew = css({
	background: token('color.border'),
	width: '1px',
	height: '20px',
	alignSelf: 'center',
});

const separatorFullHeight = css({
	height: '40px',
});

export default ({ fullHeight }: { fullHeight?: boolean }) => (
	<div
		css={[
			editorExperiment('platform_editor_controls', 'variant1') ? separatorNew : separator,
			fullHeight && separatorFullHeight,
		]}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className="separator"
	/>
);
