import { Node } from 'prosemirror-model';

export interface Transformer<T> {
  encode(node: Node): T;
  parse(content: T): Node;
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
  NO_ORDER = 'no_order',
}

export { AnnotationUpdateEmitter, AnnotationUpdateEvent } from './annotation';
export type {
  AnnotationState,
  AnnotationProviders,
  AnnotationUpdateEventPayloads,
  InlineCommentSelectionComponentProps,
  InlineCommentViewComponentProps,
  InlineCommentAnnotationProvider,
  OnAnnotationClickPayload,
  AnnotationByMatches,
  AnnotationActionResult,
} from './annotation';

export type { TypeAheadItem, TypeAheadItemRenderProps } from './type-ahead';
