// @ts-ignore: outdated type definitions
import { handlePaste as handlePasteTable } from '@atlaskit/editor-tables/utils';
import { Schema, Slice, Node, Fragment } from 'prosemirror-model';
import { Plugin, PluginKey, EditorState, Transaction } from 'prosemirror-state';
import uuid from 'uuid';
import { MarkdownTransformer } from '@atlaskit/editor-markdown-transformer';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import {
  ExtensionProvider,
  getExtensionAutoConvertersFromProvider,
  ExtensionAutoConvertHandler,
} from '@atlaskit/editor-common/extensions';

import * as clipboard from '../../../utils/clipboard';
import { transformSliceForMedia } from '../../media/utils/media-single';

import {
  escapeLinks,
  htmlContainsSingleFile,
  isPastedFromWord,
  isPastedFromExcel,
  htmlHasInvalidLinkTags,
  removeDuplicateInvalidLinks,
} from '../util';
import { linkifyContent } from '../../hyperlink/utils';
import { transformSliceToRemoveOpenBodiedExtension } from '../../extension/actions';
import { transformSliceToRemoveOpenLayoutNodes } from '../../layout/utils';
import {
  transformSliceNestedExpandToExpand,
  transformSliceToRemoveOpenExpand,
} from '../../expand/utils';
import {
  transformSliceToRemoveOpenTable,
  transformSliceToCorrectEmptyTableCells,
  transformSliceToFixHardBreakProblemOnCopyFromCell,
} from '../../table/utils';
import { transformSliceToAddTableHeaders } from '../../table/commands';
import {
  handleMacroAutoConvert,
  handleMention,
  handleParagraphBlockMarks,
} from '../handlers';
import {
  transformSliceToJoinAdjacentCodeBlocks,
  transformSingleLineCodeBlockToCodeMark,
} from '../../code-block/utils';
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
} from './analytics';
import {
  analyticsPluginKey,
  DispatchAnalyticsEvent,
  PasteTypes,
} from '../../analytics';
import { insideTable, measurements } from '../../../utils';
import { CardOptions, measureRender } from '@atlaskit/editor-common';
import {
  transformSliceToCorrectMediaWrapper,
  unwrapNestedMediaElements,
} from '../../media/utils/media-common';
import {
  transformSliceToRemoveColumnsWidths,
  transformSliceRemoveCellBackgroundColor,
} from '../../table/commands/misc';
import { upgradeTextToLists, splitParagraphs } from '../../list/transforms';
import { md } from '../md';
import { getPluginState as getTablePluginState } from '../../table/pm-plugins/plugin-factory';
import { transformUnsupportedBlockCardToInline } from '../../card/utils';
import { transformSliceToDecisionList } from '../../tasks-and-decisions/utils';
import {
  containsAnyAnnotations,
  stripNonExistingAnnotations,
} from '../../annotation/utils';
import { pluginKey as betterTypePluginKey } from '../../base/pm-plugins/better-type-history';

export const stateKey = new PluginKey('pastePlugin');
export { md } from '../md';

function isHeaderRowRequired(state: EditorState) {
  const tableState = getTablePluginState(state);
  return tableState && tableState.pluginConfig.isHeaderRowRequired;
}

function isAllowResizingEnabled(state: EditorState) {
  const tableState = getTablePluginState(state);
  return tableState && tableState.pluginConfig.allowColumnResizing;
}

function isBackgroundCellAllowed(state: EditorState) {
  const tableState = getTablePluginState(state);
  return tableState && tableState.pluginConfig.allowBackgroundColor;
}

