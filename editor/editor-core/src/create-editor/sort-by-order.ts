import Ranks from '../plugins/rank';

export function sortByOrder(item: 'plugins' | 'nodes' | 'marks') {
  return function (a: { name: string }, b: { name: string }): number {
    return Ranks[item].indexOf(a.name) - Ranks[item].indexOf(b.name);
  };
}

// while functionally the same, in order to avoid potentially rewriting the ~10
// existing implementations of the above function I decided creating a separate
// function avoided that whole mess. If someone can think of a better way to implement
// the above and below into a single function please do so

export function sortByOrderWithTypeName(item: 'plugins' | 'nodes' | 'marks') {
  return function (
    a: { type: { name: string } },
    b: { type: { name: string } },
  ): number {
    return Ranks[item].indexOf(a.type.name) - Ranks[item].indexOf(b.type.name);
  };
}
