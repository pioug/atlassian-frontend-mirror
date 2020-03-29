// Popper is not in TypeScript yet....
// import { Placement } from '@atlaskit/popper' once it is.
type Placement =
  | 'auto-start'
  | 'auto'
  | 'auto-end'
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'bottom-end'
  | 'bottom'
  | 'bottom-start'
  | 'left-end'
  | 'left'
  | 'left-start';

export const Placements: Array<Placement> = [
  'auto-end',
  'auto',
  'auto-start',
  'top-end',
  'top',
  'top-start',
  'right-end',
  'right',
  'right-start',
  'bottom-start',
  'bottom',
  'bottom-end',
  'left-start',
  'left',
  'left-end',
];
