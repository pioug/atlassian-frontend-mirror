/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import Transition from 'react-transition-group/Transition';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { OptionalPlugin, PublicPluginAPI } from '@atlaskit/editor-common/types';
import { ContextPanelConsumer } from '@atlaskit/editor-common/ui';
import { type ContextPanelPlugin } from '@atlaskit/editor-plugins/context-panel';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorContextPanelWidth,
	akEditorSwoopCubicBezier,
} from '@atlaskit/editor-shared-styles';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export type Props = {
	visible: boolean;
	editorAPI: PublicPluginAPI<[OptionalPlugin<ContextPanelPlugin>]> | undefined;
	children?: React.ReactElement;
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
	boxShadow: `inset 2px 0 0 0 ${token('color.border', N30)}`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const content = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	transition: `width 600ms ${akEditorSwoopCubicBezier}`,
	boxSizing: 'border-box',
	padding: `${token('space.200', '16px')} ${token('space.200', '16px')} 0px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: `${akEditorContextPanelWidth}px`,
	height: '100%',
	overflowY: 'auto',
});

type SwappableContentAreaProps = {
	pluginContent?: React.ReactNode;
	editorView?: EditorView;
} & Props;

type State = {
	mounted: boolean;
	currentPluginContent?: React.ReactNode;
};

export class SwappableContentArea extends React.PureComponent<SwappableContentAreaProps, State> {
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

		return (
			<Transition
				timeout={this.state.mounted ? ANIM_SPEED_MS : 0}
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

		return (
			<Transition
				timeout={this.state.mounted ? ANIM_SPEED_MS : 0}
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
		const width = akEditorContextPanelWidth;
		const userVisible = !!this.props.visible;
		const visible = userVisible || !!this.state.currentPluginContent;

		return (
			<ContextPanelConsumer>
				{({ broadcastWidth }) => {
					const contextPanelWidth = visible ? width : 0;
					broadcastWidth(contextPanelWidth);

					return (
						<div
							css={[panel, !visible && panelHidden]}
							data-testid="context-panel-panel"
							aria-labelledby="context-panel-title"
							role="dialog"
						>
							<div data-testid="context-panel-content" css={[content, !visible && panelHidden]}>
								{this.showPluginContent() || this.showProvidedContent(userVisible)}
							</div>
						</div>
					);
				}}
			</ContextPanelConsumer>
		);
	}
}

export function ContextPanel(props: Props) {
	const { contextPanelState } = useSharedPluginState(props.editorAPI, ['contextPanel']);

	const firstContent = contextPanelState && contextPanelState?.contents?.find(Boolean);

	return (
		<SwappableContentArea {...props} editorAPI={props.editorAPI} pluginContent={firstContent} />
	);
}
