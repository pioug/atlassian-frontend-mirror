import { getHackerNoun } from '../../utils/mockData';

export type MediaCollection = {
	readonly name: string;
	readonly createdAt: number;
};

export function createCollection(name?: string): MediaCollection {
	return {
		name: name || getHackerNoun(),
		createdAt: Date.now(),
	};
}
