/* eslint-disable no-console */

import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { DevTools } from '@af/editor-examples-helpers/utils';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { customInsertMenuItems } from '@atlaskit/editor-test-helpers/mock-insert-menu';
import LockCircleIcon from '@atlaskit/icon/glyph/lock-circle';
import { token } from '@atlaskit/tokens';

import ToolsDrawer from '../example-helpers/ToolsDrawer';
import { name, version } from '../package.json';
import type { EditorProps } from '../src';
import { Editor } from '../src';
import CollapsedEditor from '../src/ui/CollapsedEditor';
import EditorContext from '../src/ui/EditorContext';
import ToolbarFeedback from '../src/ui/ToolbarFeedback';
import ToolbarHelp from '../src/ui/ToolbarHelp';
import WithEditorActions from '../src/ui/WithEditorActions';

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

export type Props = {
	editorProps?: EditorProps;
	replacementDoc?: any;
};

export type State = {
	hasJquery?: boolean;
	isExpanded?: boolean;
};

export class CommentEditorWithFeedback extends React.Component<Props, State> {
	state = {
		hasJquery: false,
		isExpanded: false,
	};

	componentDidMount() {
		delete window.jQuery;
		this.loadJquery();
	}

	onFocus = () => this.setState((prevState) => ({ isExpanded: !prevState.isExpanded }));

	render() {
		if (!this.state.hasJquery) {
			return <h3>Please wait, loading jQuery ...</h3>;
		}

		return (
			<IntlProvider locale="en">
				<EditorContext>
					<div>
						<WithEditorActions
							render={(actions) => (
								<ButtonGroup>
									<Button
										onClick={() =>
											actions.replaceDocument(this.props.replacementDoc || exampleDocument)
										}
									>
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
								enabledFeatures,
							}: any) => (
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								<div style={{ padding: token('space.250', '20px') }}>
									<CollapsedEditor
										placeholder="What do you want to say?"
										isExpanded={this.state.isExpanded}
										onFocus={this.onFocus}
										onExpand={EXPAND_ACTION}
									>
										<Editor
											appearance="comment"
											placeholder="What do you want to say?"
											allowAnalyticsGASV3={true}
											shouldFocus={true}
											quickInsert={true}
											allowTextColor={true}
											allowRule={true}
											allowTables={{
												advanced: true,
												allowDistributeColumns: true,
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
													<ToolbarFeedback product="bitbucket" key="toolbar-feedback" />
													<ToolbarHelp key="toolbar-help" />
												</>
											}
											allowExtension={true}
											insertMenuItems={customInsertMenuItems}
											extensionHandlers={extensionHandlers}
											secondaryToolbarComponents={[
												<LockCircleIcon key="permission" size="large" label="Permissions" />,
											]}
											featureFlags={{
												...this.props.editorProps?.featureFlags,
												'table-drag-and-drop': true,
												// 'table-preserve-width': true,
												// 'sticky-scrollbar': true,
											}}
											{...this.props.editorProps}
										/>
									</CollapsedEditor>
								</div>
							)}
						/>
						<WithEditorActions
							render={(actions) => <DevTools editorView={actions._privateGetEditorView()} />}
						/>
					</div>
				</EditorContext>
			</IntlProvider>
		);
	}

	private loadJquery = () => {
		const scriptElem = document.createElement('script');
		scriptElem.type = 'text/javascript';
		scriptElem.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js';

		scriptElem.onload = () => {
			this.setState({
				...this.state,
				hasJquery: true,
			});
		};

		document.body.appendChild(scriptElem);
	};
}

export default CommentEditorWithFeedback;
