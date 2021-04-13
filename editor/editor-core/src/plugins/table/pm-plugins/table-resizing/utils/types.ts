import { ColumnState } from './column-state';
import { ContentNodeWithPos } from 'prosemirror-utils';

export interface ResizeState {
  cols: ColumnState[];
  widths: number[];
  maxSize: number;
  overflow: boolean;
}
export interface ResizeStateWithAnalytics {
  resizeState: ResizeState;
  table: ContentNodeWithPos;
  changed: boolean;
  attributes: {
    position: number;
    count: number;
    totalRowCount: number;
    totalColumnCount: number;
    widthsBefore: number[];
    widthsAfter: number[];
  };
}
