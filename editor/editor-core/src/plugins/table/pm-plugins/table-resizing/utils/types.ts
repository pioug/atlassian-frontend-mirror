import { ColumnState } from './column-state';

export interface ResizeState {
  cols: ColumnState[];
  maxSize: number;
}
