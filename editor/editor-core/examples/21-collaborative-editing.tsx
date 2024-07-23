/* eslint-disable no-console */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, useEffect } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import URLSearchParams from 'url-search-params';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import type { Provider } from '@atlaskit/collab-provider';
import { createSocketIOCollabProvider } from '@atlaskit/collab-provider/socket-io-provider';
import type { NextEditorPlugin } from '@atlaskit/editor-common/src/types';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { editorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import { selectionMarkerPlugin } from '@atlaskit/editor-plugin-selection-marker';
import { blockControlsPlugin } from '@atlaskit/editor-plugins/block-controls';
import { type Node, Slice } from '@atlaskit/editor-prosemirror/model';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { TitleInput } from '@atlaskit/editor-test-helpers/example-helpers';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { customInsertMenuItems } from '@atlaskit/editor-test-helpers/mock-insert-menu';
import { token } from '@atlaskit/tokens';
import { getEmojiProvider } from '@atlaskit/util-data-test/get-emoji-provider';
import { mentionResourceProviderWithResolver } from '@atlaskit/util-data-test/mention-story-data';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';

import type { EditorActions } from '../src';
import EditorContext from '../src/ui/EditorContext';
import WithEditorActions from '../src/ui/WithEditorActions';

import { LOCALSTORAGE_defaultTitleKey } from './5-full-page';

// This was created to generate steps debugging collab-provider/ncs
// See runbook: https://hello.atlassian.net/wiki/spaces/CEPS/pages/3677789685/Debug+with+Custom+Steps
export class CustomReplaceStep extends ReplaceStep {
	constructor(private doc: Node) {
		super(0, 0, Slice.empty);
	}

	toJSON() {
		return {
			stepType: 'replace',
			from: this.doc.nodeSize / 2,
			to: this.doc.nodeSize / 2 + 1,
			slice: {
				content: [
					{
						type: 'text',
						text: '<CustomStep>',
					},
				],
			},
		};
	}
}

export const collabCustomStepPlugin: NextEditorPlugin<'collab-malformed-plugin'> = ({ api }) => {
	return {
		name: 'collab-malformed-plugin',

		primaryToolbarComponent: () => {
			return (
				<div>
					<Button
						title="HOWTO: https://hello.atlassian.net/wiki/spaces/CEPS/pages/3677789685/Debug+with+Custom+Steps"
						appearance="discovery"
						onClick={() => {
							api?.core.actions.execute(({ tr }) => {
								return tr.step(new CustomReplaceStep(tr.doc));
							});
						}}
					>
						Send Custom Step
					</Button>
				</div>
			);
		},
	};
};

export const getRandomUser = () => {
	return Math.floor(Math.random() * 10000).toString();
};

const defaultCollabUrl = 'https://pf-collab-service--app.ap-southeast-2.dev.atl-paas.net/ccollab';

// eslint-disable-next-line
export const content: any = css({
	padding: `0 ${token('space.250', '20px')}`,
	height: '50%',
	background: '#fff',
	boxSizing: 'border-box',
});

const SaveAndCancelButtons = (props: { editorActions: EditorActions }) => {
	const onClickPublish = () => {
		props.editorActions.getResolvedEditorState().then((value) => {
			console.log(value);
		});
	};

	return (
		<ButtonGroup>
			<Button appearance="primary" onClick={onClickPublish}>
				Publish
			</Button>
			<Button appearance="subtle" onClick={() => props.editorActions.clear()}>
				Close
			</Button>
		</ButtonGroup>
	);
};

interface DropzoneEditorWrapperProps {
	children: (container: HTMLElement) => React.ReactNode;
}

class DropzoneEditorWrapper extends React.Component<DropzoneEditorWrapperProps, {}> {
	dropzoneContainer: HTMLElement | null = null;

	handleRef = (node: HTMLDivElement) => {
		this.dropzoneContainer = node;
		this.forceUpdate();
	};

	render() {
		return (
			<div css={content} ref={this.handleRef}>
				{this.dropzoneContainer ? this.props.children(this.dropzoneContainer) : null}
			</div>
		);
	}
}

const mediaProvider = storyMediaProviderFactory();

export type Props = {
	onTitleChange?: (title: string) => void;
};
export type State = {
	isInviteToEditButtonSelected: boolean;
	documentId?: string;
	collabUrl?: string;
	documentIdInput?: HTMLInputElement;
	collabUrlInput?: HTMLInputElement;
	hasError?: boolean;
	title?: string;
	__livePage: boolean;
	__liveView: boolean;
};

const getQueryParam = (param: string) => {
	const win = window.parent || window;
	const urlParams = new URLSearchParams(win.document.location.search);
	return urlParams.get(param);
};

function useFullPageEditorPreset(props: any) {
	const universalPreset = useUniversalPreset({ props });

	const { preset, editorApi } = usePreset(() => {
		return universalPreset
			.add([editorViewModePlugin, { mode: 'view' }])
			.add(selectionMarkerPlugin)
			.add(collabCustomStepPlugin)
			.add(blockControlsPlugin);
	}, [universalPreset]);

	const { setEditorAPI } = props;
	useEffect(() => {
		if (!setEditorAPI) {
			return;
		}

		setEditorAPI(editorApi);
	}, [editorApi, setEditorAPI]);

	useEffect(() => {
		if (props.viewMode === undefined) {
			return;
		}
		editorApi?.core?.actions.execute(
			editorApi?.editorViewMode?.commands.updateViewMode(props.viewMode),
		);
	}, [props.viewMode, editorApi]);

	return preset;
}

const FullPageComposableEditor = (props: any) => {
	const fullPagePreset = useFullPageEditorPreset(props);

	return (
		<ComposableEditor
			preset={fullPagePreset}
			appearance={props.appearance}
			placeholder={props.placeholder}
			// Providers
			mentionProvider={props.mentionProvider}
			media={props.media}
			emojiProvider={props.emojiProvider}
			contextIdentifierProvider={props.contextIdentifierProvider}
			collabEdit={props.collabEdit}
			taskDecisionProvider={props.taskDecisionProvider}
			// Other props
			shouldFocus={props.shouldFocus}
			featureFlags={props.featureFlags}
			primaryToolbarComponents={props.primaryToolbarComponents}
			contentComponents={props.contentComponents}
			sanitizePrivateContent={props.sanitizePrivateContent}
			__livePage={props.__livePage}
		/>
	);
};
export default class Example extends React.Component<Props, State> {
	state = {
		isInviteToEditButtonSelected: false,
		documentId: getQueryParam('documentId'),
		collabUrl: getQueryParam('collabUrl') || defaultCollabUrl,
		need404: getQueryParam('need404'),
		documentIdInput: undefined,
		collabUrlInput: undefined,
		hasError: false,
		title: localStorage.getItem(LOCALSTORAGE_defaultTitleKey) || '',
		__livePage: getQueryParam('__livePage') === 'true' || false,
		__liveView: getQueryParam('__liveView') === 'true' || false,
	};

	componentDidCatch() {
		this.setState({ hasError: true });
	}

	renderErrorFlag() {
		if (this.state.hasError) {
			return (
				<div
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						margin: 0,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						backgroundColor: '#FF5630',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						padding: token('space.150', '12px'),
					}}
				>
					<strong>NOTE!</strong> Something went wrong in the editor. You may be out of sync.
				</div>
			);
		}
		return;
	}

	renderDocumentId() {
		return (
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					margin: 0,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					backgroundColor: '#00B8D9',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					padding: token('space.150', '12px'),
				}}
			>
				<div>
					<strong>DocumentId:</strong> {this.state.documentId}
				</div>
				<div>
					<strong>CollabUrl:</strong> {this.state.collabUrl}
				</div>
				<div>
					<strong>Live Page:</strong>{' '}
					<input
						type="checkbox"
						checked={this.state.__livePage}
						onChange={() => {
							this.setState({ __livePage: !this.state.__livePage });
							const win = window.parent || window;
							const url = new URL(win.location.href);
							url.searchParams.set('__livePage', String(!this.state.__livePage));
							win.history.pushState({}, '', url.toString());
						}}
					/>
				</div>
				<div>
					<strong>Live View:</strong>{' '}
					<input
						type="checkbox"
						checked={this.state.__liveView}
						onChange={() => {
							this.setState({ __liveView: !this.state.__liveView });
							const win = window.parent || window;
							const url = new URL(win.location.href);
							url.searchParams.set('__liveView', String(!this.state.__liveView));
							win.history.pushState({}, '', url.toString());
						}}
					/>
				</div>
			</div>
		);
	}

	renderEditor() {
		const { documentId, collabUrl, need404 } = this.state;
		// Enable the debug log
		(window as any).COLLAB_PROVIDER_LOGGER = true;

		const docAriRegex = new RegExp('^ari:cloud:confluence');
		const incomingDocAri = docAriRegex.test(documentId)
			? documentId
			: `ari:cloud:confluence:collab-test:blog/${documentId}`;

		const collabProvider = createSocketIOCollabProvider({
			url: collabUrl,
			need404,
			documentAri: incomingDocAri,
			productInfo: {
				product: 'editor-core example',
				subProduct: 'collab provider example',
			},
			featureFlags: { testFF: false, testAF: true },
			__livePage: this.state.__livePage,
		});

		// Example POST method implementation:
		async function postData(url = '', data = {}) {
			url = url.replace(/\?.*$/, '');
			// Default options are marked with *
			const response = await fetch(url, {
				method: 'POST', // *GET, POST, PUT, DELETE, etc.
				mode: 'cors', // no-cors, *cors, same-origin
				cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
				credentials: 'include', // include, *same-origin, omit
				headers: {
					'Content-Type': 'application/json',
				},
				redirect: 'follow', // manual, *follow, error
				referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
				body: JSON.stringify(data), // body data type must match "Content-Type" header
			});
			return response.json(); // parses JSON response into native JavaScript objects
		}

		async function recoveryPage() {
			const validResetADF: any = {
				doc: JSON.stringify({
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Demo Editor initial text',
								},
							],
						},
					],
				}),
				productId: 'ccollab',
				metadata: {
					title: 'Demo Editor initial title',
				},
			};
			await postData(
				`${collabUrl.slice(0, -8)}/document/${encodeURIComponent(incomingDocAri)}/reset`,
				validResetADF,
			);
		}

		collabProvider.on('error', (err) => {
			if (err.code === 'DOCUMENT_NOT_FOUND') {
				recoveryPage().catch((err) => {
					console.error(err, 'page recovery failed');
				});
			} else {
				console.error('error from collabProvider:', {
					message: err.message,
					code: err.code,
				});
			}
		});
		collabProvider.on('metadata:changed', (data: any) => {
			this.setState({
				title: data.title,
			});
		});

		return (
			<div key={this.state.__livePage ? 'enabled-livePage' : 'disabled-livePage'}>
				{this.renderErrorFlag()}
				{this.renderDocumentId()}
				<DropzoneEditorWrapper>
					{(parentContainer) => (
						<EditorContext>
							<FullPageComposableEditor
								__livePage={this.state.__livePage}
								appearance="full-page"
								allowBreakout={true}
								allowStatus={true}
								allowAnalyticsGASV3={true}
								allowExpand={{
									allowInsertion: true,
									allowInteractiveExpand: true,
								}}
								allowLayouts={true}
								allowTextColor={true}
								allowTables={{
									advanced: true,
									allowColumnSorting: true,
									allowAddColumnWithCustomStep: true,
									allowDistributeColumns: true,
								}}
								allowTemplatePlaceholders={{ allowInserting: true }}
								media={{
									provider: mediaProvider,
									allowMediaSingle: true,
									customDropzoneContainer: parentContainer,
									allowCaptions: true,
									allowLinking: true,
									allowImagePreview: true,
								}}
								allowPanel={true}
								emojiProvider={getEmojiProvider()}
								mentionProvider={Promise.resolve(mentionResourceProviderWithResolver)}
								taskDecisionProvider={Promise.resolve(getMockTaskDecisionResource())}
								contextIdentifierProvider={storyContextIdentifierProviderFactory()}
								sanitizePrivateContent={true}
								collabEdit={{
									useNativePlugin: true,
									provider: Promise.resolve(collabProvider),
									inviteToEditHandler: this.inviteToEditHandler,
									isInviteToEditButtonSelected: this.state.isInviteToEditButtonSelected,
								}}
								placeholder="Write something..."
								shouldFocus={false}
								primaryToolbarComponents={
									<WithEditorActions
										render={(actions) => <SaveAndCancelButtons editorActions={actions} />}
									/>
								}
								allowExtension={true}
								insertMenuItems={customInsertMenuItems}
								extensionHandlers={extensionHandlers}
								contentComponents={
									<WithEditorActions
										render={(actions) => (
											<Fragment>
												<TitleInput
													value={this.state.title}
													provider={collabProvider}
													onChange={this.handleTitleChange}
													onKeyDown={(e: React.KeyboardEvent) => {
														this.onKeyPressed(e, actions);
													}}
												/>
											</Fragment>
										)}
									/>
								}
								viewMode={this.state.__liveView ? 'view' : 'edit'}
								featureFlags={{ 'table-drag-and-drop': true }}
							/>
						</EditorContext>
					)}
				</DropzoneEditorWrapper>
			</div>
		);
	}

	private handleRef = (input: HTMLInputElement) => {
		if (input) {
			if (input.name === 'documentId') {
				this.setState({
					documentIdInput: input,
				});
			}

			if (input.name === 'collabUrl') {
				this.setState({
					collabUrlInput: input,
				});
			}
		}
	};

	private onJoin = () => {
		const { documentIdInput, collabUrlInput } = this.state;
		if (documentIdInput) {
			const documentId = (documentIdInput! as HTMLInputElement).value;
			const collabUrl = (collabUrlInput! as HTMLInputElement).value || defaultCollabUrl;
			if (documentId) {
				try {
					const win = window.parent || window;
					const url = new URL(win.location.href);
					url.searchParams.set('documentId', documentId);
					url.searchParams.set('collabUrl', collabUrl);
					win.history.pushState({}, '', url.toString());
				} catch (err) {}
				this.setState({
					documentId,
					collabUrl,
				});
			}
		}
	};

	render() {
		if (this.state.documentId) {
			return this.renderEditor();
		}

		return (
			<form onSubmit={this.onJoin}>
				Document name:
				<input name="documentId" ref={this.handleRef} />
				Collab url:
				<input name="collabUrl" ref={this.handleRef} />
				<label>
					{' '}
					Default to <b>{defaultCollabUrl}</b>
				</label>
				<br />
				<button type="submit">Join</button>
			</form>
		);
	}

	private inviteToEditHandler = (event: React.MouseEvent<HTMLElement>) => {
		this.setState({
			isInviteToEditButtonSelected: !this.state.isInviteToEditButtonSelected,
		});
		console.log('target', event.target);
	};

	private onKeyPressed = (e: React.KeyboardEvent, actions: EditorActions) => {
		if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'Enter') {
			// Move to the editor view
			const target = e.currentTarget as HTMLInputElement;
			target.blur();
			e.preventDefault();
			actions.focus();
			return false;
		}
		return;
	};

	private handleTitleChange = (e: React.FormEvent<HTMLTextAreaElement>, provider?: Provider) => {
		const title = (e.target as HTMLInputElement).value;
		if (provider) {
			provider.setMetadata({ title });
		}
		this.setState({
			title,
		});
	};
}
