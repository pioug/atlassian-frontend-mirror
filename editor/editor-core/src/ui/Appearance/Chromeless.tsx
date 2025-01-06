/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { EditorAppearance, OptionalPlugin } from '@atlaskit/editor-common/types';
import { type EditorViewModePlugin } from '@atlaskit/editor-plugins/editor-viewmode';
import type {
	MaxContentSizePlugin,
	MaxContentSizePluginState,
} from '@atlaskit/editor-plugins/max-content-size';
import { scrollbarStyles } from '@atlaskit/editor-shared-styles/scrollbar';
import { token } from '@atlaskit/tokens';

import type { EditorAppearanceComponentProps } from '../../types';
import { createEditorContentStyle } from '../ContentStyles';
import PluginSlot from '../PluginSlot';
import WithFlash from '../WithFlash';

const chromelessEditorStyles = css(
	{
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '20px',
		height: 'auto',
		overflowX: 'hidden',
		overflowY: 'auto',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	scrollbarStyles,
	{
		maxWidth: 'inherit',
		boxSizing: 'border-box',
		wordWrap: 'break-word',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'div > .ProseMirror': {
			outline: 'none',
			whiteSpace: 'pre-wrap',
			padding: 0,
			margin: 0,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'& > :last-child': {
				paddingBottom: token('space.100', '0.5em'),
			},
		},
	},
);

const ContentArea = createEditorContentStyle();
ContentArea.displayName = 'ContentArea';

type AppearanceProps = EditorAppearanceComponentProps<
	[OptionalPlugin<MaxContentSizePlugin>, OptionalPlugin<EditorViewModePlugin>]
>;

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class Editor extends React.Component<AppearanceProps> {
	static displayName = 'ChromelessEditorAppearance';

	private appearance: EditorAppearance = 'chromeless';
	private containerElement: HTMLElement | null = null;

	private renderChrome = ({ maxContentSize }: { maxContentSize?: MaxContentSizePluginState }) => {
		const {
			editorDOMElement,
			editorView,
			editorActions,
			eventDispatcher,
			providerFactory,
			contentComponents,
			customContentComponents,
			maxHeight,
			minHeight = 30,
			popupsMountPoint,
			popupsBoundariesElement,
			popupsScrollableElement,
			disabled,
			dispatchAnalyticsEvent,
			pluginHooks,
			featureFlags,
		} = this.props;
		const maxContentSizeReached = Boolean(maxContentSize?.maxContentSizeReached);

		const { editorViewModeState } = useSharedPluginState(this.props.editorAPI, ['editorViewMode']);

		return (
			<WithFlash animate={maxContentSizeReached}>
				<div
					css={[
						chromelessEditorStyles,
						maxHeight &&
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
							css({
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
								maxHeight: `${maxHeight}px`,
							}),
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
						css({
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
							minHeight: `${minHeight}px`,
						}),
					]}
					data-testid="chromeless-editor"
					ref={(ref: HTMLElement | null) => (this.containerElement = ref)}
				>
					<ContentArea
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className="ak-editor-content-area"
						featureFlags={featureFlags}
						viewMode={editorViewModeState?.mode}
					>
						{customContentComponents && 'before' in customContentComponents
							? customContentComponents.before
							: customContentComponents}
						<PluginSlot
							editorView={editorView}
							editorActions={editorActions}
							eventDispatcher={eventDispatcher}
							providerFactory={providerFactory}
							appearance={this.appearance}
							items={contentComponents}
							popupsMountPoint={popupsMountPoint}
							popupsBoundariesElement={popupsBoundariesElement}
							popupsScrollableElement={popupsScrollableElement}
							containerElement={this.containerElement}
							disabled={!!disabled}
							dispatchAnalyticsEvent={dispatchAnalyticsEvent}
							wrapperElement={this.containerElement}
							pluginHooks={pluginHooks}
						/>
						{editorDOMElement}
						{customContentComponents && 'after' in customContentComponents
							? customContentComponents.after
							: null}
					</ContentArea>
				</div>
			</WithFlash>
		);
	};

	render() {
		return (
			<RenderWithPluginState editorAPI={this.props.editorAPI} renderChrome={this.renderChrome} />
		);
	}
}

interface PluginStates {
	maxContentSize?: MaxContentSizePluginState;
}

interface RenderChromeProps extends Pick<AppearanceProps, 'editorAPI'> {
	renderChrome: (props: PluginStates) => React.ReactNode;
}

function RenderWithPluginState({ renderChrome, editorAPI }: RenderChromeProps) {
	const { maxContentSizeState } = useSharedPluginState(editorAPI, ['maxContentSize']);

	return <Fragment>{renderChrome({ maxContentSize: maxContentSizeState })}</Fragment>;
}
