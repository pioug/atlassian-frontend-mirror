import { Edge, Spacing } from '../../internal-types';

export type HitboxSpacing = {
  [Key in keyof Spacing]: Spacing;
};

export type HitboxForEdge = {
  edge: Edge;
  insideEdge: DOMRect;
  outsideEdge: DOMRect;
  isWithin: 'inside-edge' | 'outside-edge';
};
