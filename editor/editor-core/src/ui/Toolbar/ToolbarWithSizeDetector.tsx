/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { akEditorMobileMaxWidth } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';
import { WidthObserver } from '@atlaskit/width-detector';

import { isFullPage } from '../../utils/is-full-page';

import { useElementWidth } from './hooks';
import { Toolbar } from './Toolbar';
import { toolbarSizeToWidth, widthToToolbarSize } from './toolbar-size';
import type { ToolbarWithSizeDetectorProps } from './toolbar-types';
import { ToolbarSize } from './types';

const toolbar = css({
	width: '100%',
	position: 'relative',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`@media (max-width: ${akEditorMobileMaxWidth}px)`]: {
		gridColumn: '1 / 2',
		gridRow: 2,
		width: 'calc(100% - 30px)',
		margin: `0 ${token('space.200', '16px')}`,
	},
});

export const ToolbarWithSizeDetector = (props: ToolbarWithSizeDetectorProps) => {
	const ref = React.useRef<HTMLDivElement>(null);
	const [width, setWidth] = React.useState<number | undefined>(undefined);
	const elementWidth = useElementWidth(ref, {
		skip: typeof width !== 'undefined',
	});

	const toolbarSize =
		typeof width === 'undefined' && typeof elementWidth === 'undefined'
			? undefined
			: widthToToolbarSize((width || elementWidth)!, props.appearance);

	const toolbarStyle = useMemo(() => {
		const toolbarWidth =
			isFullPage(props.appearance) && props.twoLineEditorToolbar ? ToolbarSize.S : ToolbarSize.M;
		const toolbarMinWidth = toolbarSizeToWidth(toolbarWidth, props.appearance);
		const minWidth = `min-width: ${props.hasMinWidth ? toolbarMinWidth : '254'}px`;
		return [toolbar, minWidth];
	}, [props.appearance, props.hasMinWidth, props.twoLineEditorToolbar]);

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		<div css={toolbarStyle}>
			<WidthObserver setWidth={setWidth} />
			{props.editorView && toolbarSize ? (
				<Toolbar {...props} toolbarSize={toolbarSize} />
			) : (
				<div ref={ref} />
			)}
		</div>
	);
};
