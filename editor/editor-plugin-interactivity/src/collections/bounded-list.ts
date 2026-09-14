/** An array that forgets its oldest item once it holds more than `limit`. */
export class BoundedList<Item> {
	private readonly items: Item[] = [];

	constructor(private readonly limit: number) {}

	push(...items: Item[]): void {
		this.items.push(...items);
		// Negative when there is still room, and `splice` then removes nothing.
		this.items.splice(0, this.items.length - this.limit);
	}

	[Symbol.iterator](): IterableIterator<Item> {
		return this.items[Symbol.iterator]();
	}

	findLast(matches: (item: Item) => boolean): Item | undefined {
		for (let index = this.items.length - 1; index >= 0; index -= 1) {
			if (matches(this.items[index])) {
				return this.items[index];
			}
		}

		return undefined;
	}
}
