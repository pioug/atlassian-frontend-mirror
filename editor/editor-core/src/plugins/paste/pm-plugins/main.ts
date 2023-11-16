import type {
  Schema,
  Node,
  Node as PMNode,
} from '@atlaskit/editor-prosemirror/model';
import { Slice, Fragment } from '@atlaskit/editor-prosemirror/model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import uuid from 'uuid';
import { MarkdownTransformer } from '@atlaskit/editor-markdown-transformer';
import type { CardOptions } from '@atlaskit/editor-common/card';
import { addLinkMetadata } from '@atlaskit/editor-common/card';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import {
  containsAnyAnnotations,
  extractSliceFromStep,
  linkifyContent,
  mapChildren,
  measureRender,
} from '@atlaskit/editor-common/utils';
import { handlePaste as handlePasteTable } from '@atlaskit/editor-tables/utils';
import type {
  ExtensionProvider,
  ExtensionAutoConvertHandler,
} from '@atlaskit/editor-common/extensions';
import { getExtensionAutoConvertersFromProvider } from '@atlaskit/editor-common/extensions';

import {
  ACTION,
  INPUT_METHOD,
  PasteTypes,
} from '@atlaskit/editor-common/analytics';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';

import {
  md,
  isPastedFile as isPastedFileFromEvent,
} from '@atlaskit/editor-common/paste';
import {
  transformSliceForMedia,
  transformSliceToCorrectMediaWrapper,
  transformSliceToMediaSingleWithNewExperience,
  unwrapNestedMediaElements,
} from '../plugins/media';

import {
  escapeLinks,
  htmlContainsSingleFile,
  isPastedFromWord,
  isPastedFromExcel,
  htmlHasInvalidLinkTags,
  removeDuplicateInvalidLinks,
  transformUnsupportedBlockCardToInline,
  getPasteSource,
} from '../util';
import {
  transformSliceNestedExpandToExpand,
  transformSliceToJoinAdjacentCodeBlocks,
  transformSingleLineCodeBlockToCodeMark,
  transformSliceToDecisionList,
} from '@atlaskit/editor-common/transforms';
import {
  handleMacroAutoConvert,
  handleMention,
  handleParagraphBlockMarks,
} from '../handlers';
import {
  createPasteMeasurePayload,
  getContentNodeTypes,
  handlePasteAsPlainTextWithAnalytics,
  handlePasteIntoTaskAndDecisionWithAnalytics,
  handleCodeBlockWithAnalytics,
  handleMediaSingleWithAnalytics,
  handlePastePreservingMarksWithAnalytics,
  handleMarkdownWithAnalytics,
  handleRichTextWithAnalytics,
  handleExpandWithAnalytics,
  handleSelectedTableWithAnalytics,
  handlePasteLinkOnSelectedTextWithAnalytics,
  sendPasteAnalyticsEvent,
  handlePasteIntoCaptionWithAnalytics,
  handlePastePanelOrDecisionIntoListWithAnalytics,
  handlePasteNonNestableBlockNodesIntoListWithAnalytics,
} from './analytics';
import { isInsideBlockQuote, insideTable, measurements } from '../../../utils';
import { upgradeTextToLists, splitParagraphs } from '../commands';
// TODO: ED-20519 It requires annotation extraction to use the plugin injection API
import { stripNonExistingAnnotations } from '../../annotation/utils';
import { clipboardTextSerializer } from './clipboard-text-serializer';
import {
  htmlHasIncompleteTable,
  tryRebuildCompleteTableHtml,
  isPastedFromTinyMCEConfluence,
} from '../util/tinyMCE';

