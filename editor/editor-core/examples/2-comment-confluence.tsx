/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import { DevTools } from '@af/editor-examples-helpers/utils';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type HelpDialogPlugin } from '@atlaskit/editor-plugins/help-dialog';
import { highlightPlugin } from '@atlaskit/editor-plugins/highlight';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import LockCircleIcon from '@atlaskit/icon/core/lock-locked';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import ToolsDrawer from '../example-helpers/ToolsDrawer';
import { name, version } from '../package.json';
import type { EditorProps } from '../src';
import { ComposableEditor } from '../src/composable-editor';
import { useUniversalPreset } from '../src/preset-universal';
import CollapsedEditor from '../src/ui/CollapsedEditor';
import EditorContext from '../src/ui/EditorContext';
import ToolbarHelp from '../src/ui/ToolbarHelp';
import WithEditorActions from '../src/ui/WithEditorActions';
import { usePreset } from '../src/use-preset';

const SAVE_ACTION = () => console.log('Save');
const CANCEL_ACTION = () => console.log('Cancel');
const EXPAND_ACTION = () => console.log('Expand');

const exampleDocument = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{ type: 'text', text: 'Some example document with emojis ' },
				{
					type: 'emoji',
					attrs: {
						shortName: ':catchemall:',
						id: 'atlassian-catchemall',
						text: ':catchemall:',
					},
				},
				{ type: 'text', text: ' and mentions ' },
				{
					type: 'mention',
					attrs: { id: '0', text: '@Carolyn', accessLevel: '' },
				},
				{ type: 'text', text: '. ' },
			],
		},
	],
};

type Props = {
	editorProps?: EditorProps;
	replacementDoc?: any;
};

const CommentEditorConfluence = ({ editorProps, replacementDoc }: Props): React.JSX.Element => {
	const [hasJquery, setHasJquery] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);

	const universalPreset = useUniversalPreset({
		props: {
			appearance: 'comment',
			allowAnalyticsGASV3: true,
			shouldFocus: true,
			quickInsert: true,
			allowTextColor: true,
			allowRule: true,
			allowTables: {
				advanced: true,
				allowControls: true,
				allowTableAlignment: editorExperiment('support_table_in_comment', true, { exposure: true }),
				allowTableResizing: editorExperiment('support_table_in_comment', true, {
					exposure: true,
				}),
			},
			allowHelpDialog: true,
			allowExtension: true,
			textFormatting: { responsiveToolbarMenu: true },
			...editorProps,
		},
		initialPluginConfiguration: {
			insertBlockPlugin: {
				toolbarButtons: {
					insert: { enabled: true },
					media: { enabled: true },
					emoji: { enabled: true },
					codeBlock: { enabled: true },
				},
			},
		},
	});
	const { preset, editorApi } = usePreset(
		() => universalPreset.add(highlightPlugin),
		[universalPreset],
	);

	useEffect(() => {
		delete window.jQuery;
		loadJquery();
	}, []);

	const loadJquery = () => {
		const scriptElem = document.createElement('script');
		scriptElem.type = 'text/javascript';
		scriptElem.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js';

		scriptElem.onload = () => {
			setHasJquery(true);
		};

		document.body.appendChild(scriptElem);
	};

	if (!hasJquery) {
		return <h3>Please wait, loading jQuery ...</h3>;
	}

	const onFocus = () => setIsExpanded(!isExpanded);

	return (
		<IntlProvider locale="en">
			<EditorContext>
				<WithEditorActions
					render={(actions) => (
						<ButtonGroup>
							<Button onClick={() => actions.replaceDocument(replacementDoc || exampleDocument)}>
								Load Document
							</Button>
							<Button onClick={() => actions.clear()}>Clear</Button>
						</ButtonGroup>
					)}
				/>
				<ToolsDrawer
					renderEditor={({
						mentionProvider,
						emojiProvider,
						mediaProvider,
						activityProvider,
						taskDecisionProvider,
						contextIdentifierProvider,
						onChange,
						disabled,
					}: any) => (
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						<div style={{ padding: token('space.250', '20px') }}>
							<CollapsedEditor
								placeholder="What do you want to say?"
								isExpanded={isExpanded}
								onFocus={onFocus}
								onExpand={EXPAND_ACTION}
							>
								<ComposableEditor
									preset={preset}
									appearance="comment"
									placeholder="What do you want to say?"
									allowAnalyticsGASV3={true}
									shouldFocus={true}
									quickInsert={true}
									allowTextColor
									allowRule={true}
									allowTables={{
										advanced: true,
										allowControls: true,
									}}
									allowHelpDialog={true}
									disabled={disabled}
									activityProvider={activityProvider}
									mentionProvider={mentionProvider}
									emojiProvider={emojiProvider}
									media={{
										provider: mediaProvider,
										allowMediaSingle: true,
										allowResizing: true,
										allowResizingInTables: false,
									}}
									taskDecisionProvider={taskDecisionProvider}
									contextIdentifierProvider={contextIdentifierProvider}
									onChange={onChange}
									onSave={SAVE_ACTION}
									onCancel={CANCEL_ACTION}
									feedbackInfo={{
										product: 'bitbucket',
										packageVersion: version,
										packageName: name,
										labels: ['atlaskit-comment'],
									}}
									primaryToolbarComponents={
										<>
											<ToolbarHelp
												key="toolbar-help"
												editorApi={editorApi as ExtractInjectionAPI<HelpDialogPlugin>}
											/>
										</>
									}
									allowExtension={true}
									extensionHandlers={extensionHandlers}
									secondaryToolbarComponents={[
										<LockCircleIcon key="permission" label="Permissions" />,
									]}
									{...editorProps}
								/>
							</CollapsedEditor>
						</div>
					)}
				/>

				<WithEditorActions
					render={(actions) => <DevTools editorView={actions._privateGetEditorView()} />}
				/>
			</EditorContext>
		</IntlProvider>
	);
};

export default CommentEditorConfluence;
