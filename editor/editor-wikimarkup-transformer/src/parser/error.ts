export function error(message: string, _input: string, line: number, column: number) {
	throw createError({
		message,
		line,
		column,
	});
}

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createError(props: any) {
	const err = Object.create(SyntaxError.prototype);

	Object.assign(err, props, {
		name: 'SyntaxError',
	});

	return err;
}
