/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { isSSR } from '@atlaskit/editor-common/core-utils';
import { ToolbarSize } from '@atlaskit/editor-common/types';
import { akEditorMobileMaxWidth } from '@atlaskit/editor-shared-styles';
import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';
import { WidthObserver } from '@atlaskit/width-detector';

import { isFullPage } from '../../utils/is-full-page';

import { useElementWidth } from './hooks';
import { Toolbar } from './Toolbar';
import { toolbarSizeToWidth, widthToToolbarSize } from './toolbar-size';
import type { ToolbarWithSizeDetectorProps } from './toolbar-types';

// Remove when platform_editor_core_static_emotion is cleaned up
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

// Rename to toolbar when platform_editor_core_static_emotion is cleaned up
const staticToolbar = css({
	width: '100%',
	position: 'relative',
	// The media query below has been commented out as akEditorMobileMaxWidth is 0px  and thus the styles are never applied.
	// [`@media (max-width: ${akEditorMobileMaxWidth}px)`]: {
	//   gridColumn: '1 / 2',
	//   gridRow: 2,
	//   width: 'calc(100% - 30px)',
	//   margin: `0 ${token('space.200', '16px')}`,
	// },
});

const DynamicStyleToolbarWithSizeDetector = (props: ToolbarWithSizeDetectorProps) => {
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

	const toolbarStyle = useMemo(() => {
		const toolbarWidth =
			isFullPage(props.appearance) && props.twoLineEditorToolbar ? ToolbarSize.S : ToolbarSize.M;
		const toolbarMinWidth = toolbarSizeToWidth(toolbarWidth, props.appearance);
		const isPreviewPanelResponsivenessEnabled = expValEquals(
			'platform_editor_preview_panel_responsiveness',
			'isEnabled',
			true,
		);
		const minWidth = `min-width: ${props.hasMinWidth ? `${toolbarMinWidth}px` : isPreviewPanelResponsivenessEnabled ? 'fit-content' : '254px'}`;
		return [toolbar, minWidth];
	}, [props.appearance, props.hasMinWidth, props.twoLineEditorToolbar]);

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		<div css={toolbarStyle}>
			<WidthObserver setWidth={setWidth} />
			{props.editorView && toolbarSize ? (
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				<Toolbar {...props} toolbarSize={toolbarSize} />
			) : (
				<div ref={ref} />
			)}
		</div>
	);
};

const StaticStyleToolbarWithSizeDetector = (props: ToolbarWithSizeDetectorProps) => {
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
			const isPreviewPanelResponsivenessEnabled = expValEquals(
				'platform_editor_preview_panel_responsiveness',
				'isEnabled',
				true,
			);
			return isPreviewPanelResponsivenessEnabled ? 'fit-content' : '254px';
		}
	}, [props.appearance, props.hasMinWidth, props.twoLineEditorToolbar]);

	return (
		<div css={staticToolbar} style={{ minWidth: minWidthValue }}>
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

export const ToolbarWithSizeDetector = componentWithCondition(
	() => expValEquals('platform_editor_core_static_emotion_non_central', 'isEnabled', true),
	StaticStyleToolbarWithSizeDetector,
	DynamicStyleToolbarWithSizeDetector,
);
