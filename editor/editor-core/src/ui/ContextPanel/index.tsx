/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { injectIntl, type IntlShape } from 'react-intl-next';
import Transition from 'react-transition-group/Transition';

import {
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import { contextPanelMessages } from '@atlaskit/editor-common/messages';
import type { OptionalPlugin, PublicPluginAPI } from '@atlaskit/editor-common/types';
import { ContextPanelConsumer } from '@atlaskit/editor-common/ui';
import { type ContextPanelPlugin } from '@atlaskit/editor-plugins/context-panel';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorContextPanelWidth,
	akEditorSwoopCubicBezier,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

export type Props = {
	visible: boolean;
	editorAPI: PublicPluginAPI<[OptionalPlugin<ContextPanelPlugin>]> | undefined;
	children?: React.ReactElement;
	hasPadding?: boolean;
	customWidth?: number;
};

const ANIM_SPEED_MS = 500;

const panelHidden = css({
	width: 0,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const panel = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: `${akEditorContextPanelWidth}px`,
	height: '100%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	transition: `width ${ANIM_SPEED_MS}ms ${akEditorSwoopCubicBezier}`,
	overflow: 'hidden',
	boxShadow: `inset 2px 0 0 0 ${token('color.border')}`,
});

const disablePanelAnimation = css({
	transition: 'none',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const content = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	transition: `width 600ms ${akEditorSwoopCubicBezier}`,
	boxSizing: 'border-box',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: `${akEditorContextPanelWidth}px`,
	height: '100%',
	overflowY: 'auto',
});

const paddingStyles = css({
	padding: `${token('space.200', '16px')} ${token('space.200', '16px')} 0px`,
});

type SwappableContentAreaProps = {
	pluginContent?: React.ReactNode;
	editorView?: EditorView;
	intl: IntlShape;
} & Props;

type State = {
	mounted: boolean;
	currentPluginContent?: React.ReactNode;
};

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
class SwappableContentAreaInner extends React.PureComponent<SwappableContentAreaProps, State> {
	state = {
		mounted: false,
		currentPluginContent: undefined,
	};

	static getDerivedStateFromProps(props: SwappableContentAreaProps, state: State): State | null {
		if (props.pluginContent !== state.currentPluginContent) {
			return {
				...state,
				currentPluginContent: props.pluginContent,
			};
		}

		return null;
	}

	private unsetPluginContent() {
		this.setState({ currentPluginContent: undefined });
	}
	focusEditor = () => {
		const { editorAPI } = this.props;
		editorAPI?.core?.actions.focus({ scrollIntoView: false });
	};

	componentDidMount() {
		// use this to trigger an animation
		this.setState({
			mounted: true,
		});
	}

	showPluginContent = () => {
		const { pluginContent } = this.props;
		const { currentPluginContent } = this.state;

		if (!currentPluginContent) {
			return;
		}

		const animSpeedMs = fg('platform_editor_disable_context_panel_animation') ? 0 : ANIM_SPEED_MS;

		return (
			<Transition
				timeout={this.state.mounted ? animSpeedMs : 0}
				in={!!pluginContent}
				mountOnEnter
				unmountOnExit
				onExited={() => this.unsetPluginContent()}
			>
				{currentPluginContent}
			</Transition>
		);
	};

	showProvidedContent = (isVisible: boolean) => {
		const { children } = this.props;

		if (!children) {
			return;
		}

		const animSpeedMs = fg('platform_editor_disable_context_panel_animation') ? 0 : ANIM_SPEED_MS;

		return (
			<Transition
				timeout={this.state.mounted ? animSpeedMs : 0}
				in={isVisible}
				mountOnEnter
				unmountOnExit
				onExiting={this.focusEditor}
			>
				{children}
			</Transition>
		);
	};

	render() {
		const width = this.props.customWidth ?? akEditorContextPanelWidth;
		const userVisible = !!this.props.visible;
		const visible = userVisible || !!this.state.currentPluginContent;
		const hasPadding = this.props.hasPadding === undefined ? true : this.props.hasPadding;
		const customPanelWidthStyles = css({
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @repo/internal/react/no-class-components
			width: `${this.props.customWidth}px`,
			overflowX: 'hidden',
		});

		return (
			<ContextPanelConsumer>
				{({ broadcastWidth }) => {
					const contextPanelWidth = visible ? width : 0;
					broadcastWidth(contextPanelWidth);

					return (
						<div
							css={[
								panel,
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/consistent-css-prop-usage
								this.props.customWidth && customPanelWidthStyles,
								!visible && panelHidden,
								fg('platform_editor_disable_context_panel_animation') && disablePanelAnimation,
							]}
							data-testid="context-panel-panel"
							aria-labelledby="context-panel-title"
							aria-label={this.props.intl?.formatMessage(contextPanelMessages.panelLabel) || ''}
							role="dialog"
						>
							<div
								data-testid="context-panel-content"
								css={[
									content,
									hasPadding && paddingStyles,
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/consistent-css-prop-usage
									this.props.customWidth && customPanelWidthStyles,
									!visible && panelHidden,
									fg('platform_editor_disable_context_panel_animation') && disablePanelAnimation,
								]}
							>
								{this.showPluginContent() || this.showProvidedContent(userVisible)}
							</div>
						</div>
					);
				}}
			</ContextPanelConsumer>
		);
	}
}

const useContextPanelSharedState = sharedPluginStateHookMigratorFactory<
	React.ReactNode[] | undefined,
	PublicPluginAPI<[ContextPanelPlugin]> | undefined
>(
	(pluginInjectionApi) => {
		return useSharedPluginStateWithSelector(
			pluginInjectionApi,
			['contextPanel'],
			(states) => states?.contextPanelState?.contents,
		);
	},
	(pluginInjectionApi) => {
		const { contextPanelState } = useSharedPluginState(pluginInjectionApi, ['contextPanel']);
		return contextPanelState?.contents;
	},
);

export const SwappableContentArea = injectIntl(SwappableContentAreaInner);

export function ContextPanel(props: Props) {
	const contextPanelContents = useContextPanelSharedState(props.editorAPI);
	const firstContent = contextPanelContents && contextPanelContents.find(Boolean);

	return (
		<SwappableContentArea
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
			editorAPI={props.editorAPI}
			pluginContent={firstContent}
		/>
	);
}
