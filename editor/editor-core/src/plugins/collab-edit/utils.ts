import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type {
  EditorView,
  DecorationSet,
} from '@atlaskit/editor-prosemirror/view';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import * as themeColors from '@atlaskit/theme/colors';

import { hexToRgba } from '@atlaskit/adf-schema';
import { ZERO_WIDTH_JOINER } from '@atlaskit/editor-common/utils';
import type {
  AnalyticsEventPayload,
  EditorAnalyticsAPI,
} from '@atlaskit/editor-common/analytics';
import {
  EVENT_TYPE,
  ACTION,
  ACTION_SUBJECT,
} from '@atlaskit/editor-common/analytics';

import type {
  CollabParticipant,
  CollabEditOptions,
} from '@atlaskit/editor-common/collab';

export interface Color {
  solid: string;
  selection: string;
}

// TODO: https://product-fabric.atlassian.net/browse/DSP-7269
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
export const colors: Color[] = [
  themeColors.R100,
  themeColors.R300,
  themeColors.R500,
  themeColors.Y100,
  themeColors.Y300,
  themeColors.Y500,
  themeColors.G100,
  themeColors.G300,
  themeColors.G500,
  themeColors.T100,
  themeColors.T300,
  themeColors.T500,
  themeColors.B100,
  themeColors.B300,
  themeColors.B500,
  themeColors.P100,
  themeColors.P300,
  themeColors.P500,
  themeColors.N70,
  themeColors.N200,
  themeColors.N800,
].map((solid) => ({
  solid,
  selection: hexToRgba(solid, 0.2)!,
}));
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */

export const getAvatarColor = (str: string) => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    /* eslint-disable no-bitwise */
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
    /* eslint-enable no-bitwise */
  }

  const index = Math.abs(hash) % colors.length;

  return { index, color: colors[index] };
};

export const findPointers = (
  id: string,
  decorations: DecorationSet,
): Decoration[] =>
  decorations
    .find()
    .reduce(
      (arr, deco: any) =>
        deco.spec.pointer.sessionId === id ? arr.concat(deco) : arr,
      [],
    );

function style(options: { color: string }) {
  const color = (options && options.color) || 'black';
  return `border-left: 1px solid ${color}; border-right: 1px solid ${color}; margin-right: -2px;`;
}

export const createTelepointers = (
  from: number,
  to: number,
  sessionId: string,
  isSelection: boolean,
  initial: string,
) => {
  let decorations: Decoration[] = [];
  const avatarColor = getAvatarColor(sessionId);
  const color = avatarColor.index.toString();
  if (isSelection) {
    const className = `telepointer color-${color} telepointer-selection`;
    decorations.push(
      (Decoration as any).inline(
        from,
        to,
        { class: className, 'data-initial': initial },
        { pointer: { sessionId } },
      ),
    );
  }

  const spaceJoinerBefore = document.createElement('span');
  spaceJoinerBefore.textContent = ZERO_WIDTH_JOINER;
  const spaceJoinerAfter = document.createElement('span');
  spaceJoinerAfter.textContent = ZERO_WIDTH_JOINER;

  const cursor = document.createElement('span');
  cursor.textContent = ZERO_WIDTH_JOINER;
  cursor.className = `telepointer color-${color} telepointer-selection-badge`;
  cursor.style.cssText = `${style({ color: avatarColor.color.solid })};`;
  cursor.setAttribute('data-initial', initial);
  return decorations
    .concat(
      (Decoration as any).widget(to, spaceJoinerAfter, {
        pointer: { sessionId },
        key: `telepointer-${sessionId}-zero`,
      }),
    )
    .concat(
      (Decoration as any).widget(to, cursor, {
        pointer: { sessionId },
        key: `telepointer-${sessionId}`,
      }),
    )
    .concat(
      (Decoration as any).widget(to, spaceJoinerBefore, {
        pointer: { sessionId },
        key: `telepointer-${sessionId}-zero`,
      }),
    );
};

export const replaceDocument = (
  doc: any,
  state: EditorState,
  version?: number,
  options?: CollabEditOptions,
  reserveCursor?: boolean,
) => {
  const { schema, tr } = state;

  let content: Array<PMNode> = (doc.content || []).map((child: any) =>
    schema.nodeFromJSON(child),
  );
  let hasContent = !!content.length;

  if (hasContent) {
    tr.setMeta('addToHistory', false);
    tr.replaceWith(0, state.doc.nodeSize - 2, content!);
    const selection = state.selection;
    if (reserveCursor) {
      // If the cursor is still in the range of the new document,
      // keep where it was.
      if (selection.to < tr.doc.content.size - 2) {
        const $from = tr.doc.resolve(selection.from);
        const $to = tr.doc.resolve(selection.to);
        const newselection = new TextSelection($from, $to);
        tr.setSelection(newselection);
      }
    } else {
      tr.setSelection(Selection.atStart(tr.doc));
    }
    tr.setMeta('replaceDocument', true);

    if (typeof version !== undefined && options && options.useNativePlugin) {
      const collabState = { version, unconfirmed: [] };
      tr.setMeta('collab$', collabState);
    }
  }

  return tr;
};

export const scrollToCollabCursor = (
  editorView: EditorView,
  participants: CollabParticipant[],
  sessionId: string | undefined,
  // analytics: AnalyticsEvent | undefined,
  index: number,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
) => {
  const selectedUser = participants[index];
  if (
    selectedUser &&
    selectedUser.cursorPos !== undefined &&
    selectedUser.sessionId !== sessionId
  ) {
    const { state } = editorView;
    let tr = state.tr;
    const analyticsPayload: AnalyticsEventPayload = {
      action: ACTION.MATCHED,
      actionSubject: ACTION_SUBJECT.SELECTION,
      eventType: EVENT_TYPE.TRACK,
    };
    tr.setSelection(Selection.near(tr.doc.resolve(selectedUser.cursorPos)));
    editorAnalyticsAPI?.attachAnalyticsEvent(analyticsPayload)(tr);
    tr.scrollIntoView();
    editorView.dispatch(tr);
    if (!editorView.hasFocus()) {
      editorView.focus();
    }
  }
};

export const getPositionOfTelepointer = (
  sessionId: string,
  decorationSet: DecorationSet,
): undefined | number => {
  let scrollPosition;
  decorationSet.find().forEach((deco: any) => {
    if (deco.type.spec.pointer.sessionId === sessionId) {
      scrollPosition = deco.from;
    }
  });
  return scrollPosition;
};
