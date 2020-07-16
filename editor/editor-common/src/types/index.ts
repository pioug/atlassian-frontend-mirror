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

export {
  AnnotationState,
  AnnotationProviders,
  AnnotationUpdateEmitter,
  AnnotationUpdateEvent,
  AnnotationUpdateEventPayloads,
  InlineCommentSelectionComponentProps,
} from './annotation';

export { TypeAheadItem, TypeAheadItemRenderProps } from './typeAhead';
