/* eslint-disable jsdoc/require-jsdoc -- Pre-existing lint debt surfaced by this mechanical type-import-only PR. */
import React from 'react';

import { injectIntl } from 'react-intl';
import type { IntlShape, WithIntlProps } from 'react-intl';
import Transition from 'react-transition-group/Transition';

import { ContextPanelConsumer } from '@atlaskit/editor-common/context-panel';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { contextPanelMessages } from '@atlaskit/editor-common/messages';
import type { OptionalPlugin, PublicPluginAPI } from '@atlaskit/editor-common/types';
import type { ContextPanelPlugin } from '@atlaskit/editor-plugins/context-panel';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorContextPanelWidth } from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { ContextPanelContentCompiled, ContextPanelWrapperCompiled } from './index-compiled';
import { ContextPanelContentEmotion, ContextPanelWrapperEmotion } from './index-emotion';

export type Props = {
	children?: React.ReactElement;
	customWidth?: number;
	editorAPI: PublicPluginAPI<[OptionalPlugin<ContextPanelPlugin>]> | undefined;
	hasPadding?: boolean;
	visible: boolean;
};

const ANIM_SPEED_MS = 500;

const ContextPanelWrapperMigration = componentWithCondition(
	() => expValEquals('platform_editor_core_non_ecc_static_css', 'isEnabled', true),
	ContextPanelWrapperCompiled,
	ContextPanelWrapperEmotion,
);

const ContextPanelContentMigration = componentWithCondition(
	() => expValEquals('platform_editor_core_non_ecc_static_css', 'isEnabled', true),
	ContextPanelContentCompiled,
	ContextPanelContentEmotion,
);

type SwappableContentAreaProps = {
	editorView?: EditorView;
	intl: IntlShape;
	pluginContent?: React.ReactNode;
} & Props;

type State = {
	currentPluginContent?: React.ReactNode;
	mounted: boolean;
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

	private handleTransitionExited = () => {
		this.unsetPluginContent();
	};

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

		const onExited = expValEquals('platform_editor_perf_lint_cleanup', 'isEnabled', true)
			? this.handleTransitionExited
			: () => this.unsetPluginContent();

		return (
			<Transition
				timeout={this.state.mounted ? animSpeedMs : 0}
				in={!!pluginContent}
				mountOnEnter
				unmountOnExit
				onExited={onExited}
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
		const disableAnimation = fg('platform_editor_disable_context_panel_animation');

		return (
			<ContextPanelConsumer>
				{({ broadcastWidth }) => {
					const contextPanelWidth = visible ? width : 0;
					broadcastWidth(contextPanelWidth);

					return (
						<ContextPanelWrapperMigration
							customWidth={this.props.customWidth}
							visible={visible}
							disableAnimation={disableAnimation}
							data-testid="context-panel-panel"
							// eslint-disable-next-line @atlassian/a11y/no-empty-aria-label -- Pre-existing; intl should always resolve a label here
							aria-label={this.props.intl?.formatMessage(contextPanelMessages.panelLabel) || ''}
							aria-modal="false"
							role="dialog"
						>
							<ContextPanelContentMigration
								customWidth={this.props.customWidth}
								visible={visible}
								disableAnimation={disableAnimation}
								hasPadding={hasPadding}
								data-testid="context-panel-content"
								// Adding tabIndex=0 here to make content focusable as it is a scrollable region
								tabIndex={fg('platform_editor_nov_a11y_fixes') ? 0 : undefined}
								role={fg('platform_editor_nov_a11y_fixes') ? 'region' : undefined}
								aria-label={
									fg('platform_editor_nov_a11y_fixes')
										? this.props.intl?.formatMessage(contextPanelMessages.panelContentLabel)
										: undefined
								}
							>
								{this.showPluginContent() || this.showProvidedContent(userVisible)}
							</ContextPanelContentMigration>
						</ContextPanelWrapperMigration>
					);
				}}
			</ContextPanelConsumer>
		);
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const SwappableContentArea: React.FC<WithIntlProps<SwappableContentAreaProps>> & {
	WrappedComponent: React.ComponentType<SwappableContentAreaProps>;
} = injectIntl(SwappableContentAreaInner);

export function ContextPanel(props: Props): React.JSX.Element {
	const contextPanelContents = useSharedPluginStateWithSelector(
		props.editorAPI,
		['contextPanel'],
		(states) => states?.contextPanelState?.contents,
	);
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
