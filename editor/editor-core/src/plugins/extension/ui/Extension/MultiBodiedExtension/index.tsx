/** @jsx jsx */

import { jsx, css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { N30 } from '@atlaskit/theme/colors';
import React, { useState } from 'react';
import type { MultiBodiedExtensionActions } from '@atlaskit/editor-common/extensions';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { ADFEntity } from '@atlaskit/adf-utils/types';

export type TryExtensionHandlerType = (
  actions: MultiBodiedExtensionActions | undefined,
) => React.ReactElement | null;

type ActionsProps = {
  updateActiveChild: (index: number) => boolean;
  node: PmNode;
  editorView: EditorView;
  getPos: () => number | undefined;
};
type Props = {
  node: PmNode;
  handleContentDOMRef: (node: HTMLElement | null) => void;
  editorView: EditorView;
  getPos: () => number | undefined;
  tryExtensionHandler: TryExtensionHandlerType;
};

const useMultiBodiedExtensionActions = ({
  updateActiveChild,
  editorView,
  getPos,
  node,
}: ActionsProps) => {
  const actions: MultiBodiedExtensionActions = React.useMemo(() => {
    return {
      changeActive(index: number) {
        return updateActiveChild(index);
      },
      addChild() {
        const { state, dispatch } = editorView;

        if (node.content.childCount >= node.attrs.maxFrames) {
          // TODO: add proper log on this
          return false;
        }
        const p = state.schema.nodes.paragraph.createAndFill({});
        if (!p) {
          return false;
        }

        const frame = state.schema.nodes.extensionFrame.createAndFill({}, [p]);
        const pos = getPos();
        if (typeof pos !== 'number' || !frame) {
          return false;
        }

        const insertAt = Math.min(
          (pos || 1) + node.content.size,
          state.doc.content.size,
        );

        dispatch(state.tr.insert(insertAt, frame));
        return true;
      },
      getChildrenCount(): number {
        return node.content.childCount;
      },
      removeChild(index: number) {
        const pos = getPos();
        // TODO: Add child index validation here, don't trust this data
        if (typeof pos !== 'number' || typeof index !== 'number') {
          return false;
        }

        const { state, dispatch } = editorView;

        if (node.content.childCount === 1) {
          const tr = state.tr;
          tr.deleteRange(pos, pos + node.content.size);
          dispatch(tr);

          return true;
        }

        const $pos = state.doc.resolve(pos);
        const $startNodePos = state.doc.resolve($pos.start($pos.depth + 1));

        const startFramePosition = $startNodePos.posAtIndex(index);
        const maybeFrameNode = state.doc.nodeAt(startFramePosition);

        if (!maybeFrameNode) {
          return false;
        }
        const endFramePosition =
          maybeFrameNode.content.size + startFramePosition;

        const tr = state.tr;
        tr.deleteRange(startFramePosition, endFramePosition);
        dispatch(tr);
        return true;
      },
      updateParameters(parameters): boolean {
        const { state, dispatch } = editorView;
        const pos = getPos();
        if (typeof pos !== 'number') {
          return false;
        }
        const tr = state.tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          parameters,
        });
        dispatch(tr);
        return true;
      },
      getChildren(): Array<ADFEntity> {
        const { state } = editorView;
        const pos = getPos();
        if (typeof pos !== 'number') {
          return [];
        }
        const children = state.doc.nodeAt(pos)?.content;
        return children ? children.toJSON() : [];
      },
    };
  }, [node, editorView, getPos, updateActiveChild]);

  return actions;
};

const MultiBodiedExtension = ({
  node,
  handleContentDOMRef,
  getPos,
  tryExtensionHandler,
  editorView,
}: Props) => {
  const [activeChildIndex, setActiveChildIndex] = useState<number>(0);
  // Adding to avoid aliasing `this` for the callbacks
  const updateActiveChild = React.useCallback(
    (index: number) => {
      if (typeof index !== 'number') {
        // TODO: Make sure we log this somewhere if this happens
        setActiveChildIndex(0);
        return false;
      }

      setActiveChildIndex(index);
      return true;
    },
    [setActiveChildIndex],
  );

  const actions = useMultiBodiedExtensionActions({
    updateActiveChild,
    editorView,
    getPos,
    node,
  });

  const extensionHandlerResult = React.useMemo(() => {
    return tryExtensionHandler(actions);
  }, [tryExtensionHandler, actions]);

  const articleRef = React.useCallback(
    (node: HTMLElement | null) => {
      return handleContentDOMRef(node);
    },
    [handleContentDOMRef],
  );

  const containerCss = css`
    border: 1px solid ${token('color.border', N30)};
    padding: ${token('space.050', '4px')};
    .multiBodiedExtension-content-dom-wrapper > [data-extension-frame='true'] {
      display: none;
    }

    .multiBodiedExtension-content-dom-wrapper
      > [data-extension-frame='true']:nth-of-type(${activeChildIndex + 1}) {
      display: block;
    }
  `;

  return (
    <section
      className="multiBodiedExtension--container"
      css={containerCss}
      data-testid="multiBodiedExtension--container"
      data-active-child-index={activeChildIndex}
    >
      <nav
        className="multiBodiedExtension-navigation"
        data-testid="multiBodiedExtension-navigation"
      >
        {extensionHandlerResult}
      </nav>

      <article
        className="multiBodiedExtension--frames"
        data-testid="multiBodiedExtension--frames"
        ref={articleRef}
      />
    </section>
  );
};

export default MultiBodiedExtension;
