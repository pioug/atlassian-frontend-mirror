import type { Command, Predicate } from '../types';

export const filter = (
  predicates: Predicate[] | Predicate,
  cmd: Command,
): Command => {
  return function (state, dispatch, view): boolean {
    if (!Array.isArray(predicates)) {
      predicates = [predicates];
    }

    if (predicates.some((pred) => !pred(state, view))) {
      return false;
    }

    return cmd(state, dispatch, view) || false;
  };
};
