import { random } from './random';

export const getWeekday = (): { index: number; string: string } => {
	const array = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	const index = random(6);

	return {
		index,
		string: array[index],
	};
};
