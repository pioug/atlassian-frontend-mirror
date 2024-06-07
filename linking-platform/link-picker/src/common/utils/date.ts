import isBefore from 'date-fns/isBefore';
import startOfDay from 'date-fns/startOfDay';
import subWeeks from 'date-fns/subWeeks';

export function isMoreThanOneWeekAgo(date: string | Date) {
	return isBefore(new Date(date), startOfOneWeekAgo());
}

function startOfOneWeekAgo() {
	return startOfDay(subWeeks(new Date(), 1));
}
