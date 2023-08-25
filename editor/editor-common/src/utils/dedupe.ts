export function dedupe<T>(
  list: T[] = [],
  iteratee: (p: T) => T[keyof T] | T = (p) => p,
): T[] {
  /**
              .,
    .      _,'f----.._
    |\ ,-'"/  |     ,'
    |,_  ,--.      /
    /,-. ,'`.     (_
    f  o|  o|__     "`-.
    ,-._.,--'_ `.   _.,-`
    `"' ___.,'` j,-'
      `-.__.,--'
    Gotta go fast!
 */

  const seen = new Set();
  list.forEach((l) => seen.add(iteratee(l)));

  return list.filter((l) => {
    const it = iteratee(l);
    if (seen.has(it)) {
      seen.delete(it);
      return true;
    }
    return false;
  });
}
