import { TrackAEP } from './utils';
import {
  ACTION,
  ACTION_SUBJECT_ID,
  ACTION_SUBJECT,
  INPUT_METHOD,
} from './enums';

export type AnnotationActionType =
  | ACTION.INSERTED
  | ACTION.CLOSED
  | ACTION.EDITED
  | ACTION.DELETED
  | ACTION.OPENED
  | ACTION.RESOLVED
  | ACTION.VIEWED;

export type AnnotationAEP = TrackAEP<
  AnnotationActionType,
  ACTION_SUBJECT.ANNOTATION,
  ACTION_SUBJECT_ID.INLINE_COMMENT,
  AnnotationAEPAttributes,
  undefined
>;

export type AnnotationAEPAttributes =
  | undefined
  | {}
  | AnnotationDraftAEPAttributes
  | AnnotationResolvedAEPAttributes;

export type AnnotationDraftAEPAttributes = {
  inputMethod: INPUT_METHOD.TOOLBAR | INPUT_METHOD.SHORTCUT;
  //overlap is how many other annotations are within or overlapping with the new selection
  overlap: number;
};

export type AnnotationResolvedAEPAttributes = {
  method: RESOLVE_METHOD;
};

export enum RESOLVE_METHOD {
  COMPONENT = 'component',
  CONSUMER = 'consumer',
  ORPHANED = 'orphaned',
}
