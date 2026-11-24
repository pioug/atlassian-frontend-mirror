import { BoundedMap } from '../../collections/bounded-map';

describe('BoundedMap', () => {
	/** What the map holds, in the order it was added, which is what the oldest is read off. */
	const entriesOf = (map: BoundedMap<string, number>): [string, number][] => {
		const entries: [string, number][] = [];
		map.forEach((value: number, key: string) => entries.push([key, value]));

		return entries;
	};

	it('keeps what it was given', () => {
		const map = new BoundedMap<string, number>(2);
		map.set('a', 1);

		expect(map.get('a')).toBe(1);
		expect(map.get('b')).toBeUndefined();
	});

	it('drops nothing while there is room', () => {
		const map = new BoundedMap<string, number>(2);
		map.set('a', 1);
		map.set('b', 2);

		expect(entriesOf(map)).toEqual([
			['a', 1],
			['b', 2],
		]);
	});

	it('forgets the oldest once it is over the limit', () => {
		const map = new BoundedMap<string, number>(2);
		map.set('a', 1);
		map.set('b', 2);
		map.set('c', 3);

		expect(entriesOf(map)).toEqual([
			['b', 2],
			['c', 3],
		]);
	});

	it('counts a key set again as the newest, so the one before it goes first', () => {
		const map = new BoundedMap<string, number>(2);
		map.set('a', 1);
		map.set('b', 2);
		// Without this counting as new, `a` would stay the oldest and be dropped instead of `b`.
		map.set('a', 3);

		map.set('c', 4);

		expect(entriesOf(map)).toEqual([
			['a', 3],
			['c', 4],
		]);
	});
});
