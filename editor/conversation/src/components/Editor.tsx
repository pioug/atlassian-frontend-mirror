/* eslint-disable @atlaskit/design-system/no-styled-tagged-template-expression -- needs manual remediation */
import React from 'react';
import debounce from 'lodash/debounce';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from 'styled-components';
import AkAvatar from '@atlaskit/avatar';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

import type { EditorActions, EditorProps } from '@atlaskit/editor-core';
import {
	EditorContext,
	WithEditorActions,
	CollapsedEditor,
	ToolbarHelp,
	name as packageName,
	version as packageVersion,
} from '@atlaskit/editor-core';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import {
	useUniversalPreset,
	type InitialPluginConfiguration,
} from '@atlaskit/editor-core/preset-universal';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { type HelpDialogPlugin } from '@atlaskit/editor-plugins/help-dialog';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { fg } from '@atlaskit/platform-feature-flags';

import type { User } from '../model';

// See https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
// https://developer.mozilla.org/en-US/docs/Web/API/Event/returnValue
interface UnloadEvent extends Event {
	returnValue: any;
}

// This is a stop-gap for preventing the user from losing their work. Eventually
// this will be replaced with drafts/auto-save functionality
function beforeUnloadHandler(e: UnloadEvent) {
	// The beforeUnload dialog is implemented inconsistently.
	// The following is the most cross-browser approach.
	const confirmationMessage =
		'You have an unsaved comment. Are you sure you want to leave without saving?';
	e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
	return confirmationMessage; // Gecko, WebKit, Chrome <34
}

export interface Props {
	defaultValue?: any;
	isExpanded?: boolean;
	onCancel?: () => void;
	onSave?: (value: any) => void;
	onClose?: () => void;
	onOpen?: () => void;
	isEditing?: boolean;
	onChange?: (value: any) => void;
	showBeforeUnloadWarning?: boolean;

	// Provider
	dataProviders?: ProviderFactory;
	user?: User;

	// Editor
	renderEditor?: (Editor: typeof ComposableEditor, props: EditorProps) => JSX.Element;
	placeholder?: string;
	disableScrollTo?: boolean;
	allowFeedbackAndHelpButtons?: boolean;
}

export interface State {
	isExpanded?: boolean;
	isEditing?: boolean;
}

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Container: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
	/* -ms- properties are necessary until MS supports the latest version of the grid spec */
	/* stylelint-disable value-no-vendor-prefix, declaration-block-no-duplicate-properties */
	display: -ms-grid;
	display: grid;
	-ms-grid-columns: auto 1fr;
	/* stylelint-enable */
	grid-template:
		'avatar-area editor-area'
		/ auto 1fr;
	padding-top: 16px;
	position: relative;

	&:first-child,
	&:first-of-type {
		padding-top: 0;
	}
`;

const AvatarSection: React.ComponentClass<
	React.HTMLAttributes<{}>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
> = styled.div`
	/* stylelint-disable value-no-vendor-prefix */
	-ms-grid-row: 1;
	-ms-grid-column: 1;
	/* stylelint-enable */
	grid-area: avatar-area;
	margin-right: 8px;
`;

const EditorSection: React.ComponentClass<
	React.HTMLAttributes<{}>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
> = styled.div`
	/* stylelint-disable value-no-vendor-prefix */
	-ms-grid-row: 1;
	-ms-grid-column: 2;
	/* stylelint-enable */
	grid-area: editor-area;
	/* min-width: 0; behavior is described here https://stackoverflow.com/a/43312314 */
	min-width: 0;