import { pluginKey as stateKey, createPluginState } from './plugin-factory';
export { pluginKey as stateKey } from './plugin-factory';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import type {
  FeatureFlags,
  ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import { hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { LastContentPasted } from '@atlaskit/editor-plugin-paste';
import { PastePluginActionTypes } from '../actions';
import type { PastePlugin } from '../';

export function createPlugin(
  schema: Schema,
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
  dispatch: Dispatch,
  featureFlags: FeatureFlags,
  pluginInjectionApi: ExtractInjectionAPI<PastePlugin> | undefined,
  cardOptions?: CardOptions,
  sanitizePrivateContent?: boolean,
  providerFactory?: ProviderFactory,
) {
  const editorAnalyticsAPI = pluginInjectionApi?.analytics?.actions;
  const atlassianMarkDownParser = new MarkdownTransformer(schema, md);

  function getMarkdownSlice(
    text: string,
    openStart: number,
    openEnd: number,
  ): Slice | undefined {
    let textInput: string = escapeBackslashExceptCodeblock(text);

    const doc = atlassianMarkDownParser.parse(escapeLinks(textInput));
    if (doc && doc.content) {
      return new Slice(doc.content, openStart, openEnd);
    }
    return;
  }

  function escapeBackslashExceptCodeblock(textInput: string): string {
    const codeToken = '```';
    if (!textInput.includes(codeToken)) {
      return textInput.replace(/\\/g, '\\\\');
    }
    let isInsideCodeblock = false;
    let textSplitByNewLine = textInput.split('\n');
    // In the splitted array, we traverse through every line and check if it will be parsed as a codeblock.
    textSplitByNewLine = textSplitByNewLine.map((text) => {
      if (text === codeToken) {
        isInsideCodeblock = !isInsideCodeblock;
      } else if (text.startsWith(codeToken) && isInsideCodeblock === false) {
        // if there is some text after the ``` mark , it gets counted as language attribute only at the start of codeblock
        isInsideCodeblock = true;
      }
      if (!isInsideCodeblock) {
        // only escape text which is not inside a codeblock
        text = text.replace(/\\/g, '\\\\');
      }
      return text;
    });
    textInput = textSplitByNewLine.join('\n');

    return textInput;
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
      extensionAutoConverter = await getExtensionAutoConvertersFromProvider(
        extensionProviderPromise,
      );
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
      pastedMacroPositions: {},
      lastContentPasted: null,
    }),
    props: {
      // For serialising to plain text
      clipboardTextSerializer,
      handleDOMEvents: {
        paste: (view, event) => {
          mostRecentPasteEvent = event as ClipboardEvent;
          return false;
        },
      },
      handlePaste(view, rawEvent, slice) {
        const event = rawEvent as ClipboardEvent;
        if (!event.clipboardData) {
          return false;
        }

        let text = event.clipboardData.getData('text/plain');
        const html = event.clipboardData.getData('text/html');
        const uriList = event.clipboardData.getData('text/uri-list');
        // Links copied from iOS Safari share button only have the text/uri-list data type
        // ProseMirror don't do anything with this type so we want to make our own open slice
        // with url as text content so link is pasted inline
        if (uriList && !text && !html) {
          text = uriList;
          slice = new Slice(Fragment.from(schema.text(text)), 1, 1);
        }

        if (text?.includes('\r')) {
          text = text.replace(/\r/g, '');
        }

        const isPastedFile = isPastedFileFromEvent(event);
        const isPlainText = text && !html;
        const isRichText = !!html;

        // Bail if copied content has files
        if (isPastedFile) {
          if (!html) {
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
           */

          if (htmlContainsSingleFile(html)) {
            return true;
          }

          event.stopPropagation();
        }

        const { state } = view;
        const analyticsPlugin =
          pluginInjectionApi?.analytics?.sharedState?.currentState();
        const pasteTrackingEnabled =
          analyticsPlugin?.performanceTracking?.pasteTracking?.enabled;

        if (pasteTrackingEnabled) {
          const content = getContentNodeTypes(slice.content);
          const pasteId = uuid();
          const measureName = `${measurements.PASTE}_${pasteId}`;
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
          });
        }
        // creating a custom dispatch because we want to add a meta whenever we do a paste.
        const dispatch = (tr: Transaction) => {
          // https://product-fabric.atlassian.net/browse/ED-12633
          // don't add closeHistory call if we're pasting a text inside placeholder text as we want the whole action
          // to be atomic
          const { placeholder } = state.schema.nodes;
          const isPastingTextInsidePlaceholderText =
            state.doc.resolve(state.selection.$anchor.pos).nodeAfter?.type ===
            placeholder;

          // Don't add closeHistory if we're pasting over layout columns, as we will appendTransaction
          // to cleanup the layout's structure and we want to keep the paste and re-structuring as
          // one event.
          const isPastingOverLayoutColumns = hasParentNodeOfType(
            state.schema.nodes.layoutColumn,
          )(state.selection);

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
            tr =
              pluginInjectionApi?.betterTypeHistory?.actions.flagPasteEvent(tr);
          }

          addLinkMetadata(view.state.selection, tr, {
            action: isPlainText ? ACTION.PASTED_AS_PLAIN : ACTION.PASTED,
            inputMethod: INPUT_METHOD.CLIPBOARD,
          });

          const pasteStartPos = Math.min(
            state.selection.anchor,
            state.selection.head,
          );
          const pasteEndPos = tr.selection.to;

          const contentPasted: LastContentPasted = {
            pasteStartPos,
            pasteEndPos,
            text,
            isShiftPressed: Boolean(
              (view as any).shiftKey || (view as any).input?.shiftKey,
            ),
            isPlainText: Boolean(isPlainText),
            pastedSlice: tr.doc.slice(pasteStartPos, pasteEndPos),
            pastedAt: Date.now(),
            pasteSource: getPasteSource(event),
          };

          tr.setMeta(stateKey, {
            type: PastePluginActionTypes.ON_PASTE,
            contentPasted,
          });

          view.dispatch(tr);
        };

        slice = handleParagraphBlockMarks(state, slice);

        const plainTextPasteSlice = linkifyContent(state.schema)(slice);

        if (
          handlePasteAsPlainTextWithAnalytics(editorAnalyticsAPI)(
            view,
            event,
            plainTextPasteSlice,
          )(state, dispatch, view)
        ) {
          return true;
        }

        // transform slices based on destination
        slice = transformSliceForMedia(slice, schema)(state.selection);

        let markdownSlice: Slice | undefined;
        if (isPlainText) {
          markdownSlice = getMarkdownSlice(
            text,
            slice.openStart,
            slice.openEnd,
          );

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
              // TODO: handleMacroAutoConvert dispatch twice, so we can't use the helper
              sendPasteAnalyticsEvent(editorAnalyticsAPI)(
                view,
                event,
                markdownSlice,
                {
                  type: PasteTypes.markdown,
                },
              );
              return true;
            }
          }
        }

        slice = transformUnsupportedBlockCardToInline(
          slice,
          state,
          cardOptions,
        );

        // Handles edge case so that when copying text from the top level of the document
        // it can be pasted into nodes like panels/actions/decisions without removing them.
        // Overriding openStart to be 1 when only pasting a paragraph makes the preferred
        // depth favour the text, rather than the paragraph node.
        // https://github.com/ProseMirror/prosemirror-transform/blob/master/src/replace.js#:~:text=Transform.prototype.-,replaceRange,-%3D%20function(from%2C%20to
        const selectionDepth = state.selection.$head.depth;
        const selectionParentNode = state.selection.$head.node(
          selectionDepth - 1,
        );
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

        // If we're in a code block, append the text contents of clipboard inside it
        if (
          handleCodeBlockWithAnalytics(editorAnalyticsAPI)(
            view,
            event,
            slice,
            text,
          )(state, dispatch)
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
          handleSelectedTableWithAnalytics(editorAnalyticsAPI)(
            view,
            event,
            slice,
          )(state, dispatch)
        ) {
          return true;
        }

        // If the clipboard only contains plain text, attempt to parse it as Markdown
        if (isPlainText && markdownSlice) {
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
          const { blockquote } = schema.nodes;
          const children = [] as PMNode[];

          mapChildren(slice.content, (node: PMNode) => {
            if (node.type === blockquote) {
              for (let i = 0; i < node.childCount; i++) {
                children.push(node.child(i));
              }
            } else {
              children.push(node);
            }
          });

          slice = new Slice(
            Fragment.fromArray(children),
            slice.openStart,
            slice.openEnd,
          );
        }

        // finally, handle rich-text copy-paste
        if (isRichText) {
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
            // TODO: handleMacroAutoConvert dispatch twice, so we can't use the helper
            sendPasteAnalyticsEvent(editorAnalyticsAPI)(view, event, slice, {
              type: PasteTypes.richText,
            });
            return true;
          }

          // get editor-tables to handle pasting tables if it can
          // otherwise, just the replace the selection with the content
          if (handlePasteTable(view, null, slice)) {
            sendPasteAnalyticsEvent(editorAnalyticsAPI)(view, event, slice, {
              type: PasteTypes.richText,
            });
            return true;
          }

          // remove annotation marks from the pasted data if they are not present in the document
          // for the cases when they are pasted from external pages
          if (slice.content.size && containsAnyAnnotations(slice, state)) {
            stripNonExistingAnnotations(slice, state);
          }

          // ED-4732
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
            const sliceCopy = Slice.fromJSON(
              state.schema,
              slice.toJSON() || {},
            );

            sliceCopy.content.descendants((node) => {
              // @ts-ignore - [unblock prosemirror bump] assigning to readonly prop
              node.marks = node.marks.filter(
                (mark) => mark.type.name !== 'breakout',
              );
              // as breakout marks should only be on top level nodes,
              // we don't traverse the entire document
              return false;
            });

            slice = sliceCopy;
          }

          if (
            handleExpandWithAnalytics(editorAnalyticsAPI)(view, event, slice)(
              state,
              dispatch,
            )
          ) {
            return true;
          }

          if (!insideTable(state)) {
            slice = transformSliceNestedExpandToExpand(slice, state.schema);
          }

          // Create a custom handler to avoid handling with handleRichText method
          // As SafeInsert is used inside handleRichText which caused some bad UX like this:
          // https://product-fabric.atlassian.net/browse/MEX-1520
          if (
            handlePasteIntoCaptionWithAnalytics(editorAnalyticsAPI)(
              view,
              event,
              slice,
              PasteTypes.richText,
            )(state, dispatch)
          ) {
            return true;
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
            featureFlags?.restartNumberedLists &&
            handlePasteNonNestableBlockNodesIntoListWithAnalytics(
              editorAnalyticsAPI,
            )(
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

        slice = transformSliceToMediaSingleWithNewExperience(slice, schema);

        slice = transformSliceToDecisionList(slice, schema);

        // splitting linebreaks into paragraphs must happen before upgrading text to lists
        slice = splitParagraphs(slice, schema);
        slice = upgradeTextToLists(slice, schema);

        if (
          slice.content.childCount &&
          slice.content.lastChild!.type === schema.nodes.codeBlock
        ) {
          slice = new Slice(
            slice.content.append(
              Fragment.from(schema.nodes.paragraph.createAndFill() as Node),
            ),
            slice.openStart,
            1,
          );
        }
        return slice;
      },
      transformPastedHTML(html) {
        // Fix for issue ED-4438
        // text from google docs should not be pasted as inline code
        if (html.indexOf('id="docs-internal-guid-') >= 0) {
          html = html.replace(/white-space:pre/g, '');
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

        if (
          !isPastedFromWord(html) &&
          !isPastedFromExcel(html) &&
          html.indexOf('<img ') >= 0
        ) {
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

        mostRecentPasteEvent = null;
        return html;
      },
    },
  });
}
