import { random } from './random';

function padMinutes(minutes: number): string {
	return minutes < 10 ? `0${minutes}` : String(minutes);
}

export const getTimeString = (): string => {
	const hours = random(23);
	const minutes = random(59);
	const meridiem = ['am', 'pm'][Math.floor(hours / 12)];

	return `${hours === 0 ? 12 : hours % 12}:${padMinutes(minutes)}${meridiem}`;
};
