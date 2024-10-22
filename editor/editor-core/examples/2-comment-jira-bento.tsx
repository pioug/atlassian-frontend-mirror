import React from 'react';

import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type HelpDialogPlugin } from '@atlaskit/editor-plugins/help-dialog';
import { MockActivityResource } from '@atlaskit/editor-test-helpers/example-helpers';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import Form, { Field, FormFooter } from '@atlaskit/form';
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
	isExpanded?: boolean;
	defaultValue?: Node | string | Object;
	assistiveLabel?: string;
};

const mediaProvider = storyMediaProviderFactory();

export class CommentEditorJiraBento extends React.Component<Props, State> {
	state = {
		isExpanded: false,
		defaultValue: '',
		assistiveLabel: 'Default: ',
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
			this.setState({ defaultValue: value });
		});
	};

	onFocus = () => this.setState((prevState) => ({ isExpanded: !prevState.isExpanded }));

	onAssitiveLabelInputChange = (assistiveLabel: string) => {
		this.setState({ assistiveLabel });
	};

	render() {
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
								{...formProps}
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
										<Textfield placeholder="Enter assistiveLabel" {...fieldProps} />
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
									defaultValue={this.state.defaultValue}
									shouldFocus={true}
									disabled={false}
									onCancel={() => this.setState({ isExpanded: false })}
									onChange={this.onChange(actions)}
									onSave={() => this.setState({ isExpanded: false })}
									{...this.providers}
									media={{
										provider: mediaProvider,
										allowMediaSingle: true,
									}}
									allowRule={true}
									allowTextColor={true}
									allowTables={{
										allowControls: true,
									}}
									allowPanel={true}
									allowHelpDialog={true}
									placeholder="We support markdown! Try **bold**, `inline code`, or ``` for code blocks."
									useStickyToolbar={true}
									assistiveLabel={this.state.assistiveLabel}
								/>
							</CollapsedEditor>
						)}
					/>
				</EditorContext>
			</IntlProvider>
		);
	}
}

const ComposableEditorWrapper = (props: EditorProps) => {
	const universalPreset = useUniversalPreset({ props });
	const { preset, editorApi } = usePreset(() => universalPreset, [universalPreset]);

	return (
		<ComposableEditor
			preset={preset}
			{...props}
			primaryToolbarComponents={
				<ToolbarHelp
					titlePosition="top"
					title="Help"
					key="help"
					editorApi={
						props.allowHelpDialog ? (editorApi as ExtractInjectionAPI<HelpDialogPlugin>) : undefined
					}
				/>
			}
		/>
	);
};

export default function CommentExample(props?: Props) {
	return <CommentEditorJiraBento {...props} />;
}
