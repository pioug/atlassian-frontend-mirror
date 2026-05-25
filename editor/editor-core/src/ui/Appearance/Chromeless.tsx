import React, { Fragment, type FC } from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { EditorAppearance, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugins/editor-viewmode';
import type {
	MaxContentSizePlugin,
	MaxContentSizePluginState,
} from '@atlaskit/editor-plugins/max-content-size';
import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { EditorAppearanceComponentProps } from '../../types';
import EditorContentContainer from '../EditorContentContainer/EditorContentContainer';
import PluginSlot from '../PluginSlot';
import WithFlash from '../WithFlash';

import { ChromelessEditorContainerCompiled } from './Chromeless-compiled';
import {
	ChromelessEditorContainerEmotion,
	type ChromelessEditorContainerProps,
} from './Chromeless-emotion';

type AppearanceProps = EditorAppearanceComponentProps<
	[OptionalPlugin<MaxContentSizePlugin>, OptionalPlugin<EditorViewModePlugin>]
>;

/**
 * Render the editor in a chromeless appearance.
 * Example use is the inline comment editor, which doesn't have editor toolbar
 */
// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class Editor extends React.Component<AppearanceProps> {
	static displayName = 'ChromelessEditorAppearance';

	private appearance: EditorAppearance = 'chromeless';
	private containerElement: HTMLElement | null = null;

	private setContainerElement = (ref: HTMLElement | null) => {
		this.containerElement = ref;
	};

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

		const editorViewMode = useSharedPluginStateWithSelector(
			this.props.editorAPI,
			['editorViewMode'],
			(states) => states?.editorViewModeState?.mode,
		);

		const containerRef = expValEquals('platform_editor_perf_lint_cleanup', 'isEnabled', true)
			? this.setContainerElement
			: (ref: HTMLElement | null) => (this.containerElement = ref);

		return (
			<WithFlash animate={maxContentSizeReached}>
				<ChromelessEditorContainer
					maxHeight={maxHeight}
					minHeight={minHeight}
					containerRef={containerRef}
				>
					<EditorContentContainer
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
						className="ak-editor-content-area"
						featureFlags={featureFlags}
						viewMode={editorViewMode}
						appearance={this.appearance}
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
					</EditorContentContainer>
				</ChromelessEditorContainer>
			</WithFlash>
		);
	};

	render(): React.JSX.Element {
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
	'use no memo'; // renderChrome should be changed to called as a component not a function
	const maxContentSizeReached = useSharedPluginStateWithSelector(
		editorAPI,
		['maxContentSize'],
		(states) => states?.maxContentSizeState?.maxContentSizeReached,
	);
	const maxContentSize =
		maxContentSizeReached === undefined ? undefined : { maxContentSizeReached };

	return <Fragment>{renderChrome({ maxContentSize })}</Fragment>;
}

/**
 * Container for the chromeless editor appearance. This is used to set the max and min height
 * of the editor content area, and to provide a ref to the container element for the popups.
 * @param param0 props for the chromeless editor container
 * @returns JSX element representing the chromeless editor container
 */
export const ChromelessEditorContainer: FC<
	ChromelessEditorContainerProps & ChromelessEditorContainerProps
> = componentWithCondition(
	() => expValEquals('platform_editor_core_non_ecc_static_css', 'isEnabled', true),
	ChromelessEditorContainerCompiled,
	ChromelessEditorContainerEmotion,
);
