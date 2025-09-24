/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { isSSR } from '@atlaskit/editor-common/core-utils';
import { ToolbarSize } from '@atlaskit/editor-common/types';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { WidthObserver } from '@atlaskit/width-detector';

import { isFullPage } from '../../utils/is-full-page';

import { useElementWidth } from './hooks';
import { Toolbar } from './Toolbar';
import { toolbarSizeToWidth, widthToToolbarSize } from './toolbar-size';
import type { ToolbarWithSizeDetectorProps } from './toolbar-types';

const toolbar = css({
	width: '100%',
	position: 'relative',
});

export const ToolbarWithSizeDetector = (props: ToolbarWithSizeDetectorProps) => {
	const ref = React.useRef<HTMLDivElement>(null);
	const [width, setWidth] = React.useState<number | undefined>(undefined);
	const elementWidth = useElementWidth(ref, {
		skip: typeof width !== 'undefined',
	});

	const defaultToolbarSize = isSSR() && isFullPage(props.appearance) ? ToolbarSize.XXL : undefined;
	const toolbarSize =
		typeof width === 'undefined' && typeof elementWidth === 'undefined'
			? defaultToolbarSize
			: // Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				widthToToolbarSize((width || elementWidth)!, props.appearance);

	const minWidthValue = useMemo<string>((): string => {
		if (props.hasMinWidth) {
			const toolbarWidth =
				isFullPage(props.appearance) && props.twoLineEditorToolbar ? ToolbarSize.S : ToolbarSize.M;
			return `${toolbarSizeToWidth(toolbarWidth, props.appearance)}px`;
		} else {
			const isPreviewPanelResponsivenessEnabled = editorExperiment(
				'platform_editor_preview_panel_responsiveness',
				true,
				{
					exposure: true,
				},
			);
			return isPreviewPanelResponsivenessEnabled ? 'fit-content' : '254px';
		}
	}, [props.appearance, props.hasMinWidth, props.twoLineEditorToolbar]);

	return (
		<div css={toolbar} style={{ minWidth: minWidthValue }}>
			<WidthObserver setWidth={setWidth} />
			{props.editorView && toolbarSize ? (
				<Toolbar
					toolbarSize={toolbarSize}
					items={props.items}
					editorView={props.editorView}
					editorActions={props.editorActions}
					eventDispatcher={props.eventDispatcher}
					providerFactory={props.providerFactory}
					appearance={props.appearance}
					popupsMountPoint={props.popupsMountPoint}
					popupsBoundariesElement={props.popupsBoundariesElement}
					popupsScrollableElement={props.popupsScrollableElement}
					disabled={props.disabled}
					dispatchAnalyticsEvent={props.dispatchAnalyticsEvent}
					containerElement={props.containerElement}
					hasMinWidth={props.hasMinWidth}
					twoLineEditorToolbar={props.twoLineEditorToolbar}
				/>
			) : (
				<div ref={ref} />
			)}
		</div>
	);
};
