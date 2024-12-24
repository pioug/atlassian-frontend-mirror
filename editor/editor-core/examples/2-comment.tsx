/* eslint-disable no-console */

import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { DevTools, getTranslations, LanguagePicker } from '@af/editor-examples-helpers/utils';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type HelpDialogPlugin } from '@atlaskit/editor-plugins/help-dialog';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import LockCircleIcon from '@atlaskit/icon/glyph/lock-circle';
import { token } from '@atlaskit/tokens';

import ToolsDrawer from '../example-helpers/ToolsDrawer';
import { name, version } from '../package.json';
import type { EditorProps } from '../src';
import { ComposableEditor } from '../src/composable-editor';
import enMessages from '../src/i18n/en';
import languages from '../src/i18n/languages';
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

export type Props = {
	editorProps?: EditorProps;
	replacementDoc?: any;
};

export type State = {
	hasJquery?: boolean;
	isExpanded?: boolean;
	intlState: { locale: string; messages: { [key: string]: string } };
};

declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		jQuery: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		ATL_JQ_PAGE_PROPS: any;
	}
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export class CommentEditorWithFeedback extends React.Component<Props, State> {
	state = {
		hasJquery: false,
		isExpanded: false,
		intlState: { locale: 'en', messages: enMessages },
	};

	componentDidMount() {
		delete window.jQuery;
		this.loadJquery();
	}

	onFocus = () => this.setState((prevState) => ({ isExpanded: !prevState.isExpanded }));

	private loadLocale = async (locale: string) => {
		const messages = await getTranslations(locale);
		this.setState({ ...this.state, intlState: { locale, messages } });
	};

	private getProperLanguageKey = (locale: string) => locale.replace('_', '-');

	render() {
		if (!this.state.hasJquery) {
			return <h3>Please wait, loading jQuery ...</h3>;
		}

		const { locale, messages } = this.state.intlState;

		return (
			<IntlProvider locale={this.getProperLanguageKey(locale)} messages={messages}>
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
									<LanguagePicker
										languages={languages}
										locale={this.state.intlState.locale}
										onChange={this.loadLocale}
									/>
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
										<ComposableEditorWrapper
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
													<ToolbarHelp key="toolbar-help" editorApi={undefined} />
												</>
											}
											allowExtension={true}
											extensionHandlers={extensionHandlers}
											secondaryToolbarComponents={[
												<LockCircleIcon key="permission" size="large" label="Permissions" />,
											]}
											featureFlags={{
												...this.props.editorProps?.featureFlags,
												'table-drag-and-drop': true,
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

export default CommentEditorWithFeedback;