`;

export default class Editor extends React.Component<Props, State> {
	private readonly beforeUnloadHandler: any;

	constructor(props: Props) {
		super(props);

		this.state = {
			isExpanded: props.isExpanded,
			isEditing: props.isEditing,
		};

		this.beforeUnloadHandler = beforeUnloadHandler.bind({});
	}

	componentDidMount() {
		if (this.state.isExpanded && this.props.onOpen) {
			this.props.onOpen();
		}
	}

	UNSAFE_componentWillUpdate(_nextProps: Props, nextState: State) {
		if (!fg('platform_editor_react18_phase2_v2')) {
			if (nextState.isExpanded && !this.state.isExpanded && this.props.onOpen) {
				this.props.onOpen();
			} else if (!nextState.isExpanded && this.state.isExpanded && this.props.onClose) {
				this.props.onClose();
			}
		}
	}

	getSnapshotBeforeUpdate(_nextProps: Props, nextState: State) {
		if (fg('platform_editor_react18_phase2_v2')) {
			if (nextState.isExpanded && !this.state.isExpanded && this.props.onOpen) {
				this.props.onOpen();
			} else if (!nextState.isExpanded && this.state.isExpanded && this.props.onClose) {
				this.props.onClose();
			}
		}
	}

	componentDidUpdate(prevProps: Readonly<Props>): void {
		const { showBeforeUnloadWarning } = this.props;

		if (!showBeforeUnloadWarning && prevProps.showBeforeUnloadWarning !== showBeforeUnloadWarning) {
			this.removeBeforeUnloadListener();
		}
	}

	componentWillUnmount() {
		this.removeBeforeUnloadListener();

		if (this.props.onClose) {
			this.props.onClose();
		}
	}

	private removeBeforeUnloadListener() {
		if (this.props.showBeforeUnloadWarning) {
			window.removeEventListener('beforeunload', this.beforeUnloadHandler);
		}
	}

	private onFocus = () => this.setState((prevState) => ({ isExpanded: !prevState.isExpanded }));

	private onCancel = () => {
		if (this.props.onCancel) {
			this.props.onCancel();
			// Make sure to remove the listener since canceling
			// clears the editor content. This fixes a bug where the
			// alert was showing even though a user didn't have any
			// in-progress content in the current editor.
			this.removeBeforeUnloadListener();
		}

		this.setState({
			isExpanded: false,
			isEditing: false,
		});
	};

	private onSave = async (actions: any) => {
		if (this.props.onSave) {
			const value = await actions.getValue();

			if (value && value.content.some((n: any) => n.content && n.content.length)) {
				this.props.onSave(value);
				actions.clear();
				this.removeBeforeUnloadListener();
			} else {
				this.onCancel();
				return;
			}
		}

		this.setState({
			isExpanded: false,
			isEditing: false,
		});
	};

	private isEditorValueEmpty = (value: any): boolean => {
		return (
			value.content.length === 0 ||
			(value.content.length === 1 && value.content[0].content.length === 0)
		);
	};

	private onChange = async (actions: EditorActions) => {
		const value = await actions.getValue();

		if (!!this.isEditorValueEmpty(value)) {
			this.removeBeforeUnloadListener();
		} else {
			if (this.props.showBeforeUnloadWarning) {
				window.addEventListener('beforeunload', this.beforeUnloadHandler);
			}
		}

		if (this.props.onChange) {
			this.props.onChange(value);
		}
	};

	private renderEditor = (actions: EditorActions) => {
		const { dataProviders, renderEditor, defaultValue, placeholder, allowFeedbackAndHelpButtons } =
			this.props;
		let providers: Record<number, any> = {};

		// @TODO Remove and just pass the factory through once AkEditor is updated
		if (dataProviders) {
			(dataProviders as any).providers.forEach((provider: any, key: number) => {
				providers[key] = provider;
			});
		}

		const defaultProps: EditorProps = {
			appearance: 'comment',
			disabled: false,
			extensionHandlers: {},
			quickInsert: true,
			shouldFocus: true,
			onSave: () => this.onSave(actions),
			onCancel: this.onCancel,
			onChange: debounce(() => this.onChange(actions), 250),
			defaultValue,
			allowHelpDialog: allowFeedbackAndHelpButtons,
			feedbackInfo: allowFeedbackAndHelpButtons
				? {
						packageVersion: packageVersion,
						packageName: packageName,
					}
				: undefined,
			...providers,
		};

		return (
			<div>
				<CollapsedEditor
					placeholder={placeholder}
					isExpanded={this.state.isExpanded}
					onFocus={this.onFocus}
				>
					{renderEditor ? (
						renderEditor(
							(props) => (
								<ComposableEditorWrapper
									allowFeedbackAndHelpButtons={allowFeedbackAndHelpButtons ?? false}
									props={props}
								/>
							),
							defaultProps,
						)
					) : (
						<ComposableEditorWrapper
							allowFeedbackAndHelpButtons={allowFeedbackAndHelpButtons ?? false}
							props={defaultProps}
						/>
					)}
				</CollapsedEditor>
			</div>
		);
	};

	renderAvatar() {
		const { isEditing } = this.state;
		const { user } = this.props;

		if (isEditing) {
			return null;
		}

		return (
			<AvatarSection>
				<AkAvatar src={user && user.avatarUrl} />
			</AvatarSection>
		);
	}

	render() {
		return (
			<EditorContext>
				<Container>
					{this.renderAvatar()}
					<EditorSection>
						<WithEditorActions render={(actions) => this.renderEditor(actions)} />
					</EditorSection>
				</Container>
			</EditorContext>
		);
	}
}

interface WrapperProps {
	props: EditorProps;
	initialPluginConfiguration?: InitialPluginConfiguration;
	allowFeedbackAndHelpButtons: boolean;
}

const ComposableEditorWrapper = ({
	props,
	initialPluginConfiguration,
	allowFeedbackAndHelpButtons,
}: WrapperProps) => {
	const universalPreset = useUniversalPreset({ props, initialPluginConfiguration });
	const { preset, editorApi } = usePreset(() => universalPreset, [universalPreset]);

	return (
		<ComposableEditor
			preset={preset}
			{...props}
			primaryToolbarComponents={
				allowFeedbackAndHelpButtons
					? [
							<ToolbarHelp
								key="help"
								editorApi={
									allowFeedbackAndHelpButtons
										? (editorApi as ExtractInjectionAPI<HelpDialogPlugin>)
										: undefined
								}
							/>,
						]
					: undefined
			}
		/>
	);
};
