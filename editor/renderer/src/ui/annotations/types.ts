import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { AnnotationProviders } from '@atlaskit/editor-common/types';

export enum InsertDraftPosition {
  AROUND_TEXT = 'AROUND_TEXT',
  START = 'START',
  END = 'END',
  INSIDE = 'INSIDE',
}

export type Position = { from: number; to: number };

export type AnnotationsWrapperProps = React.PropsWithChildren<{
  adfDocument: JSONDocNode;
  annotationProvider: AnnotationProviders | null | undefined;
  rendererRef: React.RefObject<HTMLDivElement>;
  isNestedRender: boolean;
}>;

export type TextPosition = {
  start: number;
  end: number;
};
