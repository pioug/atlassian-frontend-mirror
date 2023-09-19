import type ClipboardPolyfill from 'clipboard-polyfill';
import * as clipboard from 'clipboard-polyfill';

import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';

import type {
  ACTION,
  AnalyticsEventPayload,
  SelectCellAEP,
  SelectNodeAEP,
  SelectRangeAEP,
} from '../analytics';
import { ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../analytics';
import {
  getAllSelectionAnalyticsPayload,
  getCellSelectionAnalyticsPayload,
  getNodeSelectionAnalyticsPayload,
  getRangeSelectionAnalyticsPayload,
} from '../selection';

const isClipboardApiSupported = () =>
  !!navigator.clipboard && typeof navigator.clipboard.writeText === 'function';

const isIEClipboardApiSupported = () =>
  (window as any).clipboardData &&
  typeof (window as any).clipboardData.setData === 'function';

export const copyToClipboard = async (textToCopy: string) => {
  if (isClipboardApiSupported()) {
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (error) {
      throw new Error('Clipboard api is not supported');
    }
  } else if (isIEClipboardApiSupported()) {
    try {
      await (window as any).clipboardData.setData('text', textToCopy);
    } catch (error) {
      throw new Error('IE clipboard api is not supported');
    }
  } else {
    throw new Error('Clipboard api is not supported');
  }
};

export const copyHTMLToClipboard = async (
  elementToCopy: HTMLElement,
  plainTextToCopy?: string,
) => {
  // @ts-ignore
  if (isClipboardApiSupported() && typeof ClipboardItem !== 'undefined') {
    try {
      const data = new ClipboardItem({
        'text/plain': new Blob([plainTextToCopy || elementToCopy.innerText], {
          type: 'text/plain',
        }),
        'text/html': new Blob([elementToCopy.innerHTML], {
          type: 'text/html',
        }),
      });
      // @ts-ignore
      await navigator.clipboard.write([data]);
    } catch (error) {
      throw new Error('Clipboard api is not supported');
    }
  } else if (typeof document !== undefined) {
    // ED-17083 extension copy seems have issue with ClipboardItem API
    // Hence of use of this polyfill
    copyHTMLToClipboardPolyfill(elementToCopy, plainTextToCopy);
  }
};

// At the time of development, Firefox doesn't support ClipboardItem API
// Hence of use of this polyfill
export const copyHTMLToClipboardPolyfill = (
  elementToCopy: HTMLElement,
  plainTextToCopy?: string,
) => {
  const Clipboard: typeof ClipboardPolyfill = clipboard as any;
  const dt = new Clipboard.DT();
  dt.setData('text/plain', plainTextToCopy || elementToCopy.innerText);
  dt.setData('text/html', elementToCopy.innerHTML);
  Clipboard.write(dt);
};

export const getAnalyticsPayload = (
  state: EditorState,
  action: ACTION.CUT | ACTION.COPIED,
): AnalyticsEventPayload | undefined => {
  const { selection, doc } = state;
  const selectionAnalyticsPayload =
    getNodeSelectionAnalyticsPayload(selection) ||
    getRangeSelectionAnalyticsPayload(selection, doc) ||
    getAllSelectionAnalyticsPayload(selection) ||
    getCellSelectionAnalyticsPayload(state);

  if (selectionAnalyticsPayload) {
    const { actionSubjectId: selectionActionSubjectId } =
      selectionAnalyticsPayload;

    let content: string[] = [];
    switch (selectionActionSubjectId) {
      case ACTION_SUBJECT_ID.NODE:
        content.push(
          (selectionAnalyticsPayload as SelectNodeAEP).attributes!.node,
        );
        break;
      case ACTION_SUBJECT_ID.RANGE:
        content.push(
          ...(selectionAnalyticsPayload as SelectRangeAEP).attributes!.nodes,
        );
        break;
      case ACTION_SUBJECT_ID.ALL:
        content.push('all');
        break;
      case ACTION_SUBJECT_ID.CELL: {
        const { selectedCells } = (selectionAnalyticsPayload as SelectCellAEP)
          .attributes!;
        content.push(...Array(selectedCells).fill('tableCell'));
        break;
      }
    }

    return {
      eventType: EVENT_TYPE.TRACK,
      action,
      actionSubject: ACTION_SUBJECT.DOCUMENT,
      attributes: {
        content,
      },
    };
  }

  if (selection instanceof TextSelection && selection.$cursor) {
    return {
      eventType: EVENT_TYPE.TRACK,
      action,
      actionSubject: ACTION_SUBJECT.DOCUMENT,
      attributes: {
        content: ['caret'],
      },
    };
  }
};
