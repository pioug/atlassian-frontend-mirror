import type { Edge, Side } from '../internal-types';

export const sideLookup: { [Key in Edge]: Side } = {
  top: 'start',
  right: 'end',
  bottom: 'end',
  left: 'start',
};
