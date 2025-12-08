import React from 'react';

import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { showDiffPlugin } from '@atlaskit/editor-plugin-show-diff';
import { trackChangesPlugin } from '@atlaskit/editor-plugin-track-changes';
import { type HelpDialogPlugin } from '@atlaskit/editor-plugins/help-dialog';
import { MockActivityResource } from '@atlaskit/editor-test-helpers/example-helpers';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import Form, { Field, FormFooter } from '@atlaskit/form';
import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';
import { ReactRenderer } from '@atlaskit/renderer';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';
import { currentUser, getEmojiProvider } from '@atlaskit/util-data-test/get-emoji-provider';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';

import type { EditorActions, EditorProps } from '../src';
import { ComposableEditor } from '../src/composable-editor';
import { useUniversalPreset } from '../src/preset-universal';
import CollapsedEditor from '../src/ui/CollapsedEditor';
import EditorContext from '../src/ui/EditorContext';
import ToolbarHelp from '../src/ui/ToolbarHelp';
import WithEditorActions from '../src/ui/WithEditorActions';
import { usePreset } from '../src/use-preset';

export type Props = {
	editorProps?: EditorProps;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	replacementDoc?: any;
};

export type State = {
	assistiveLabel?: string;
	isEditingMode?: boolean;
	isExpanded?: boolean;
};

const LOCALSTORAGE_DOC_KEY = 'fabric.editor.example.comment';

const mediaProvider = storyMediaProviderFactory();
const smartCardClient = new CardClient('staging');

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export class CommentEditorJiraBento extends React.Component<Props, State> {
	state = {
		isExpanded: false,
		assistiveLabel: 'Default: ',
		isEditingMode: true,
	};

	private providers = {
		emojiProvider: getEmojiProvider({
			uploadSupported: true,
			currentUser,
		}),
		mentionProvider: Promise.resolve(mentionResourceProvider),
		activityProvider: Promise.resolve(new MockActivityResource()),
	};

	onChange = (actions: EditorActions) => () => {
		actions.getValue().then((value) => {
			localStorage.setItem(LOCALSTORAGE_DOC_KEY, JSON.stringify(value));
		});
	};

	onFocus = () => this.setState((prevState) => ({ isExpanded: !prevState.isExpanded }));

	onAssitiveLabelInputChange = (assistiveLabel: string) => {
		this.setState({ assistiveLabel });
	};

	render(): React.JSX.Element {
		const savedDoc = localStorage.getItem(LOCALSTORAGE_DOC_KEY);
		const document = savedDoc ? JSON.parse(savedDoc) : undefined;

		return (
			<IntlProvider locale="en">
				<div>
					<Form
						onSubmit={({ assistiveLabel }: { assistiveLabel: string }) =>
							this.onAssitiveLabelInputChange(assistiveLabel)
						}
					>
						{({ formProps }) => (
							<form
								onSubmit={formProps.onSubmit}
								style={{
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
									display: 'flex',
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
									padding: token('space.050', '4px'),
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
									alignItems: 'center',
								}}
							>
								<Field label="Assistive Label" name="assistiveLabel">
									{({ fieldProps }) => (
										<Textfield
											placeholder="Enter assistiveLabel"
											id={fieldProps.id}
											name={fieldProps.name}
											value={fieldProps.value}
											onChange={fieldProps.onChange}
											onBlur={fieldProps.onBlur}
											onFocus={fieldProps.onFocus}
											isDisabled={fieldProps.isDisabled}
											isInvalid={fieldProps.isInvalid}
										/>
									)}
								</Field>
								<FormFooter>
									<Button type="submit" appearance="primary">
										Save
									</Button>
								</FormFooter>
							</form>
						)}
					</Form>
				</div>
				{this.state.isEditingMode ? (
					<EditorContext>
						<WithEditorActions
							render={(actions) => (
								<CollapsedEditor
									isExpanded={this.state.isExpanded}
									onFocus={this.onFocus}
									placeholder="Add a comment..."
								>
									<ComposableEditorWrapper
										appearance="comment"
										defaultValue={document}
										shouldFocus={true}
										disabled={false}
										onCancel={() => this.setState({ isExpanded: false })}
										onChange={this.onChange(actions)}
										onSave={() => {
											this.setState({ isEditingMode: false });
											this.setState({ isExpanded: false });
										}}
										emojiProvider={this.providers.emojiProvider}
										mentionProvider={this.providers.mentionProvider}
										activityProvider={this.providers.activityProvider}
										media={{
											provider: mediaProvider,
											allowMediaSingle: true,
										}}
										allowRule={true}
										allowTextColor={true}
										allowTables={{
											allowControls: true,
											allowNumberColumn: true,
											allowColumnResizing: true,
											allowHeaderRow: true,
											allowMergeCells: true,
											allowTableResizing: true,
										}}
										allowPanel={true}
										allowHelpDialog={true}
										placeholder="We support markdown! Try **bold**, `inline code`, or ``` for code blocks."
										useStickyToolbar={true}
										assistiveLabel={this.state.assistiveLabel}
										allowUndoRedoButtons={true}
									/>
								</CollapsedEditor>
							)}
						/>
					</EditorContext>
				) : (
					<div
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							margin: '16px',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							padding: '16px',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							border: `${token('border.width')} solid #ccc`,
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							borderRadius: token('radius.small'),
						}}
					>
						<SmartCardProvider client={smartCardClient}>
							<ReactRenderer
								document={document}
								appearance="comment"
								allowHeadingAnchorLinks
								allowColumnSorting
								adfStage="stage0"
								UNSTABLE_allowTableAlignment
								UNSTABLE_allowTableResizing
								eventHandlers={{
									onUnhandledClick: (e) => {
										// eslint-disable-next-line no-console
										console.log('onUnhandledClick called');
										this.setState({ isEditingMode: true, isExpanded: true });
									},
								}}
							/>
						</SmartCardProvider>
					</div>
				)}
			</IntlProvider>
		);
	}
}

