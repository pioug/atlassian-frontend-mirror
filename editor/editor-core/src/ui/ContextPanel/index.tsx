/* eslint-disable jsdoc/require-jsdoc -- Pre-existing lint debt surfaced by this mechanical type-import-only PR. */
import React from 'react';

import { injectIntl } from 'react-intl';
import type { IntlShape, WithIntlProps } from 'react-intl';
import Transition from 'react-transition-group/Transition';

import { getDocument } from '@atlaskit/browser-apis';
import { ContextPanelConsumer } from '@atlaskit/editor-common/context-panel';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { contextPanelMessages } from '@atlaskit/editor-common/messages';
import type { OptionalPlugin, PublicPluginAPI } from '@atlaskit/editor-common/types';
import type { ContextPanelPlugin } from '@atlaskit/editor-plugins/context-panel';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorContextPanelWidth } from '@atlaskit/editor-shared-styles';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { componentWithCondition } from '@atlaskit/platform-feature-flags-react/component-with-condition';
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
};

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
class SwappableContentAreaInner extends React.PureComponent<SwappableContentAreaProps, State> {
	state = {
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

	/**
	 * Returns focus to the editor when the panel starts closing, so keyboard users
	 * are not left with focus on an element that is about to disappear.
	 *
	 * Skipped when focus is already on a live element *outside* the exiting panel:
	 * that means the consumer has restored focus itself (e.g. to the button that
	 * opened the panel, per the WAI-ARIA dialog pattern), and overriding it would
	 * strand keyboard and screen-reader users in the editor.
	 *
	 * @param node The exiting panel content, as passed by `Transition`'s `onExiting`.
	 */
	focusEditor = (node?: HTMLElement) => {
		const { editorAPI } = this.props;

		// `node` can be null here: consumers often clear the panel's children in the
		// same update that hides it, so `Transition` has no DOM node to hand us. Treat
		// that as "focus is not inside the panel" and rely on the active element alone.
		//
		// `Element` rather than `HTMLElement`: focusable SVG elements (e.g. an
		// SVG-based trigger button) are valid focus targets but are not HTMLElements.
		const activeDocument = getDocument();
		const activeElement = activeDocument?.activeElement;
		const focusHeldOutsidePanel =
			!!activeDocument &&
			activeElement instanceof Element &&
			activeElement !== activeDocument.body &&
			activeElement.isConnected &&
			!(node?.contains(activeElement) ?? false);

		if (focusHeldOutsidePanel) {
			return;
		}

		editorAPI?.core?.actions.focus({ scrollIntoView: false });
	};

	showPluginContent = () => {
		const { pluginContent } = this.props;
		const { currentPluginContent } = this.state;

		if (!currentPluginContent) {
			return;
		}

		const onExited = isExperimentEnabled('platform_editor_perf_lint_cleanup')
			? this.handleTransitionExited
			: () => this.unsetPluginContent();

		return (
			<Transition timeout={0} in={!!pluginContent} mountOnEnter unmountOnExit onExited={onExited}>
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
				timeout={0}
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

		return (
			<ContextPanelConsumer>
				{({ broadcastWidth }) => {
					const contextPanelWidth = visible ? width : 0;
					broadcastWidth(contextPanelWidth);

					return (
						<ContextPanelWrapperMigration
							customWidth={this.props.customWidth}
							visible={visible}
							data-testid="context-panel-panel"
							// eslint-disable-next-line @atlassian/a11y/no-empty-aria-label -- Pre-existing; intl should always resolve a label here
							aria-label={this.props.intl?.formatMessage(contextPanelMessages.panelLabel) || ''}
							aria-modal="false"
							role="dialog"
						>
							<ContextPanelContentMigration
								customWidth={this.props.customWidth}
								visible={visible}
								hasPadding={hasPadding}
								data-testid="context-panel-content"
								// Adding tabIndex=0 here to make content focusable as it is a scrollable region
								tabIndex={0}
								role="region"
								aria-label={this.props.intl?.formatMessage(contextPanelMessages.panelContentLabel)}
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

// eslint-disable-next-line @typescript-eslint/no-restricted-types
export const SwappableContentArea: React.FC<WithIntlProps<SwappableContentAreaProps>> & {
	WrappedComponent: React.ComponentType<SwappableContentAreaProps>;
} = injectIntl(SwappableContentAreaInner);

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
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
