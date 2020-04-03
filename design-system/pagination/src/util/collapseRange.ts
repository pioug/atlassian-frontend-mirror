export default function collapseRange<T>(
  pages: Array<T>,
  current: number,
  {
    max,
    ellipsis,
  }: {
    max: number;
    ellipsis: (arg: { key: string }) => T;
  },
): Array<T> {
  const total = pages.length;
  // only need ellipsis if we have more pages than we can display
  const needEllipsis = total > max;
  // show start ellipsis if the current page is further away than max - 3 from the first page
  const hasStartEllipsis = needEllipsis && max - 3 < current;
  // show end ellipsis if the current page is further than total - max + 3 from the last page
  const hasEndEllipsis = needEllipsis && current < total - max + 4;

  if (!needEllipsis) {
    return pages;
  }
  if (hasStartEllipsis && !hasEndEllipsis) {
    const pageCount = max - 2;
    return [
      pages[0],
      ellipsis({ key: 'elipses-1' }),
      ...pages.slice(total - pageCount),
    ];
  }
  if (!hasStartEllipsis && hasEndEllipsis) {
    const pageCount = max - 2;
    return [
      ...pages.slice(0, pageCount),
      ellipsis({ key: 'elipses-1' }),
      pages[total - 1],
    ];
  }
  // we have both start and end ellipsis
  const pageCount = max - 4;
  return [
    pages[0],
    ellipsis({ key: 'elipses-1' }),
    ...pages.slice(
      current - Math.floor(pageCount / 2),
      current + pageCount - 1,
    ),
    ellipsis({ key: 'elipses-2' }),
    pages[total - 1],
  ];
}
