/**
 * @additionalProperties true
 */
export interface MarksObject<T> {
	marks?: Array<T>;
}

/**
 * @additionalProperties true
 */
export interface NoMark {
	/**
	 * @maxItems 0
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	marks?: Array<any>;
}
