import { type ReactElement } from 'react';

import memoizeOne from 'memoize-one';

// TODO: comma needed after generic declaration below, or the .tsx file thinks
// it is a JSX element. Tidy up in a future refactor.
const collapseRange = <T,>(
	pages: Array<T>,
	current: number,
	{
		max,
		ellipsis,
		transform,
	}: {
		max: number;
		ellipsis: (arg: { key: string; testId?: string; from: number; to: number }) => ReactElement;
		transform: (page: T, index: number, testId?: string) => ReactElement;
	},
	testId?: string,
): ReactElement[] => {
	const total = pages.length;
	// only need ellipsis if we have more pages than we can display
	const needEllipsis = total > max;
	// show start ellipsis if the current page is further away than max - 4 from the first page
	const hasStartEllipsis = needEllipsis && max - 4 < current;
	// show end ellipsis if the current page is further than total - max + 3 from the last page
	const hasEndEllipsis = needEllipsis && current < total - max + 3;

	const getPageComponents = memoizeOne((startIndex: number = 0, lastIndex: number = total) => {
		return pages
			.slice(startIndex, lastIndex)
			.map((page, index) => transform(page, startIndex + index, testId));
	});

	if (!needEllipsis) {
		return getPageComponents(0, total);
	}
	if (hasStartEllipsis && !hasEndEllipsis) {
		const pageCount = max - 2;
		return [
			...getPageComponents(0, 1),
			ellipsis({
				key: 'ellipsis-1',
				testId: testId && `${testId}-ellipsis`,
				from: 2,
				to: total - pageCount,
			}),
			...getPageComponents(total - pageCount),
		];
	}
	if (!hasStartEllipsis && hasEndEllipsis) {
		const pageCount = max - 2;
		return [
			...getPageComponents(0, pageCount),
			ellipsis({
				key: 'ellipsis-1',
				testId: testId && `${testId}-ellipsis`,
				from: pageCount + 1,
				to: total - 1,
			}),
			...getPageComponents(total - 1),
		];
	}
	// we have both start and end ellipsis
	const pageCount = max - 4;
	return [
		...getPageComponents(0, 1),
		ellipsis({
			key: 'ellipsis-1',
			testId: testId && `${testId}-ellipsis`,
			from: 2,
			to: current - Math.floor(pageCount / 2),
		}),
		...getPageComponents(current - Math.floor(pageCount / 2), current + pageCount - 1),
		ellipsis({
			key: 'ellipsis-2',
			testId: testId && `${testId}-ellipsis`,
			from: current + 3,
			to: total - 1,
		}),
		...getPageComponents(total - 1),
	];
};

export default collapseRange;
