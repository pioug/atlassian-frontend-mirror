/**
 * Everything in this file is to smooth out the migration of the new date picker
 * (https://product-fabric.atlassian.net/browse/DSP-20682). When that ticket is
 * complete, all of these functions will ilkely be merged back into the date
 * picker. Please do not pre-optimize and put these back into the date picker
 * unless you are working on the DTP Refresh and you have a good reason to do
 * so, thank you!
 *
 * All variables within the `di` objects are dependency injections. They should
 * be read from within the component at the end of the day. But because we are
 * extracting them, we have to inject them in every place manually. When we
 * re-introduce them to the components, we can likely remove the `di` variables
 * and instead use internal variables.
 *
 * If component _only_ has injected variables, it is fully internal and was
 * broken out to be it's own function.
 */

// oxlint-disable-next-line @atlassian/no-restricted-imports
import { lastDayOfMonth } from 'date-fns';

import { padToTwo } from './index';

export const getParsedISO: (di: { iso: string }) => string = (di: { iso: string }): string => {
	const { iso } = di;
	const [year, month, date] = iso.split('-');

	let newIso = iso;

	const parsedDate = parseInt(date, 10);
	const parsedMonth = parseInt(month, 10);
	const parsedYear = parseInt(year, 10);

	const lastDayInMonth = lastDayOfMonth(
		new Date(
			parsedYear,
			parsedMonth - 1, // This needs to be -1, because the Date constructor expects an index of the given month
		),
	).getDate();

	if (lastDayInMonth < parsedDate) {
		newIso = `${parsedYear}-${padToTwo(parsedMonth)}-${padToTwo(lastDayInMonth)}`;
	} else {
		newIso = `${parsedYear}-${padToTwo(parsedMonth)}-${padToTwo(parsedDate)}`;
	}

	return newIso;
};
