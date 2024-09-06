import { type Avatar } from '../src/avatar-list';
import samples from './samples';

function generateAvatarIds(count = samples.length): Array<number> {
	const result: Array<number> = [];
	for (let i = 0; i < count; ++i) {
		result[i] = (i + 1) % samples.length;
	}
	return result;
}

export function generateAvatars(count?: number): Array<Avatar> {
	return generateAvatarIds(count).map((id) => ({
		dataURI: samples[id],
		name: id.toString(),
	}));
}
