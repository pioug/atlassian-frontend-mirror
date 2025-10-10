/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { EditorAppearance, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugins/editor-viewmode';
import type {
	MaxContentSizePlugin,
	MaxContentSizePluginState,
} from '@atlaskit/editor-plugins/max-content-size';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import type { EditorAppearanceComponentProps } from '../../types';
import EditorContentContainer from '../EditorContentContainer/EditorContentContainer';
import PluginSlot from '../PluginSlot';
import WithFlash from '../WithFlash';

const scrollbarStylesNew = css({
	msOverflowStyle: '-ms-autohiding-scrollbar',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&::-webkit-scrollbar-corner': {
		display: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&::-webkit-scrollbar-thumb': {
		backgroundColor: token('color.background.neutral.subtle'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:hover::-webkit-scrollbar-thumb': {
		backgroundColor: token('color.background.neutral.bold'),
		borderRadius: token('radius.large'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&::-webkit-scrollbar-thumb:hover': {
		backgroundColor: token('color.background.neutral.bold.hovered'),
	},
});

const chromelessEditorStylesNew = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '20px',
	height: 'auto',
	overflowX: 'hidden',
	overflowY: 'auto',
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
});

const extraSpaceLastLineFix = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'& > p:last-of-type': {
			marginBottom: token('space.0'),
		},
	},
});

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

		return (
			<WithFlash animate={maxContentSizeReached}>
				<ChromelessEditorContainer
					maxHeight={maxHeight}
					minHeight={minHeight}
					containerRef={(ref: HTMLElement | null) => (this.containerElement = ref)}
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
	const maxContentSizeReached = useSharedPluginStateWithSelector(
		editorAPI,
		['maxContentSize'],
		(states) => states?.maxContentSizeState?.maxContentSizeReached,
	);
	const maxContentSize =
		maxContentSizeReached === undefined ? undefined : { maxContentSizeReached };

	return <Fragment>{renderChrome({ maxContentSize })}</Fragment>;
}

interface ChromelessEditorContainerProps {
	children: React.ReactNode;
	containerRef?: (ref: HTMLElement | null) => void;
	maxHeight?: number;
	minHeight: number;
}

export function ChromelessEditorContainer({
	maxHeight,
	minHeight,
	children,
	containerRef,
}: ChromelessEditorContainerProps) {
	return (
		<div
			css={[
				chromelessEditorStylesNew,
				scrollbarStylesNew,
				fg('platform_fix_extra_space_last_line_comment_editor') && extraSpaceLastLineFix,
			]}
			style={{
				maxHeight: maxHeight ? `${maxHeight}px` : undefined,
				minHeight: `${minHeight}px`,
			}}
			data-testid="chromeless-editor"
			id="chromeless-editor"
			ref={containerRef}
		>
			{children}
		</div>
	);
}
