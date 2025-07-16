/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, useCallback, useRef, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { OpenLayerObserver } from '@atlaskit/layering/experimental/open-layer-observer';
import {
	PanelSplitter,
	PanelSplitterProvider,
	type ResizeBounds,
} from '@atlaskit/navigation-system/layout/panel-splitter';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const widthVar = '--panel-width';
const resizingCssVar = '--panel-splitter-resizing';

const styles = cssMap({
	root: {
		width: `var(${resizingCssVar}, var(${widthVar}))`,
		height: '300px',
		position: 'relative',
		backgroundColor: token('color.background.accent.yellow.subtlest'),
	},
	positionEnd: {
		borderInlineEnd: `${token('border.width')} solid ${token('color.border')}`,
	},
	positionStart: {
		borderInlineStart: `${token('border.width')} solid ${token('color.border')}`,
	},
});

export const PanelSplitterWithPixelBounds = () => {
	const panelSplitterParentRef = useRef<HTMLDivElement | null>(null);
	const [width, setWidth] = useState(300);

	const getResizeBounds = useCallback((): ResizeBounds => {
		return { min: '100px', max: '600px' };
	}, []);

	return (
		// PanelSplitter accesses the open layer observer, so needs to be wrapped in the provider.
		// In apps using nav4 correctly, the OpenLayerObserver is provided by `Root`.
		<OpenLayerObserver>
			<div
				ref={panelSplitterParentRef}
				css={[styles.root, styles.positionEnd]}
				style={
					{
						[widthVar]: `${width}px`,
					} as CSSProperties
				}
			>
				Resize me! Min: 100px, Max: 600px
				<PanelSplitterProvider
					panelRef={panelSplitterParentRef}
					panelWidth={width}
					onCompleteResize={setWidth}
					getResizeBounds={getResizeBounds}
					resizingCssVar={resizingCssVar}
				>
					<PanelSplitter label="Resize panel" testId="panel-splitter" />
				</PanelSplitterProvider>
			</div>
		</OpenLayerObserver>
	);
};

export const PanelSplitterWithRelativeBounds = () => {
	const panelSplitterParentRef = useRef<HTMLDivElement | null>(null);
	const [width, setWidth] = useState(300);

	const getResizeBounds = useCallback((): ResizeBounds => {
		return { min: '5vw', max: '50vw' };
	}, []);

	return (
		// PanelSplitter accesses the open layer observer, so needs to be wrapped in the provider.
		// In apps using nav4 correctly, the OpenLayerObserver is provided by `Root`.
		<OpenLayerObserver>
			<div
				ref={panelSplitterParentRef}
				css={[styles.root, styles.positionEnd]}
				style={
					{
						[widthVar]: `${width}px`,
					} as CSSProperties
				}
			>
				Resize me! Min: 5vw, Max: 50vw
				<PanelSplitterProvider
					panelRef={panelSplitterParentRef}
					panelWidth={width}
					onCompleteResize={setWidth}
					getResizeBounds={getResizeBounds}
					resizingCssVar={resizingCssVar}
				>
					<PanelSplitter label="Resize panel" testId="panel-splitter" />
				</PanelSplitterProvider>
			</div>
		</OpenLayerObserver>
	);
};

export const PanelSplitterPositionStart = () => {
	const panelSplitterParentRef = useRef<HTMLDivElement | null>(null);
	const [width, setWidth] = useState(300);

	const getResizeBounds = useCallback((): ResizeBounds => {
		return { min: '100px', max: '600px' };
	}, []);

	return (
		// PanelSplitter accesses the open layer observer, so needs to be wrapped in the provider.
		// In apps using nav4 correctly, the OpenLayerObserver is provided by `Root`.
		<OpenLayerObserver>
			<div
				ref={panelSplitterParentRef}
				css={[styles.root, styles.positionStart]}
				style={
					{
						[widthVar]: `${width}px`,
					} as CSSProperties
				}
			>
				Resize me! Min: 100px, Max: 500px
				<br />
				Position: start
				<PanelSplitterProvider
					panelRef={panelSplitterParentRef}
					panelWidth={width}
					onCompleteResize={setWidth}
					getResizeBounds={getResizeBounds}
					resizingCssVar={resizingCssVar}
					position="start"
				>
					<PanelSplitter label="Resize panel" testId="panel-splitter" />
				</PanelSplitterProvider>
			</div>
		</OpenLayerObserver>
	);
};

export const PanelSplitterPositionEnd = () => {
	const panelSplitterParentRef = useRef<HTMLDivElement | null>(null);
	const [width, setWidth] = useState(300);

	const getResizeBounds = useCallback((): ResizeBounds => {
		return { min: '100px', max: '600px' };
	}, []);

	return (
		// PanelSplitter accesses the open layer observer, so needs to be wrapped in the provider.
		// In apps using nav4 correctly, the OpenLayerObserver is provided by `Root`.
		<OpenLayerObserver>
			<div
				ref={panelSplitterParentRef}
				css={[styles.root, styles.positionEnd]}
				style={
					{
						[widthVar]: `${width}px`,
					} as CSSProperties
				}
			>
				Resize me! Min: 100px, Max: 500px
				<br />
				Position: end
				<PanelSplitterProvider
					panelRef={panelSplitterParentRef}
					panelWidth={width}
					onCompleteResize={setWidth}
					getResizeBounds={getResizeBounds}
					resizingCssVar={resizingCssVar}
					position="end"
				>
					<PanelSplitter label="Resize panel" testId="panel-splitter" />
				</PanelSplitterProvider>
			</div>
		</OpenLayerObserver>
	);
};

const Example = () => (
	<div>
		<PanelSplitterWithPixelBounds />
		<br />
		<PanelSplitterWithRelativeBounds />
		<br />
		<Inline grow="fill" alignInline="end">
			<PanelSplitterPositionStart />
		</Inline>
	</div>
);

export default Example;