export function createPlugin(
  schema: Schema,
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
  cardOptions?: CardOptions,
  sanitizePrivateContent?: boolean,
  providerFactory?: ProviderFactory,
) {
  const atlassianMarkDownParser = new MarkdownTransformer(schema, md);

  function getMarkdownSlice(
    text: string,
    openStart: number,
    openEnd: number,
  ): Slice | undefined {
    let textInput: string = text;
    if (textInput.includes(':\\\\')) {
      textInput = textInput.replace(/:\\\\/g, ':\\\\\\\\');
    }

    const doc = atlassianMarkDownParser.parse(escapeLinks(textInput));
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

  return new Plugin({
    key: stateKey,
    props: {
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

        const isPastedFile = clipboard.isPastedFile(event);
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
        const analyticsPlugin = analyticsPluginKey.getState(state);
        const pasteTrackingEnabled =
          analyticsPlugin?.performanceTracking?.pasteTracking?.enabled;

        if (pasteTrackingEnabled) {
          const content = getContentNodeTypes(slice.content);
          const pasteId = uuid();
          const measureName = `${measurements.PASTE}_${pasteId}`;
          measureRender(measureName, (duration: number) => {
            const payload = createPasteMeasurePayload(view, duration, content);
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
          if (
            state.doc.resolve(state.selection.$anchor.pos).nodeAfter?.type !==
            placeholder
          ) {
            tr.setMeta(betterTypePluginKey, true);
          }
          view.dispatch(tr);
        };

        slice = handleParagraphBlockMarks(state, slice);

        if (
          handlePasteAsPlainTextWithAnalytics(view, event, slice)(
            state,
            dispatch,
            view,
          )
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

          if (markdownSlice) {
            // linkify text prior to converting to macro
            if (
              handlePasteLinkOnSelectedTextWithAnalytics(
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
                cardOptions,
                extensionAutoConverter,
              )(state, dispatch, view)
            ) {
              // TODO: handleMacroAutoConvert dispatch twice, so we can't use the helper
              sendPasteAnalyticsEvent(view, event, markdownSlice, {
                type: PasteTypes.markdown,
              });
              return true;
            }
          }
        }

        slice = transformUnsupportedBlockCardToInline(slice, state);

        if (
          handlePasteIntoTaskAndDecisionWithAnalytics(
            view,
            event,
            slice,
            isPlainText ? PasteTypes.plain : PasteTypes.richText,
          )(state, dispatch)
        ) {
          return true;
        }

        // If we're in a code block, append the text contents of clipboard inside it
        if (
          handleCodeBlockWithAnalytics(
            view,
            event,
            slice,
            text,
          )(state, dispatch)
        ) {
          return true;
        }

        if (
          handleMediaSingleWithAnalytics(
            view,
            event,
            slice,
            isPastedFile ? PasteTypes.binary : PasteTypes.richText,
          )(state, dispatch, view)
        ) {
          return true;
        }

        if (
          handleSelectedTableWithAnalytics(view, event, slice)(state, dispatch)
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
            )(state, dispatch)
          ) {
            return true;
          }

          return handleMarkdownWithAnalytics(
            view,
            event,
            markdownSlice,
          )(state, dispatch);
        }

        // finally, handle rich-text copy-paste
        if (isRichText) {
          // linkify the text where possible
          slice = linkifyContent(state.schema)(slice);

          if (
            handlePasteLinkOnSelectedTextWithAnalytics(
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
              cardOptions,
              extensionAutoConverter,
            )(state, dispatch, view)
          ) {
            // TODO: handleMacroAutoConvert dispatch twice, so we can't use the helper
            sendPasteAnalyticsEvent(view, event, slice, {
              type: PasteTypes.richText,
            });
            return true;
          }

          // if we're pasting to outside a table or outside a table
          // header, ensure that we apply any table headers to the first
          // row of content we see, if required
          if (!insideTable(state) && isHeaderRowRequired(state)) {
            slice = transformSliceToAddTableHeaders(slice, state.schema);
          }

          if (!isAllowResizingEnabled(state)) {
            slice = transformSliceToRemoveColumnsWidths(slice, state.schema);
          }

          // If we don't allow background on cells, we need to remove it
          // from the paste slice
          if (!isBackgroundCellAllowed(state)) {
            slice = transformSliceRemoveCellBackgroundColor(
              slice,
              state.schema,
            );
          }

          // get editor-tables to handle pasting tables if it can
          // otherwise, just the replace the selection with the content
          if (handlePasteTable(view, null, slice)) {
            sendPasteAnalyticsEvent(view, event, slice, {
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
            )(state, dispatch)
          ) {
            return true;
          }

          if (handleExpandWithAnalytics(view, event, slice)(state, dispatch)) {
            return true;
          }

          if (!insideTable(state)) {
            slice = transformSliceNestedExpandToExpand(slice, state.schema);
          }

          return handleRichTextWithAnalytics(
            view,
            event,
            slice,
          )(state, dispatch);
        }

        return false;
      },
      transformPasted(slice) {
        if (sanitizePrivateContent) {
          slice = handleMention(slice, schema);
        }

        slice = transformSliceToFixHardBreakProblemOnCopyFromCell(
          slice,
          schema,
        );

        // We do this separately so it also applies to drag/drop events
        // This needs to go before `transformSliceToRemoveOpenExpand`
        slice = transformSliceToRemoveOpenLayoutNodes(slice, schema);

        // If a partial paste of expand, paste only the content
        // This needs to go before `transformSliceToRemoveOpenTable`
        slice = transformSliceToRemoveOpenExpand(slice, schema);

        /** If a partial paste of table, paste only table's content */
        slice = transformSliceToRemoveOpenTable(slice, schema);

        /** If a partial paste of bodied extension, paste only text */
        slice = transformSliceToRemoveOpenBodiedExtension(slice, schema);

        /* Bitbucket copies diffs as multiple adjacent code blocks
         * so we merge ALL adjacent code blocks to support paste here */
        slice = transformSliceToJoinAdjacentCodeBlocks(slice);

        slice = transformSingleLineCodeBlockToCodeMark(slice, schema);

        slice = transformSliceToCorrectMediaWrapper(slice, schema);

        slice = transformSliceToCorrectEmptyTableCells(slice, schema);

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

        return html;
      },
    },
  });
}
