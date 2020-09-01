import { EditorState, Selection } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import * as themeColors from '@atlaskit/theme/colors';

import { hexToRgba } from '@atlaskit/adf-schema';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common';

import { CollabEditOptions } from './types';

export interface Color {
  solid: string;
  selection: string;
}

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
].map(solid => ({
  solid,
  selection: hexToRgba(solid, 0.2)!,
}));

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

  const cursor = document.createElement('span');
  cursor.textContent = ZERO_WIDTH_SPACE;
  cursor.className = `telepointer color-${color} telepointer-selection-badge`;
  cursor.style.cssText = `${style({ color: avatarColor.color.solid })};`;
  cursor.setAttribute('data-initial', initial);
  return decorations.concat(
    (Decoration as any).widget(to, cursor, {
      pointer: { sessionId },
      key: `telepointer-${sessionId}`,
    }),
  );
};

export const replaceDocument = (
  doc: any,
  state: EditorState,
  version?: number,
  options?: CollabEditOptions,
) => {
  const { schema, tr } = state;

  let content: Array<PMNode> = (doc.content || []).map((child: any) =>
    schema.nodeFromJSON(child),
  );
  let hasContent = !!content.length;

  if (hasContent) {
    tr.setMeta('addToHistory', false);
    tr.replaceWith(0, state.doc.nodeSize - 2, content!);
    tr.setSelection(Selection.atStart(tr.doc));
    tr.setMeta('replaceDocument', true);

    if (typeof version !== undefined && options && options.useNativePlugin) {
      const collabState = { version, unconfirmed: [] };
      tr.setMeta('collab$', collabState);
    }
  }

  return tr;
};
