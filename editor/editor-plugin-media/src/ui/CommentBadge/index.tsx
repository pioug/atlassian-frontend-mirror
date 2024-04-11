import React, { useCallback } from 'react';

import type { IntlShape } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { CommentBadge as CommentBadgeComponent } from '@atlaskit/editor-common/media-single';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { MediaNextEditorPluginType } from '../../next-plugin-type';
import type { getPosHandler } from '../../types';

type CommentBadgeProps = {
  intl: IntlShape;
  api: ExtractInjectionAPI<MediaNextEditorPluginType>;
  mediaNode: PMNode | null;
  view: EditorView;
  getPos: getPosHandler;
};

const CommentBadgeWrapper = ({
  api,
  mediaNode,
  view,
  getPos,
  intl,
}: CommentBadgeProps) => {
  const { annotationState } = useSharedPluginState(api, ['annotation']);
  const {
    state: {
      schema: {
        nodes: { media },
        marks: { annotation },
      },
    },
    state,
    dispatch,
  } = view;

  const onClick = useCallback(() => {
    if (api.annotation && mediaNode) {
      const { showCommentForBlockNode } = api.annotation.actions;
      showCommentForBlockNode(mediaNode)(state, dispatch);
    }
  }, [api.annotation, dispatch, mediaNode, state]);

  const pos = getPos();

  if (
    !Number.isFinite(pos) ||
    !annotationState ||
    !mediaNode ||
    mediaNode.type !== media ||
    mediaNode.marks.every(
      maybeAnnotation =>
        maybeAnnotation.type !== annotation ||
        !(maybeAnnotation.attrs.id in annotationState.annotations) ||
        annotationState.annotations[maybeAnnotation.attrs.id],
    )
  ) {
    return null;
  }

  const mediaElement = view.domAtPos((pos as number) + 1).node as HTMLElement;

  return (
    <CommentBadgeComponent
      width={mediaNode.attrs.width}
      height={mediaNode.attrs.height}
      onClick={onClick}
      mediaElement={mediaElement}
      intl={intl}
      isEditor
    />
  );
};

export const CommentBadge = injectIntl(CommentBadgeWrapper);
