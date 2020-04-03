// @ts-ignore
import { handlePaste as handlePasteTable } from 'prosemirror-tables';
import { Schema, Slice, Node, Fragment } from 'prosemirror-model';
import { Plugin, PluginKey, EditorState } from 'prosemirror-state';
import { MarkdownTransformer } from '@atlaskit/editor-markdown-transformer';

import * as clipboard from '../../../utils/clipboard';
import { transformSliceForMedia } from '../../media/utils/media-single';

import { escapeLinks, htmlContainsSingleFile } from '../util';
import { linkifyContent } from '../../hyperlink/utils';
import { transformSliceToRemoveOpenBodiedExtension } from '../../extension/actions';
import { transformSliceToRemoveOpenLayoutNodes } from '../../layout/utils';
import { transformSliceNestedExpandToExpand } from '../../expand/utils';
import {
  transformSliceToRemoveOpenTable,
  transformSliceToCorrectEmptyTableCells,
  transformSliceToFixHardBreakProblemOnCopyFromCell,
} from '../../table/utils';
import { transformSliceToAddTableHeaders } from '../../table/commands';
import { handleMacroAutoConvert, handleMention } from '../handlers';
import {
  transformSliceToJoinAdjacentCodeBlocks,
  transformSingleLineCodeBlockToCodeMark,
} from '../../code-block/utils';
import {
  sendPasteAnalyticsEvent,
  handlePasteAsPlainTextWithAnalytics,
  handlePasteIntoTaskAndDecisionWithAnalytics,
  handleCodeBlockWithAnalytics,
  handleMediaSingleWithAnalytics,
  handlePastePreservingMarksWithAnalytics,
  handleMarkdownWithAnalytics,
  handleRichTextWithAnalytics,
  handleExpandWithAnalytics,
} from './analytics';
import { PasteTypes } from '../../analytics';
import { insideTable } from '../../../utils';
import { CardOptions } from '../../card';
import {
  transformSliceToCorrectMediaWrapper,
  unwrapNestedMediaElements,
} from '../../media/utils/media-common';
import {
  transformSliceToRemoveColumnsWidths,
  transformSliceRemoveCellBackgroundColor,
} from '../../table/commands/misc';
import { upgradeTextToLists, splitParagraphs } from '../../lists/transforms';
import { md } from '../md';
import { getPluginState as getTablePluginState } from '../../table/pm-plugins/plugin-factory';

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
  cardOptions?: CardOptions,
  sanitizePrivateContent?: boolean,
) {
  const atlassianMarkDownParser = new MarkdownTransformer(schema, md);

  function getMarkdownSlice(
    text: string,
    openStart: number,
    openEnd: number,
  ): Slice | undefined {
    const doc = atlassianMarkDownParser.parse(escapeLinks(text));
    if (doc && doc.content) {
      return new Slice(doc.content, openStart, openEnd);
    }
    return;
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

        const { state, dispatch } = view;

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

          // run macro autoconvert prior to other conversions
          if (
            markdownSlice &&
            handleMacroAutoConvert(text, markdownSlice, cardOptions)(
              state,
              dispatch,
              view,
            )
          ) {
            // TODO: handleMacroAutoConvert dispatch twice, so we can't use the helper
            sendPasteAnalyticsEvent(view, event, markdownSlice, {
              type: PasteTypes.markdown,
            });
            return true;
          }
        }

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
          // run macro autoconvert prior to other conversions
          if (
            handleMacroAutoConvert(text, slice, cardOptions)(
              state,
              dispatch,
              view,
            )
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

          // get prosemirror-tables to handle pasting tables if it can
          // otherwise, just the replace the selection with the content
          if (handlePasteTable(view, null, slice)) {
            sendPasteAnalyticsEvent(view, event, slice, {
              type: PasteTypes.richText,
            });
            return true;
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
        /** If a partial paste of table, paste only table's content */
        slice = transformSliceToRemoveOpenTable(slice, schema);

        // We do this separately so it also applies to drag/drop events
        slice = transformSliceToRemoveOpenLayoutNodes(slice, schema);

        /** If a partial paste of bodied extension, paste only text */
        slice = transformSliceToRemoveOpenBodiedExtension(slice, schema);

        /* Bitbucket copies diffs as multiple adjacent code blocks
         * so we merge ALL adjacent code blocks to support paste here */
        slice = transformSliceToJoinAdjacentCodeBlocks(slice);

        slice = transformSingleLineCodeBlockToCodeMark(slice, schema);

        slice = transformSliceToCorrectMediaWrapper(slice, schema);

        slice = transformSliceToCorrectEmptyTableCells(slice, schema);

        // this must happen before upgrading text to lists
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

        if (html.indexOf('<img ') >= 0) {
          html = unwrapNestedMediaElements(html);
        }

        return html;
      },
    },
  });
}
