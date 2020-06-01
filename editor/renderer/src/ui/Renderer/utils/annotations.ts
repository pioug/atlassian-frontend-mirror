import { Schema, Node as PMNode } from 'prosemirror-model';
import {
  AnnotationTypes,
  AnnotationId,
  AnnotationMarkStates,
} from '@atlaskit/adf-schema';
import { AnnotationState } from '@atlaskit/editor-common';

export class Deferred<T> {
  promise: Promise<T>;
  isFulfilled: boolean = false;
  reject?: () => void;
  resolve?: (arg: T) => void;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });

    this.promise.then(() => {
      this.isFulfilled = true;
    });
  }
}

type AnnotationIdsByType = {
  [AnnotationTypes: string]: AnnotationId[];
};

const annotationPromises: Map<
  AnnotationId,
  Deferred<AnnotationMarkStates>
> = new Map();

const getOrCreateDeferredPromise = (
  id: AnnotationId,
): Deferred<AnnotationMarkStates> => {
  let deferred = annotationPromises.get(id);

  if (!deferred) {
    deferred = new Deferred();
    annotationPromises.set(id, deferred);
  }

  return deferred;
};

export const cleanAnnotations = () => {
  annotationPromises.clear();
};

export const getAnnotationDeferred = (
  id: AnnotationId,
): Deferred<AnnotationMarkStates> => {
  return getOrCreateDeferredPromise(id);
};

export const resolveAnnotationPromises = (
  data: AnnotationState<AnnotationTypes.INLINE_COMMENT, AnnotationMarkStates>[],
): void => {
  if (!data || !data.length) {
    return;
  }

  data.forEach(({ id, state }) => {
    const deferred = getOrCreateDeferredPromise(id);

    deferred.resolve!(state);
  });
};

export const getAllAnnotationMarks = (
  schema: Schema,
  node: PMNode,
): AnnotationIdsByType => {
  const annotationIds: AnnotationIdsByType = {
    [AnnotationTypes.INLINE_COMMENT]: [],
  };

  const {
    marks: { annotation: annotationMarkType },
  } = schema;

  if (!(annotationMarkType && node)) {
    return annotationIds;
  }

  node.descendants(node => {
    const annotationsMark = node.marks.filter(
      m => m.type === annotationMarkType,
    );
    if (!annotationsMark || !annotationsMark.length) {
      return true;
    }

    annotationsMark.forEach(annotationMark => {
      const { attrs } = annotationMark;
      if (
        attrs &&
        attrs.id &&
        attrs.annotationType &&
        annotationIds[attrs.annotationType]
      ) {
        annotationIds[attrs.annotationType].push(attrs.id);
      }
    });

    return false;
  });

  return annotationIds;
};
