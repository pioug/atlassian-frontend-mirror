import type { TransformerNames } from './transforms/transformerNames';
import type { ADFMarkSpec } from './types/ADFMarkSpec';

export class ADFMark<TMarkSpec extends ADFMarkSpec> {
	#type: string;
	#spec: TMarkSpec | null = null;
	#group: string | null = null;

	constructor(public type: string) {
		this.#type = type;
	}

	/**
	 * Returns true if the mark has been defined, e.g. mark.define() method was called.
	 */
	isDefined(): boolean {
		return !!this.#spec;
	}

	/**
	 * Checks whether the mark is ignored by a given transformer.
	 */
	isIgnored(transformerName: TransformerNames): boolean | undefined {
		if (!this.#spec) {
			throw new Error('Mark is not defined');
		}
		return this.#spec.ignore?.includes(transformerName);
	}

	/**
	 * Define a mark.
	 *
	 * Assigns MarkSpec to the mark.
	 */
	define<T extends TMarkSpec>(spec: T): ADFMark<TMarkSpec> {
		if (this.#spec) {
			throw new Error('Cannot re-define a mark');
		}
		this.#spec = spec;
		return this;
	}

	getSpec(): TMarkSpec {
		// @ts-expect-error
		return this.#spec;
	}

	getType(): string {
		return this.#type;
	}

	/**
	 * Returns a full name of the mark.
	 */
	getName() {
		return `${this.#type}_mark`;
	}

	setGroup(group: string): this {
		if (this.#group) {
			throw new Error('Cannot re-define a group');
		}
		this.#group = group;
		return this;
	}

	getGroup(): string | null {
		return this.#group;
	}
}

export function adfMark<TMarkSpec extends ADFMarkSpec>(type: string): ADFMark<TMarkSpec> {
	return new ADFMark(type);
}
