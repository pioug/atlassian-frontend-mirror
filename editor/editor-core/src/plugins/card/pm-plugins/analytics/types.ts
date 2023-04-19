import { Mark, Node } from 'prosemirror-model';

export type Link =
  | {
      type: 'node';
      pos: number;
      node: Node;
    }
  | {
      type: 'mark';
      pos: number;
      mark: Mark;
    };
