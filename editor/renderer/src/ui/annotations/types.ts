import { AnnotationMarkStates } from '@atlaskit/adf-schema';
import { AnnotationProviders } from '@atlaskit/editor-common';

export enum InsertDraftPosition {
  AROUND_TEXT = 'AROUND_TEXT',
  START = 'START',
  END = 'END',
  INSIDE = 'INSIDE',
}

export type Position = { from: number; to: number };
export type AnnotationsWrapperProps = {
  annotationProvider:
    | AnnotationProviders<AnnotationMarkStates>
    | null
    | undefined;
  rendererRef: React.RefObject<HTMLDivElement>;
};

export type TextPosition = {
  start: number;
  end: number;
};
