import { LinkLozengeColor, LinkState } from './types';

const VALID_APPEARANCES: LinkLozengeColor[] = [
  'default',
  'success',
  'removed',
  'inprogress',
  'new',
  'moved',
];
export const isValidAppearance = (
  appearance: any,
): appearance is LinkLozengeColor => {
  return VALID_APPEARANCES.indexOf(appearance) !== -1;
};

export const VALID_STATES: Record<LinkState, LinkLozengeColor> = {
  open: 'inprogress',
  merged: 'success',
  declined: 'removed',
  closed: 'success',
  draft: 'inprogress',
  archived: 'default',
};

export const OMIT_STATES = ['current'];
