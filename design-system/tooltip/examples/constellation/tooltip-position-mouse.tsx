/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, useRef, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import {
	PanelSplitter,
	PanelSplitterProvider,
	type ResizeBounds,
} from '@atlaskit/navigation-system/layout/panel-splitter';
import { token } from '@atlaskit/tokens';

const widthVar = '--panel-width';
const resizingCssVar = '--panel-splitter-resizing';

const styles = cssMap({
	root: {
		width: `var(${resizingCssVar}, var(${widthVar}))`,
		height: '200px',
		position: 'relative',
		backgroundColor: token('color.background.accent.gray.subtlest'),
		borderInlineEnd: `${token('border.width')} solid ${token('color.border')}`,
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
});

function getResizeBounds(): ResizeBounds {
	return { min: '150px', max: '400px' };
}

const PanelSplitterWithTooltipAndShortcut = (): JSX.Element => {
	const panelSplitterParentRef = useRef<HTMLDivElement | null>(null);
	const [width, setWidth] = useState(300);

	return (
		<div
			ref={panelSplitterParentRef}
			css={styles.root}
			style={
				{
					[widthVar]: `${width}px`,
				} as CSSProperties
			}
		>
			Resize me! Hover or focus on the right edge
			<br />
			<PanelSplitterProvider
				panelRef={panelSplitterParentRef}
				panelWidth={width}
				onCompleteResize={setWidth}
				getResizeBounds={getResizeBounds}
				resizingCssVar={resizingCssVar}
				position="end"
				shortcut={['Ctrl', '[']}
			>
				<PanelSplitter
					label="Resize panel"
					testId="panel-splitter"
					tooltipContent="Collapse panel"
				/>
			</PanelSplitterProvider>
		</div>
	);
};

export default PanelSplitterWithTooltipAndShortcut;
