import type { IntlShape } from 'react-intl-next';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { ACTION, INPUT_METHOD, PasteTypes } from '@atlaskit/editor-common/analytics';
import type { CardOptions } from '@atlaskit/editor-common/card';
import { addLinkMetadata } from '@atlaskit/editor-common/card';
import { insideTable } from '@atlaskit/editor-common/core-utils';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import type {
	ExtensionAutoConvertHandler,
	ExtensionProvider,
} from '@atlaskit/editor-common/extensions';
import { getExtensionAutoConvertersFromProvider } from '@atlaskit/editor-common/extensions';
import { isNestedTablesSupported } from '@atlaskit/editor-common/nesting';
import { isPastedFile as isPastedFileFromEvent, md } from '@atlaskit/editor-common/paste';
import { measureRender } from '@atlaskit/editor-common/performance/measure-render';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { SyncBlockRendererDataAttributeName } from '@atlaskit/editor-common/sync-block';
import {
	transformSingleColumnLayout,
	transformSingleLineCodeBlockToCodeMark,
	transformSliceNestedExpandToExpand,
	transformSliceToDecisionList,
	transformSliceToJoinAdjacentCodeBlocks,
	transformSliceToRemoveLegacyContentMacro,
	transformSliceToRemoveMacroId,
	removeBreakoutFromRendererSyncBlockHTML,
} from '@atlaskit/editor-common/transforms';
import type {
	ExtractInjectionAPI,
	FeatureFlags,
	PasteWarningOptions,
} from '@atlaskit/editor-common/types';
import {
	containsAnyAnnotations,
	extractSliceFromStep,
	linkifyContent,
	mapChildren,
} from '@atlaskit/editor-common/utils';
import { MarkdownTransformer } from '@atlaskit/editor-markdown-transformer';
import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { contains, hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { handlePaste as handlePasteTable } from '@atlaskit/editor-tables/utils';
import { insm } from '@atlaskit/insm';
import { extractClientIdsFromHtml } from '@atlaskit/media-common';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { PastePluginActionTypes } from '../editor-actions/actions';
import { splitParagraphs, upgradeTextToLists } from '../editor-commands/commands';
import type { PastePlugin } from '../index';
import type { LastContentPasted } from '../pastePluginType';
import {
	transformSliceForMedia,
	transformSliceToCorrectMediaWrapper,
	transformSliceToMediaSingleWithNewExperience,
	unwrapNestedMediaElements,
} from '../pm-plugins/media';

import {
	createPasteMeasurePayload,
	getContentNodeTypes,
	handleCodeBlockWithAnalytics,
	handleExpandWithAnalytics,
	handleMarkdownWithAnalytics,
	handleMediaSingleWithAnalytics,
	handleNestedTablePasteWithAnalytics,
	handlePasteAsPlainTextWithAnalytics,
	handlePasteIntoCaptionWithAnalytics,
	handlePasteIntoTaskAndDecisionWithAnalytics,
	handlePasteLinkOnSelectedTextWithAnalytics,
	handlePasteNonNestableBlockNodesIntoListWithAnalytics,
	handlePastePanelOrDecisionIntoListWithAnalytics,
	handlePastePreservingMarksWithAnalytics,
	handleRichTextWithAnalytics,
	handleSelectedTableWithAnalytics,
	sendPasteAnalyticsEvent,
} from './analytics';
import {
	createClipboardTextSerializer,
	clipboardTextSerializer,
} from './clipboard-text-serializer';
import { createPluginState, pluginKey as stateKey } from './plugin-factory';
import {
	escapeBackslashAndLinksExceptCodeBlock,
	getPasteSource,
	htmlContainsSingleFile,
	htmlHasInvalidLinkTags,
	isPastedFromExcel,
	isPastedFromWord,
	removeDuplicateInvalidLinks,
	transformUnsupportedBlockCardToInline,
} from './util';
import { handleVSCodeBlock } from './util/edge-cases/handleVSCodeBlock';
import {
	handleMacroAutoConvert,
	handleMention,
	handleParagraphBlockMarks,
	handleTableContentPasteInBodiedExtension,
} from './util/handlers';
import { handleSyncBlocksPaste } from './util/sync-block';
import {
	htmlHasIncompleteTable,
	isPastedFromTinyMCEConfluence,
	tryRebuildCompleteTableHtml,
} from './util/tinyMCE';

export const isInsideBlockQuote = (state: EditorState): boolean => {
	const { blockquote } = state.schema.nodes;

	return hasParentNodeOfType(blockquote)(state.selection);
};

const PASTE = 'Editor Paste Plugin Paste Duration';

export function isSharePointUrl(url: string | undefined): boolean {
	if (!url) {
		return false;
	}

	try {
		const urlObj = new URL(url);
		const hostname = urlObj.hostname.toLowerCase();
		const protocol = urlObj.protocol.toLowerCase();

		// Only accept HTTPS URLs for security
		if (protocol !== 'https:') {
			return false;
		}

		// Check if hostname ends with the trusted domains (not just contains them)
		return (
			hostname.endsWith('sharepoint.com') ||
			hostname.endsWith('onedrive.com') ||
			hostname.endsWith('onedrive.live.com')
		);
	} catch {
		// If URL parsing fails, return false for safety
		return false;
	}
}

export function createPlugin(
	schema: Schema,
	dispatchAnalyticsEvent: DispatchAnalyticsEvent,
	dispatch: Dispatch,
	featureFlags: FeatureFlags,
	pluginInjectionApi: ExtractInjectionAPI<PastePlugin> | undefined,
	getIntl: () => IntlShape,
	cardOptions?: CardOptions,
	sanitizePrivateContent?: boolean,
	providerFactory?: ProviderFactory,
	pasteWarningOptions?: PasteWarningOptions,
) {
	const editorAnalyticsAPI = pluginInjectionApi?.analytics?.actions;
	const atlassianMarkDownParser = new MarkdownTransformer(schema, md);

	function getMarkdownSlice(text: string, openStart: number, openEnd: number): Slice | undefined {
		const escapedTextInput: string = escapeBackslashAndLinksExceptCodeBlock(text);

		const doc = atlassianMarkDownParser.parse(escapedTextInput);
		if (doc && doc.content) {
			return new Slice(doc.content, openStart, openEnd);
		}
		return;
	}

	let extensionAutoConverter: ExtensionAutoConvertHandler;

	async function setExtensionAutoConverter(
		name: string,
		extensionProviderPromise?: Promise<ExtensionProvider>,
	) {
		if (name !== 'extensionProvider' || !extensionProviderPromise) {
			return;
		}

		try {
			extensionAutoConverter =
				await getExtensionAutoConvertersFromProvider(extensionProviderPromise);
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e);
		}
	}

	if (providerFactory) {
		providerFactory.subscribe('extensionProvider', setExtensionAutoConverter);
	}

	let mostRecentPasteEvent: ClipboardEvent | null;
	let pastedFromBitBucket = false;

	return new SafePlugin({
		key: stateKey,
		state: createPluginState(dispatch, {
			activeFlag: null,
			pastedMacroPositions: {},
			lastContentPasted: null,
		}),
		props: {
			// For serialising to plain text
			clipboardTextSerializer: fg('platform_editor_date_to_text')
				? createClipboardTextSerializer(getIntl())
				: clipboardTextSerializer,
			handleDOMEvents: {
				// note
				paste: (view, event) => {
					mostRecentPasteEvent = event as ClipboardEvent;
					if (
						expValEquals('cc_editor_interactivity_monitoring', 'isEnabled', true) &&
						event.clipboardData
					) {
						insm.startHeavyTask('paste');
					}
					return false;
				},
			},
			// note
			handlePaste(view, rawEvent, slice) {
				const event = rawEvent as ClipboardEvent;
				if (!event.clipboardData) {
					return false;
				}

				let text = event.clipboardData.getData('text/plain');
				const html = event.clipboardData.getData('text/html');
				const uriList = event.clipboardData.getData('text/uri-list');

				// Extract clientId values from pasted HTML for media cross-product copy/paste
				// This must be done before ProseMirror parses the HTML, as clientId is not stored in ADF
				if (fg('platform_media_cross_client_copy_with_auth')) {
					extractClientIdsFromHtml(html);
				}
				// Links copied from iOS Safari share button only have the text/uri-list data type
				// ProseMirror don't do anything with this type so we want to make our own open slice
				// with url as text content so link is pasted inline
				if (uriList && !text && !html) {
					text = uriList;
					slice = new Slice(Fragment.from(schema.text(text)), 1, 1);
				}

				if (text?.includes('\r')) {
					// Ignored via go/ees005
					// eslint-disable-next-line require-unicode-regexp
					text = text.replace(/\r/g, '');
				}

				// Strip Legacy Content Macro (LCM) extensions on paste
				if (!fg('platform_editor_legacy_content_macro_insert')) {
					slice = transformSliceToRemoveLegacyContentMacro(slice, schema);
				}

				const isPastedFile = isPastedFileFromEvent(event);
				const isPlainText = text && !html;
				const isRichText = !!html;

				// Bail if copied content has files
				if (isPastedFile) {
					if (!html) {
						if (expValEquals('cc_editor_interactivity_monitoring', 'isEnabled', true)) {
							insm.endHeavyTask('paste');
						}
						/**
						 * Microsoft Office, Number, Pages, etc. adds an image to clipboard
						 * with other mime-types so we don't let the event reach media.
						 * The detection ration here is that if the payload has both `html` and
						 * `files`, then it could be one of above or an image copied from web.
						 * Here, we don't have html, so we return true to allow default event behaviour
						 */
						return true;
					}

					/**
					 * We want to return false for external copied image to allow
					 * it to be uploaded by the client.
					 *
					 * Scenario where we are pasting an external image inside a block quote
					 * is skipped and handled in handleRichText
					 */
					if (htmlContainsSingleFile(html) && !isInsideBlockQuote(view.state)) {
						if (expValEquals('cc_editor_interactivity_monitoring', 'isEnabled', true)) {
							insm.endHeavyTask('paste');
						}
						return true;
					}

					/**
					 * https://product-fabric.atlassian.net/browse/ED-21993
					 * stopImmediatePropagation will run the first event attached to the same element
					 * Which chould have race condition issue
					 */
					event.stopPropagation();
				}

				const { state } = view;

				const content = getContentNodeTypes(slice.content);
				// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
				const pasteId = uuid();
				const measureName = `${PASTE}_${pasteId}`;
				measureRender(measureName, ({ duration, distortedDuration }) => {
					const payload = createPasteMeasurePayload({
						view,
						duration,
						content,
						distortedDuration,
					});
					if (payload) {
						dispatchAnalyticsEvent(payload);
					}
					if (expValEquals('cc_editor_interactivity_monitoring', 'isEnabled', true)) {
						insm.endHeavyTask('paste');
					}
				});
				const getLastPastedSlice = (tr: Transaction) => {
					let slice;
					for (const step of tr.steps) {
						const stepSlice = extractSliceFromStep(step);
						if (stepSlice) {
							slice = stepSlice;
						}
					}
					return slice;
				};
				// creating a custom dispatch because we want to add a meta whenever we do a paste.
				const dispatch = (tr: Transaction) => {
					// https://product-fabric.atlassian.net/browse/ED-12633
					// don't add closeHistory call if we're pasting a text inside placeholder text as we want the whole action
					// to be atomic
					const { placeholder } = state.schema.nodes;
					const isPastingTextInsidePlaceholderText =
						state.doc.resolve(state.selection.$anchor.pos).nodeAfter?.type === placeholder;

					// Don't add closeHistory if we're pasting over layout columns, as we will appendTransaction
					// to cleanup the layout's structure and we want to keep the paste and re-structuring as
					// one event.
					const isPastingOverLayoutColumns = hasParentNodeOfType(state.schema.nodes.layoutColumn)(
						state.selection,
					);

					// don't add closeHistory call if we're pasting a table, as some tables may involve additional
					// appendedTransactions to repair them (if they're partial or incomplete) and we don't want
					// to split those repairing transactions in prosemirror-history when they're being added to the
					// "done" stack
					const isPastingTable = tr.steps.some((step) => {
						const slice = extractSliceFromStep(step);
						let tableExists = false;

						slice?.content?.forEach((node) => {
							if (node.type === state.schema.nodes.table) {
								tableExists = true;
							}
						});

						return tableExists;
					});

					if (
						!isPastingTextInsidePlaceholderText &&
						!isPastingTable &&
						!isPastingOverLayoutColumns &&
						pluginInjectionApi?.betterTypeHistory
					) {
						tr = pluginInjectionApi?.betterTypeHistory?.actions.flagPasteEvent(tr);
					}

					const isDocChanged = tr.docChanged;

					addLinkMetadata(view.state.selection, tr, {
						action: isPlainText ? ACTION.PASTED_AS_PLAIN : ACTION.PASTED,
						inputMethod: INPUT_METHOD.CLIPBOARD,
					});

					// handleMacroAutoConvert dispatches twice
					// we make sure to call paste options toolbar
					// only for a valid paste action
					if (isDocChanged) {
						const pastedSlice = getLastPastedSlice(tr);
						if (pastedSlice) {
							const pasteStartPos = state.selection.from;

							const pasteEndPos = tr.selection.to;
							const contentPasted: LastContentPasted = {
								pasteStartPos,
								pasteEndPos,
								text,
								isShiftPressed: Boolean(
									// eslint-disable-next-line @typescript-eslint/no-explicit-any
									(view as any).shiftKey || (view as any).input?.shiftKey,
								),
								isPlainText: Boolean(isPlainText),
								pastedSlice,
								pastedAt: Date.now(),
								pasteSource: getPasteSource(event),
							};
							tr.setMeta(stateKey, {
								type: PastePluginActionTypes.ON_PASTE,
								contentPasted,
							});
						}
					}

					// the handlePaste definition overrides the generic prosemirror behaviour which would previously
					// include a uiEvent meta of paste. To align with the docs (https://prosemirror.net/docs/ref/#state.Transaction)
					// This will re-add the uiEvent meta.
					view.dispatch(tr.setMeta('uiEvent', 'paste'));
				};

				slice = handleParagraphBlockMarks(state, slice);

				slice = handleVSCodeBlock({ state, slice, event, text });

				if (editorExperiment('platform_synced_block', true)) {
					slice = handleSyncBlocksPaste(
						slice,
						schema,
						getPasteSource(event),
						html,
						pasteWarningOptions,
						pluginInjectionApi,
					);
				}

				const plainTextPasteSlice = linkifyContent(state.schema)(slice);

				if (
					handlePasteAsPlainTextWithAnalytics(editorAnalyticsAPI)(view, event, plainTextPasteSlice)(
						state,
						dispatch,
						view,
					)
				) {
					return true;
				}

				if (fg('platform_editor_fix_captions_on_copy')) {
					if (
						handlePasteIntoCaptionWithAnalytics(editorAnalyticsAPI)(
							view,
							event,
							slice,
							PasteTypes.richText,
						)(state, dispatch)
					) {
						// Create a custom handler to avoid handling with handleRichText method
						// As SafeInsert is used inside handleRichText which caused some bad UX like this:
						// https://product-fabric.atlassian.net/browse/MEX-1520

						// Converting caption to plain text needs to be handled before transformSliceForMedia
						// as createChecked will fail when trying to create a mediaSingle node with a caption
						// that is not plain text.
						return true;
					}
				}

				// transform slices based on destination
				slice = transformSliceForMedia(slice, schema, pluginInjectionApi)(state.selection);

				let markdownSlice: Slice | undefined;
				if (isPlainText) {
					markdownSlice = getMarkdownSlice(text, slice.openStart, slice.openEnd);

					// https://product-fabric.atlassian.net/browse/ED-15134
					// Lists are not allowed within Blockquotes at this time. Attempting to
					// paste a markdown list ie. ">- foo" will yeild a markdownSlice of size 0.
					// Rather then blocking the paste action with no UI feedback, this will instead
					// force a "paste as plain text" action by clearing the markdownSlice.
					markdownSlice = !markdownSlice?.size ? undefined : markdownSlice;

					if (markdownSlice) {
						// linkify text prior to converting to macro
						if (
							handlePasteLinkOnSelectedTextWithAnalytics(editorAnalyticsAPI)(
								view,
								event,
								markdownSlice,
								PasteTypes.markdown,
							)(state, dispatch)
						) {
							return true;
						}

						// run macro autoconvert prior to other conversions
						if (
							handleMacroAutoConvert(
								text,
								markdownSlice,
								pluginInjectionApi?.card?.actions?.queueCardsFromChangedTr,
								pluginInjectionApi?.extension?.actions?.runMacroAutoConvert,
								cardOptions,
								extensionAutoConverter,
							)(state, dispatch, view)
						) {
							// TODO: ED-26959 - handleMacroAutoConvert dispatch twice, so we can't use the helper
							sendPasteAnalyticsEvent(editorAnalyticsAPI)(view, event, markdownSlice, {
								type: PasteTypes.markdown,
							});
							return true;
						}
					}
				}

				slice = transformUnsupportedBlockCardToInline(slice, state, cardOptions);

				// Handles edge case so that when copying text from the top level of the document
				// it can be pasted into nodes like panels/actions/decisions without removing them.
				// Overriding openStart to be 1 when only pasting a paragraph makes the preferred
				// depth favour the text, rather than the paragraph node.
				// https://github.com/ProseMirror/prosemirror-transform/blob/master/src/replace.js#:~:text=Transform.prototype.-,replaceRange,-%3D%20function(from%2C%20to
				const selectionDepth = state.selection.$head.depth;
				const selectionParentNode = state.selection.$head.node(selectionDepth - 1);
				const selectionParentType = selectionParentNode?.type;
				const edgeCaseNodeTypes = [
					schema.nodes?.panel,
					schema.nodes?.taskList,
					schema.nodes?.decisionList,
				];

				if (
					slice.openStart === 0 &&
					slice.openEnd !== 1 &&
					selectionParentNode &&
					edgeCaseNodeTypes.includes(selectionParentType)
				) {
					// @ts-ignore - [unblock prosemirror bump] assigning to readonly prop
					slice.openStart = 1;
				}

				// If we're in a code block, append the text contents of clipboard inside it
				if (
					handleCodeBlockWithAnalytics(editorAnalyticsAPI)(view, event, slice, text)(
						state,
						dispatch,
					)
				) {
					return true;
				}

				if (
					handleMediaSingleWithAnalytics(editorAnalyticsAPI)(
						view,
						event,
						slice,
						isPastedFile ? PasteTypes.binary : PasteTypes.richText,
						pluginInjectionApi?.media?.actions.insertMediaAsMediaSingle,
					)(state, dispatch, view)
				) {
					return true;
				}

				if (
					handleSelectedTableWithAnalytics(editorAnalyticsAPI)(view, event, slice)(state, dispatch)
				) {
					return true;
				}

				let isNestedMarkdownTable = false;

				// if paste a markdown table inside a table cell, we should treat it as a table slice
				const isParentNodeTdOrTh =
					selectionParentType === schema.nodes.tableCell ||
					selectionParentType === schema.nodes.tableHeader;

				isNestedMarkdownTable = !!(
					markdownSlice &&
					isPlainText &&
					isParentNodeTdOrTh &&
					getContentNodeTypes(markdownSlice.content).includes(schema.nodes.table?.name)
				);

				slice = isNestedMarkdownTable ? (markdownSlice as Slice) : slice;

				// get editor-tables to handle pasting tables if it can
				// otherwise, just the replace the selection with the content
				if (
					handlePasteTable(view, event, slice, {
						pasteSource: getPasteSource(event),
					})
				) {
					sendPasteAnalyticsEvent(editorAnalyticsAPI)(view, event, slice, {
						type: PasteTypes.richText,
					});
					return true;
				}

				// handle paste of nested tables to ensure nesting limits are respected
				if (
					handleNestedTablePasteWithAnalytics(
						editorAnalyticsAPI,
						isNestedTablesSupported(state.schema),
					)(
						view,
						event,
						slice,
					)(state, dispatch)
				) {
					return true;
				}

				if (
					handlePasteIntoTaskAndDecisionWithAnalytics(
						view,
						event,
						slice,
						isPlainText ? PasteTypes.plain : PasteTypes.richText,
						pluginInjectionApi,
					)(state, dispatch)
				) {
					return true;
				}

				// If the clipboard only contains plain text, attempt to parse it as Markdown
				if (isPlainText && markdownSlice && !isNestedMarkdownTable) {
					if (
						handlePastePreservingMarksWithAnalytics(
							view,
							event,
							markdownSlice,
							PasteTypes.markdown,
							pluginInjectionApi,
						)(state, dispatch)
					) {
						return true;
					}

					return handleMarkdownWithAnalytics(
						view,
						event,
						markdownSlice,
						pluginInjectionApi,
					)(state, dispatch);
				}

				if (isRichText && isInsideBlockQuote(state)) {
					//If pasting inside blockquote
					//Skip the blockquote node and keep remaining nodes as they are
					//prevent doing this if there is list inside blockquote as the list is pasted incorrectly inside blockquote due to wrong openStart and openEnd
					const { blockquote } = schema.nodes;
					const children = [] as PMNode[];

					mapChildren(slice.content, (node: PMNode) => {
						if (node.type === blockquote && !contains(node, state.schema.nodes.listItem)) {
							for (let i = 0; i < node.childCount; i++) {
								children.push(node.child(i));
							}
						} else {
							children.push(node);
						}
					});

					slice = new Slice(Fragment.fromArray(children), slice.openStart, slice.openEnd);
				}

				// finally, handle rich-text copy-paste
				if (isRichText || isNestedMarkdownTable) {
					// linkify the text where possible
					slice = linkifyContent(state.schema)(slice);

					if (
						handlePasteLinkOnSelectedTextWithAnalytics(editorAnalyticsAPI)(
							view,
							event,
							slice,
							PasteTypes.richText,
						)(state, dispatch)
					) {
						return true;
					}

					// run macro autoconvert prior to other conversions
					if (
						handleMacroAutoConvert(
							text,
							slice,
							pluginInjectionApi?.card?.actions?.queueCardsFromChangedTr,
							pluginInjectionApi?.extension?.actions?.runMacroAutoConvert,
							cardOptions,
							extensionAutoConverter,
						)(state, dispatch, view)
					) {
						// TODO: ED-26959 - handleMacroAutoConvert dispatch twice, so we can't use the helper
						sendPasteAnalyticsEvent(editorAnalyticsAPI)(view, event, slice, {
							type: PasteTypes.richText,
						});
						return true;
					}

					// Special handling for SharePoint URLs generated from Share button
					// eslint-disable-next-line @atlaskit/platform/no-preconditioning
					if (
						isSharePointUrl(text) &&
						(fg('platform_editor_sharepoint_url_smart_card_fallback') ||
							fg('platform_editor_sharepoint_url_smart_card_jira'))
					) {
						// Create an inline card directly for SharePoint URLs to show the "Connect" button
						const inlineCardNode = schema.nodes.inlineCard.create({
							url: text,
						});

						const cardSlice = new Slice(Fragment.from(inlineCardNode), 0, 0);
						if (dispatch) {
							dispatch(state.tr.replaceSelection(cardSlice));
						}
						return true;
					}

					// handle the case when copy content from a table cell inside bodied extension
					if (handleTableContentPasteInBodiedExtension(slice)(state, dispatch)) {
						return true;
					}
					// remove annotation marks from the pasted data if they are not present in the document
					// for the cases when they are pasted from external pages
					if (slice.content.size && containsAnyAnnotations(slice, state)) {
						pluginInjectionApi?.annotation?.actions.stripNonExistingAnnotations(slice, state);
					}

					if (
						handlePastePreservingMarksWithAnalytics(
							view,
							event,
							slice,
							PasteTypes.richText,
							pluginInjectionApi,
						)(state, dispatch)
					) {
						return true;
					}

					// Check that we are pasting in a location that does not accept
					// breakout marks, if so we strip the mark and paste. Note that
					// breakout marks are only valid in the root document.
					if (selectionParentType !== state.schema.nodes.doc) {
						const sliceCopy = Slice.fromJSON(state.schema, slice.toJSON() || {});

						sliceCopy.content.descendants((node) => {
							// @ts-ignore - [unblock prosemirror bump] assigning to readonly prop
							node.marks = node.marks.filter((mark) => mark.type.name !== 'breakout');
							// as breakout marks should only be on top level nodes,
							// we don't traverse the entire document
							return false;
						});

						slice = sliceCopy;
					}

					if (handleExpandWithAnalytics(editorAnalyticsAPI)(view, event, slice)(state, dispatch)) {
						return true;
					}

					if (!insideTable(state)) {
						slice = transformSliceNestedExpandToExpand(slice, state.schema);
					}

					if (!fg('platform_editor_fix_captions_on_copy')) {
						if (
							handlePasteIntoCaptionWithAnalytics(editorAnalyticsAPI)(
								view,
								event,
								slice,
								PasteTypes.richText,
							)(state, dispatch)
						) {
							// Create a custom handler to avoid handling with handleRichText method
							// As SafeInsert is used inside handleRichText which caused some bad UX like this:
							// https://product-fabric.atlassian.net/browse/MEX-1520
							return true;
						}
					}

					if (
						handlePastePanelOrDecisionIntoListWithAnalytics(editorAnalyticsAPI)(
							view,
							event,
							slice,
							pluginInjectionApi?.list?.actions.findRootParentListNode,
						)(state, dispatch)
					) {
						return true;
					}

					if (
						handlePasteNonNestableBlockNodesIntoListWithAnalytics(editorAnalyticsAPI)(
							view,
							event,
							slice,
						)(state, dispatch)
					) {
						return true;
					}

					return handleRichTextWithAnalytics(
						view,
						event,
						slice,
						pluginInjectionApi,
					)(state, dispatch);
				}
				return false;
			},
			transformPasted(slice) {
				if (sanitizePrivateContent) {
					slice = handleMention(slice, schema);
				}

				/* Bitbucket copies diffs as multiple adjacent code blocks
				 * so we merge ALL adjacent code blocks to support paste here */
				if (pastedFromBitBucket) {
					slice = transformSliceToJoinAdjacentCodeBlocks(slice);
				}

				slice = transformSingleLineCodeBlockToCodeMark(slice, schema);

				slice = transformSliceToCorrectMediaWrapper(slice, schema);

				slice = transformSliceToMediaSingleWithNewExperience(slice, schema, pluginInjectionApi);

				slice = transformSliceToDecisionList(slice, schema);

				// splitting linebreaks into paragraphs must happen before upgrading text to lists
				slice = splitParagraphs(slice, schema);
				slice = upgradeTextToLists(slice, schema);

				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				if (slice.content.childCount && slice.content.lastChild!.type === schema.nodes.codeBlock) {
					slice = new Slice(slice.content, 0, 0);
				}

				if (!editorExperiment('single_column_layouts', true)) {
					slice = transformSingleColumnLayout(slice, schema);
				}

				slice = transformSliceToRemoveMacroId(slice, schema);

				return slice;
			},
			transformPastedHTML(html) {
				// Fix for issue ED-4438
				// text from google docs should not be pasted as inline code
				if (html.indexOf('id="docs-internal-guid-') >= 0) {
					// Ignored via go/ees005
					// eslint-disable-next-line require-unicode-regexp
					html = html.replace(/white-space:pre/g, '');
					// Ignored via go/ees005
					// eslint-disable-next-line require-unicode-regexp
					html = html.replace(/white-space:pre-wrap/g, '');
				}

				// Partial fix for ED-7331: During a copy/paste from the legacy tinyMCE
				// confluence editor, if we encounter an incomplete table (e.g. table elements
				// not wrapped in <table>), we try to rebuild a complete, valid table if possible.
				if (
					mostRecentPasteEvent &&
					isPastedFromTinyMCEConfluence(mostRecentPasteEvent, html) &&
					htmlHasIncompleteTable(html)
				) {
					const completeTableHtml = tryRebuildCompleteTableHtml(html);
					if (completeTableHtml) {
						html = completeTableHtml;
					}
				}

				if (!isPastedFromWord(html) && !isPastedFromExcel(html) && html.indexOf('<img ') >= 0) {
					html = unwrapNestedMediaElements(html);
				}

				// https://product-fabric.atlassian.net/browse/ED-11714
				// Checking for edge case when copying a list item containing links from Notion
				// The html from this case is invalid with duplicate nested links
				if (htmlHasInvalidLinkTags(html)) {
					html = removeDuplicateInvalidLinks(html);
				}

				// Fix for ED-13568: Code blocks being copied/pasted when next to each other get merged
				pastedFromBitBucket = html.indexOf('data-qa="code-line"') >= 0;

				// Remove breakout marks HTML around sync block renderer nodes
				// so the breakout mark doesn't get applied to the wrong nodes
				if (
					html.indexOf(SyncBlockRendererDataAttributeName) >= 0 &&
					editorExperiment('platform_synced_block', true)
				) {
					html = removeBreakoutFromRendererSyncBlockHTML(html);
				}

				mostRecentPasteEvent = null;
				return html;
			},
		},
	});
}