const ComposableEditorWrapper = ({
	appearance,
	defaultValue,
	shouldFocus,
	disabled,
	onCancel,
	onChange,
	onSave,
	emojiProvider,
	mentionProvider,
	activityProvider,
	media,
	allowRule,
	allowTextColor,
	allowTables,
	allowPanel,
	allowHelpDialog,
	placeholder,
	useStickyToolbar,
	allowUndoRedoButtons = true,
	assistiveLabel,
}: EditorProps) => {
	const universalPreset = useUniversalPreset({
		props: {
			appearance,
			defaultValue,
			shouldFocus,
			disabled,
			onCancel,
			onChange,
			onSave,
			emojiProvider,
			mentionProvider,
			activityProvider,
			media,
			allowRule,
			allowTextColor,
			allowTables,
			allowPanel,
			allowHelpDialog,
			placeholder,
			useStickyToolbar,
			assistiveLabel,
			allowUndoRedoButtons,
		},
	})
		.add(showDiffPlugin)
		.add([trackChangesPlugin, { showOnToolbar: true }]);
	const { preset, editorApi } = usePreset(() => universalPreset, [universalPreset]);

	return (
		<ComposableEditor
			preset={preset}
			appearance={appearance}
			defaultValue={defaultValue}
			shouldFocus={shouldFocus}
			disabled={disabled}
			onCancel={onCancel}
			onChange={onChange}
			onSave={onSave}
			emojiProvider={emojiProvider}
			mentionProvider={mentionProvider}
			activityProvider={activityProvider}
			allowUndoRedoButtons={true}
			media={media}
			useStickyToolbar={useStickyToolbar}
			assistiveLabel={assistiveLabel}
			primaryToolbarComponents={
				<ToolbarHelp
					titlePosition="top"
					title="Help"
					key="help"
					editorApi={
						allowHelpDialog ? (editorApi as ExtractInjectionAPI<HelpDialogPlugin>) : undefined
					}
				/>
			}
		/>
	);
};

export default function CommentExample(props?: Props): React.JSX.Element {
	return (
		<CommentEditorJiraBento
			editorProps={props?.editorProps}
			replacementDoc={props?.replacementDoc}
		/>
	);
}
