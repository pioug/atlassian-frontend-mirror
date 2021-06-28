import { useContext, useEffect } from 'react';
import {
  AnnotationState,
  AnnotationUpdateEvent,
} from '@atlaskit/editor-common';
import { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { AnnotationId, AnnotationTypes } from '@atlaskit/adf-schema';
import { ProvidersContext } from '../context';
import { RendererContext as ActionsContext } from '../../RendererActionsContext';

type Props = {
  adfDocument: JSONDocNode;
};
export const useLoadAnnotations = ({ adfDocument }: Props) => {
  const actions = useContext(ActionsContext);
  const providers = useContext(ProvidersContext);

  useEffect(() => {
    if (!providers) {
      return;
    }

    const {
      inlineComment: {
        getState: inlineCommentGetState,
        updateSubscriber: updateSubscriberInlineComment,
      },
    } = providers;

    const annotations = actions.getAnnotationMarks();
    // we don't want to request integrators for state with an empty list of ids.
    if (!annotations.length) {
      return;
    }
    const ids = annotations.map((mark) => mark.attrs.id);
    const cb = (data: AnnotationState<AnnotationTypes.INLINE_COMMENT>[]) => {
      if (!updateSubscriberInlineComment) {
        return;
      }

      const payload: Record<
        AnnotationId,
        AnnotationState<AnnotationTypes.INLINE_COMMENT>
      > = data.reduce(
        (acc, value) => ({
          ...acc,
          [value.id]: value,
        }),
        {},
      );

      updateSubscriberInlineComment.emit(
        AnnotationUpdateEvent.SET_ANNOTATION_STATE,
        payload,
      );
    };

    inlineCommentGetState(ids).then(cb);
  }, [actions, providers, adfDocument]);
};
