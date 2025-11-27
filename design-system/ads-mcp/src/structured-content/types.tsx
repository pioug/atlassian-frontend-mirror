export type TokenSchema = {
	contentType: 'token';
	/**
	 * The name of the token, e.g. `color.text`
	 */
	name: string;
	/**
	 * The constituent parts of the tokens' name, e.g. `['color', 'text', '[default]' ]
	 */
	path: string[];
	/**
	 * A brief explanation of where and how to use the token
	 */
	description: string;
	/**
	 * CSS value to use as an example of what this token might look like
	 */
	exampleValue: string;
};

// Only Tokens for now, but this will end up being a discriminated union on `contentType` with the different content types.
export type ContentSchema = TokenSchema;
