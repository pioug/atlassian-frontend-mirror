import Ranks from '../plugins/rank';

export function sortByOrder(item: 'plugins' | 'nodes' | 'marks') {
  return function (a: { name: string }, b: { name: string }): number {
    return Ranks[item].indexOf(a.name) - Ranks[item].indexOf(b.name);
  };
}
